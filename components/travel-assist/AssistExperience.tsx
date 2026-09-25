"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Info, X } from "lucide-react";
import {
  SAMPLE_OFFERS,
  SAMPLE_REQUESTS,
  STRIP_DAYS,
  cityOf,
  helpLabel,
  placeLabel,
  type Listing,
} from "@/lib/travelAssist";
import MatchFinder, { EMPTY_QUERY, type Mode, type Query } from "@/components/travel-assist/MatchFinder";
import DateStrip, { type DayCount } from "@/components/travel-assist/DateStrip";
import AssistBoard from "@/components/travel-assist/AssistBoard";
import PostTripDialog, { type DialogState } from "@/components/travel-assist/PostTripDialog";
import { HASH } from "@/components/travel-assist/constants";
import { isoDate, offsetOf, shortDate, useToday } from "@/components/travel-assist/dates";

const POOL: Listing[] = [...SAMPLE_REQUESTS, ...SAMPLE_OFFERS];

function place(code: string): string | undefined {
  return code ? placeLabel(code) : undefined;
}

/** Everything except the date: route, language, kind of help. */
function matchesBase(l: Listing, q: Query): boolean {
  if (q.from && l.from !== q.from) return false;
  if (q.to && l.to !== q.to) return false;
  if (q.language && !l.languages.includes(q.language)) return false;
  if (q.help) {
    const tags: string[] = l.kind === "request" ? l.needs : l.helpsWith;
    if (!tags.includes(q.help)) return false;
  }
  return true;
}

const byDate = (a: Listing, b: Listing) => a.dayOffset - b.dayOffset;

/**
 * The page's one client island: the search bar, the date strip and board it
 * filters, and the post-a-trip dialog. Everything else on the page is
 * server-rendered and talks to this through in-page hashes (see HASH).
 */
