"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  SAMPLE_OFFERS,
  SAMPLE_REQUESTS,
  SEARCH_WINDOW_DAYS,
  placeLabel,
  type Listing,
} from "@/lib/travelAssist";
import MatchFinder, { EMPTY_QUERY, type Mode, type Query } from "@/components/travel-assist/MatchFinder";
import AssistBoard from "@/components/travel-assist/AssistBoard";
import PostTripDialog, { type DialogState } from "@/components/travel-assist/PostTripDialog";
import { HASH } from "@/components/travel-assist/constants";
import { isoDate, offsetOf, useToday } from "@/components/travel-assist/dates";

const POOL: Listing[] = [...SAMPLE_REQUESTS, ...SAMPLE_OFFERS];

function place(code: string): string | undefined {
  return code ? placeLabel(code) : undefined;
}

function matchesQuery(listing: Listing, q: Query, mode: Mode, today: number | null): boolean {
  if (q.from && listing.from !== q.from) return false;
  if (q.to && listing.to !== q.to) return false;
  if (q.date && today !== null) {
    if (Math.abs(listing.dayOffset - offsetOf(today, q.date)) > SEARCH_WINDOW_DAYS) return false;
  }
  // Party size only narrows the side the visitor is shopping in.
  if (listing.kind === "offer" && mode === "requester" && listing.capacity < q.count) return false;
  if (listing.kind === "request" && mode === "traveller" && listing.travellers > q.count) return false;
  return true;
}

const byDate = (a: Listing, b: Listing) => a.dayOffset - b.dayOffset;

/**
 * The page's one client island: the match finder, the board it filters, and
 * the post-a-trip dialog, which all share state. Everything else on the page
 * is server-rendered and talks to this through in-page hashes (see HASH): a
 * hero button that links to #offer-to-help flips the finder into helper mode
 * and scrolls to it; any "post your trip" link opens the dialog.
 */
export default function AssistExperience() {
  const today = useToday();
  const reduce = useReducedMotion();
  const finderRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>("requester");
  const [query, setQuery] = useState<Query>(EMPTY_QUERY);
  const [applied, setApplied] = useState<Query | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const scrollTo = useCallback(
    (el: HTMLElement | null) =>
      el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }),
    [reduce]
  );

  const openDialog = useCallback((next: Omit<DialogState, "nonce">) => {
    setDialog((prev) => ({ ...next, nonce: (prev?.nonce ?? 0) + 1 }));
  }, []);

  const closeDialog = useCallback(() => setDialog(null), []);

  /* In-page hashes → state. Runs on load (a shared link to #post-your-trip
     opens the form) and on every hashchange; the hash is then cleared so the
     same link works again on a second click. */
  useEffect(() => {
    const handle = () => {
      const hash = window.location.hash.slice(1);
      switch (hash) {
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

  const { requests, offers } = useMemo(() => {
    const keep = (l: Listing) => (applied ? matchesQuery(l, applied, mode, today) : true);
    return {
      requests: SAMPLE_REQUESTS.filter(keep).sort(byDate),
      offers: SAMPLE_OFFERS.filter(keep).sort(byDate),
    };
  }, [applied, mode, today]);

  const applyAndShow = (q: Query) => {
    setApplied(q.from || q.to || q.date || q.count > 1 ? q : null);
    scrollTo(boardRef.current);
  };

  const prefillFromQuery = (q: Query | null) => ({
    from_location: q ? place(q.from) : undefined,
    to_location: q ? place(q.to) : undefined,
    travel_date: q?.date || undefined,
  });

  return (
    <section aria-labelledby="assist-board-heading" className="bg-sand-500 pb-16 md:pb-24">
      <div className="container-page">
        <div ref={finderRef} id="match-finder" className="relative z-raised -mt-28 scroll-mt-24 sm:-mt-32">
          <h2 className="sr-only">Find a travel companion</h2>
          <MatchFinder
            mode={mode}
            onModeChange={setMode}
            query={query}
            onQueryChange={setQuery}
            onSubmit={() => applyAndShow(query)}
            onCorridor={(from, to) => {
              const next = { ...query, from, to };
              setQuery(next);
              applyAndShow(next);
            }}
          />
        </div>

        <div ref={boardRef} className="mt-14 scroll-mt-24 md:mt-20">
          <AssistBoard
            mode={mode}
            requests={requests}
            offers={offers}
            pool={POOL}
            applied={applied}
            today={today}
            onClear={() => {
              setApplied(null);
              setQuery(EMPTY_QUERY);
            }}
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
                prefill: prefillFromQuery(applied),
              })
            }
          />
        </div>
      </div>

      <PostTripDialog state={dialog} onClose={closeDialog} />
    </section>
  );
}