export default function AssistExperience() {
  const today = useToday();
  const reduce = useReducedMotion();
  const finderRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>("requester");
  const [query, setQuery] = useState<Query>(EMPTY_QUERY);
  const [applied, setApplied] = useState<Query>(EMPTY_QUERY);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const scrollTo = useCallback(
    (el: HTMLElement | null) => el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }),
    [reduce]
  );

  const openDialog = useCallback((next: Omit<DialogState, "nonce">) => {
    setDialog((prev) => ({ ...next, nonce: (prev?.nonce ?? 0) + 1 }));
  }, []);
  const closeDialog = useCallback(() => setDialog(null), []);

  /* In-page hashes → state (on load and on every hashchange); the hash is
     then cleared so the same link works again on a second click. */
  useEffect(() => {
    const handle = () => {
      switch (window.location.hash.slice(1)) {
        case HASH.findCompanion:
          setMode("requester");
          scrollTo(finderRef.current);
          break;
        case HASH.offerHelp:
          setMode("traveller");
          scrollTo(finderRef.current);
          break;
        case HASH.postTrip:
        case HASH.legacyPost:
          openDialog({ role: "requester" });
          break;
        case HASH.postOffer:
          openDialog({ role: "traveller" });
          break;
        default:
          return;
      }
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    };
    const frame = window.requestAnimationFrame(handle);
    window.addEventListener("hashchange", handle);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", handle);
    };
  }, [openDialog, scrollTo]);

  const target = applied.date && today !== null ? offsetOf(today, applied.date) : null;

  const { requests, offers, counts } = useMemo(() => {
    const base = (l: Listing) => matchesBase(l, applied);
    const onDate = (l: Listing) => target === null || Math.abs(l.dayOffset - target) <= applied.flex;
    const counts: DayCount[] = Array.from({ length: STRIP_DAYS }, (_, day) => ({
      families: SAMPLE_REQUESTS.filter((l) => base(l) && l.dayOffset === day).length,
      helpers: SAMPLE_OFFERS.filter((l) => base(l) && l.dayOffset === day).length,
    }));
    return {
      requests: SAMPLE_REQUESTS.filter((l) => base(l) && onDate(l)).sort(byDate),
      offers: SAMPLE_OFFERS.filter((l) => base(l) && onDate(l)).sort(byDate),
      counts,
    };
  }, [applied, target]);

  const apply = (q: Query, scroll = true) => {
    setApplied(q);
    if (scroll) scrollTo(boardRef.current);
  };

  const pickDay = (day: number | null) => {
    if (today === null) return;
    const next: Query =
      day === null ? { ...query, date: "" } : { ...query, date: isoDate(today, day), flex: 0 };
    setQuery(next);
    apply(next, false);
  };

  const summary: string[] = [];
  if (applied.from || applied.to) {
    summary.push(`${applied.from ? cityOf(applied.from) : "Anywhere"} → ${applied.to ? placeLabel(applied.to) : "anywhere"}`);
  }
  if (target !== null && today !== null) {
    summary.push(`${applied.flex ? "around " : ""}${shortDate(today, target)}`);
  }
  if (applied.language) summary.push(applied.language);
  if (applied.help) summary.push(helpLabel(applied.help));

  return (
    <section aria-labelledby="assist-board-heading" className="bg-sand-500 pb-16 md:pb-24">
      <div className="container-page">
        <div ref={finderRef} id="match-finder" className="relative z-raised -mt-40 scroll-mt-28 sm:-mt-36 lg:-mt-24">
          <h2 className="sr-only">Search the board</h2>
          <MatchFinder
            mode={mode}
            onModeChange={setMode}
            query={query}
            onQueryChange={setQuery}
            onSubmit={() => apply(query)}
          />
        </div>

        <div ref={boardRef} className="mt-14 scroll-mt-24 md:mt-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="t-overline text-primary-500">Who&rsquo;s flying when</p>
              <h2 id="assist-board-heading" className="mt-2 t-h2 text-primary-800">
                Pick a day, see who&rsquo;s travelling
              </h2>
            </div>
            {summary.length > 0 && (
              <div
                role="status"
                className="inline-flex max-w-full items-center gap-2 self-start rounded-full bg-primary-800 py-1.5 pl-4 pr-1.5 t-label-2 text-text-on-dark md:self-auto"
              >
                <span className="truncate">{summary.join(" · ")}</span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(EMPTY_QUERY);
                    setApplied(EMPTY_QUERY);
                  }}
                  aria-label="Clear search and show everyone"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-neutral-000/15 transition-colors hover:bg-neutral-000/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-lg bg-neutral-000/70 p-4 ring-1 ring-sand-600 sm:p-5">
            <DateStrip today={today} counts={counts} selected={applied.flex === 0 ? target : null} onSelect={pickDay} />
          </div>

          {/* Honesty note: sample listings until the live feed is connected
              (see lib/travelAssist.ts). Remove once it is. */}
          <p className="mt-4 flex items-center gap-2 t-caption text-text-secondary">
            <Info className="h-3.5 w-3.5 shrink-0 text-primary-500" aria-hidden="true" />
            Sample listings shown while the board opens to the public.
          </p>

          <div className="mt-10">
            <AssistBoard
              mode={mode}
              requests={requests}
              offers={offers}
              pool={POOL}
              today={today}
              onAct={(listing) =>
                openDialog({
                  // Answering a family means offering help, and vice versa.
                  role: listing.kind === "request" ? "traveller" : "requester",
                  withName: listing.name,
                  prefill: {
                    from_location: place(listing.from),
                    to_location: place(listing.to),
                    travel_date: today === null ? undefined : isoDate(today, listing.dayOffset),
                    airline: listing.airline,
                  },
                })
              }
              onPost={(kind) =>
                openDialog({
                  role: kind === "offer" ? "requester" : "traveller",
                  prefill: {
                    from_location: place(applied.from),
                    to_location: place(applied.to),
                    travel_date: applied.date || undefined,
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      <PostTripDialog state={dialog} onClose={closeDialog} />
    </section>
  );
}
