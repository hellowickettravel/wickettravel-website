"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpDown,
  CalendarDays,
  Check,
  HandHeart,
  Info,
  Languages,
  Loader2,
  MessageCircle,
  Plane,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { BUSINESS } from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/links";
import {
  avatarTone,
  daysUntil,
  departureLabel,
  initialsOf,
  type ParsedEntry,
  placeKey,
  postedAgo,
  searchHaystack,
  splitPlace,
} from "@/lib/parents";
import { useParentBoard } from "@/lib/useParentBoard";

/**
 * THE BOARD — /parents-tickets' centrepiece, and the whole point of the page.
 *
 * WHAT CHANGED AND WHY. This replaces components/ParentsBoard.tsx (a plain
 * three-up grid with three filter pills) and the auto-scrolling marquee that
 * sat on the main page. Neither matched what this audience actually does:
 * they are already running this service by hand in WhatsApp groups, where the
 * message is "flying LHR→HYD Thursday, anyone need help?" and somebody
 * recognises their own route and replies. A marquee you cannot search, and a
 * grid you cannot narrow to your own airport and your own date, cannot
 * replace that — so the board is now built around the three questions that
 * thread actually asks:
 *
 *   who is flying today?   → the departures rail, pinned above everything
 *   is anyone on my route? → free-text search + from/to/airline filters
 *   which side are they?   → both parties side by side, never interleaved
 *
 * TWO-COLUMN BY DEFAULT. Families and travellers are rendered as two facing
 * columns rather than one merged list. A merged list makes you read every
 * card to work out which half you are in; facing columns make the trade
 * obvious at a glance, and make an imbalance ("nine families, one traveller
 * this week") visible — which is itself the argument for posting.
 *
 * PRIVACY IS UNCHANGED. Every field rendered here is one the poster ticked a
 * box to publish, the feed carries no contact details at all, and the only
 * call to action is still "ask our team" — nobody can message anybody off a
 * card. Avatars are initials on a tinted disc, never a photograph: there is
 * no real face in this data and a stock portrait would imply there was.
 */

type Side = "all" | "requester" | "traveller";
type When = "any" | "today" | "week" | "month";
type Sort = "soonest" | "newest" | "amount";

const WHEN_OPTIONS: { key: When; label: string }[] = [
  { key: "any", label: "Any date" },
  { key: "today", label: "Today / tomorrow" },
  { key: "week", label: "Next 7 days" },
  { key: "month", label: "Next 30 days" },
];

const SORT_OPTIONS: { key: Sort; label: string }[] = [
  { key: "soonest", label: "Departing soonest" },
  { key: "newest", label: "Recently posted" },
  { key: "amount", label: "Highest amount" },
];

/* ── Small parts ───────────────────────────────────────────────────────── */

function Avatar({
  name,
  size = "md",
}: {
  name: string | undefined;
  size?: "sm" | "md";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-sans font-extrabold ring-1",
        avatarTone(name),
        size === "sm"
          ? "h-10 w-10 text-[13px] leading-none"
          : "h-12 w-12 text-[15px] leading-none"
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

/** The date chip. Tone escalates as the flight gets closer — that urgency is
 *  the single most useful thing on the card for this audience. */
function DepartureChip({ iso }: { iso: string | undefined }) {
  const label = departureLabel(iso);
  if (!label) return null;
  return (
    <span
      className={cn(
        "pill",
        label.tone === "today" && "bg-accent-500 text-neutral-000",
        label.tone === "soon" && "bg-accent-100 text-accent-700",
        label.tone === "later" && "bg-primary-050 text-primary-700",
        label.tone === "past" && "bg-neutral-100 text-text-secondary"
      )}
    >
      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
      {label.text}
    </span>
  );
}

/** One end of a route — the code large, the place name under it. Hoisted out
 *  of <Route> rather than declared inside it: a component defined during
 *  render is a new type on every pass, so React remounts it each time. */
function RouteEnd({
  place,
  align,
}: {
  place: { code: string | undefined; name: string | undefined };
  align: "left" | "right";
}) {
  return (
    <div className={cn("min-w-0", align === "right" && "text-right")}>
      <p className="t-h4 truncate text-primary-800">
        {place.code ?? place.name ?? "—"}
      </p>
      {place.name && place.code && (
        <p className="t-caption mt-0.5 truncate text-text-secondary">
          {place.name}
        </p>
      )}
    </div>
  );
}

/** FROM ✈ TO, as a boarding-pass style route rather than a sentence. */
function Route({
  from,
  to,
  accent,
}: {
  from: string | undefined;
  to: string | undefined;
  accent: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <RouteEnd place={splitPlace(from)} align="left" />
      <div className="mt-2 flex min-w-0 flex-1 items-center gap-1">
        <span className="h-px flex-1 bg-neutral-300" />
        <Plane className={cn("h-4 w-4 shrink-0", accent)} aria-hidden="true" />
        <span className="h-px flex-1 border-t border-dashed border-neutral-300" />
      </div>
      <RouteEnd place={splitPlace(to)} align="right" />
    </div>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────── */

function BoardCard({ entry }: { entry: ParsedEntry }) {
  const {
    isTraveller,
    isSample,
    reference,
    name,
    from,
    to,
    dateISO,
    postedISO,
    airline,
    languages,
    body,
    relationship,
    mobility,
    parentAge,
    capacity,
    amount,
  } = entry;

  const posted = postedAgo(postedISO);

  const facts: string[] = [];
  if (isTraveller) {
    if (capacity !== undefined) {
      facts.push(`Can accompany ${capacity} ${capacity === 1 ? "person" : "people"}`);
    }
  } else {
    if (relationship) facts.push(`Posted by their ${relationship.toLowerCase()}`);
    if (parentAge !== undefined) facts.push(`Age ${parentAge}`);
    if (mobility) facts.push(mobility);
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-md border bg-neutral-000 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-e2",
        isTraveller
          ? "border-neutral-300 hover:border-primary-200"
          : "border-neutral-300 hover:border-accent-200"
      )}
    >
      {/* Side stripe — the fastest possible read of which half you're in. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          isTraveller ? "bg-primary-800" : "bg-accent-500"
        )}
      />

      <div className="flex items-start gap-3 p-5 pt-6">
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <p className="t-label-1 truncate text-primary-800">
            {name ?? "A board member"}
          </p>
          <p className="t-caption mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-text-secondary">
            <span
              className={cn(
                "inline-flex items-center gap-1 font-bold",
                isTraveller ? "text-primary-700" : "text-accent-700"
              )}
            >
              {isTraveller ? (
                <HandHeart className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Users className="h-3 w-3" aria-hidden="true" />
              )}
              {isTraveller ? "Offering to help" : "Needs a companion"}
            </span>
            {posted && <span className="whitespace-nowrap">· {posted}</span>}
          </p>
        </div>
        {isSample && (
          <span className="pill shrink-0 bg-neutral-100 text-text-secondary">
            Example
          </span>
        )}
      </div>

      <div className="px-5">
        <Route
          from={from}
          to={to}
          accent={isTraveller ? "text-primary-500" : "text-accent-500"}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 px-5">
        <DepartureChip iso={dateISO} />
        {airline && (
          <span className="pill bg-neutral-100 text-text-secondary">
            <Plane className="h-3.5 w-3.5" aria-hidden="true" />
            {airline}
          </span>
        )}
        {languages && (
          <span className="pill bg-neutral-100 text-text-secondary">
            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
            {languages}
          </span>
        )}
      </div>

      {body && (
        <p className="t-body-sm mt-4 line-clamp-3 px-5 text-text-secondary">
          {body}
        </p>
      )}

      {facts.length > 0 && (
        <p className="t-caption mt-3 px-5 text-text-secondary">
          {facts.join(" · ")}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-5 py-4">
        <span className="t-caption text-text-secondary">
          {amount !== undefined && amount > 0 ? (
            <>
              {isTraveller ? "Asking" : "Offering"}{" "}
              <span className="t-label-1 text-primary-800">£{amount}</span>
            </>
          ) : amount === 0 ? (
            <span className="t-label-2 text-success">No charge</span>
          ) : (
            "Amount agreed directly"
          )}
        </span>

        {reference ? (
          <Link
            href={`/parents-tickets/listing/${encodeURIComponent(reference)}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xs t-label-2 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2",
              isTraveller
                ? "text-primary-800 hover:text-primary-700"
                : "text-accent-700 hover:text-accent-600"
            )}
          >
            Ask for an introduction
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <a href={`tel:${BUSINESS.phone}`} className="btn btn-outline btn-sm">
            Ask us
          </a>
        )}
      </div>
    </article>
  );
}

/* ── Stats strip ───────────────────────────────────────────────────────── */

/**
 * Four numbers, read straight off the entries in hand — no invented metrics,
 * no "average response time" nobody measures. It exists to make the board
 * read as a live product rather than a page: you can see the size of the
 * thing before you read a word of it.
 */
function Stats({ entries }: { entries: ParsedEntry[] }) {
  const today = entries.filter((e) => {
    const d = daysUntil(e.dateISO);
    return d === 0 || d === 1;
  }).length;
  const requests = entries.filter((e) => e.type !== "traveller").length;
  const offers = entries.filter((e) => e.type === "traveller").length;
  const routes = new Set(
    entries
      .map((e) => `${placeKey(e.from) ?? "?"}-${placeKey(e.to) ?? "?"}`)
      .filter((r) => r !== "?-?")
  ).size;

  const tiles = [
    { value: today, label: "flying today or tomorrow", tone: "accent" },
    { value: requests, label: "families asking", tone: "plain" },
    { value: offers, label: "travellers offering", tone: "plain" },
    { value: routes, label: "routes covered", tone: "plain" },
  ] as const;

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((t) => (
        <div
          key={t.label}
          className={cn(
            "rounded-md border px-4 py-4",
            t.tone === "accent"
              ? "border-accent-200 bg-accent-050"
              : "border-neutral-300 bg-neutral-050"
          )}
        >
          <dt className="sr-only">{t.label}</dt>
          <dd>
            <span
              className={cn(
                "block font-sans text-[32px] font-extrabold leading-[32px] tracking-[-0.04em]",
                t.tone === "accent" ? "text-accent-700" : "text-primary-800"
              )}
            >
              {t.value}
            </span>
            <span className="mt-1 block t-caption text-text-secondary">
              {t.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Departures rail ───────────────────────────────────────────────────── */

/**
 * "Who is flying today?" — the question the WhatsApp group opens with, given
 * the top of the board. Only the next seven days appear, newest departure
 * first, and every face is a shortcut that filters the board below to that
 * person's route rather than a decoration.
 */
function DeparturesRail({
  entries,
  onPick,
}: {
  entries: ParsedEntry[];
  onPick: (entry: ParsedEntry) => void;
}) {
  const soon = entries
    .filter((e) => {
      const d = daysUntil(e.dateISO);
      return d !== undefined && d >= 0 && d <= 7;
    })
    .sort((a, b) => (daysUntil(a.dateISO) ?? 0) - (daysUntil(b.dateISO) ?? 0))
    .slice(0, 14);

  if (soon.length === 0) return null;

  return (
    <div className="rounded-md border border-neutral-300 bg-neutral-050 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="t-label-1 flex items-center gap-2 text-primary-800">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
          </span>
          Flying in the next 7 days
        </h3>
        <p className="t-caption text-text-secondary">
          Tap anyone to filter the board to their route
        </p>
      </div>

      <ul className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {soon.map((e, i) => {
          const label = departureLabel(e.dateISO);
          const route = [placeKey(e.from), placeKey(e.to)]
            .filter(Boolean)
            .join(" → ");
          return (
            <li key={e.reference ?? `soon-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => onPick(e)}
                className="flex w-36 flex-col items-center gap-2 rounded-md border border-transparent bg-neutral-000 px-3 py-3 text-center transition-colors hover:border-primary-200 hover:bg-primary-050 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
              >
                <span className="relative">
                  <Avatar name={e.name} size="sm" />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full ring-2 ring-neutral-000",
                      e.isTraveller ? "bg-primary-800" : "bg-accent-500"
                    )}
                  >
                    {e.isTraveller ? (
                      <HandHeart className="h-2.5 w-2.5 text-neutral-000" />
                    ) : (
                      <Users className="h-2.5 w-2.5 text-neutral-000" />
                    )}
                  </span>
                </span>
                <span className="t-caption w-full truncate font-bold text-primary-800">
                  {e.name ?? "Board member"}
                </span>
                <span className="t-caption w-full truncate text-text-secondary">
                  {route || "Route on request"}
                </span>
                {label && (
                  <span
                    className={cn(
                      "t-caption font-bold",
                      label.tone === "today"
                        ? "text-accent-700"
                        : "text-text-secondary"
                    )}
                  >
                    {label.text}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Column ────────────────────────────────────────────────────────────── */

function Column({
  title,
  lead,
  icon: Icon,
  tone,
  entries,
  emptyText,
  moreHref,
  single,
  showHeader,
}: {
  title: string;
  lead: string;
  icon: typeof Users;
  tone: "requester" | "traveller";
  entries: ParsedEntry[];
  emptyText: string;
  moreHref?: string;
  single: boolean;
  /** Dropped on the two locked list pages, where the page's own <h1> already
   *  says which side you are looking at and a banner would only repeat it. */
  showHeader?: boolean;
}) {
  return (
    <section aria-label={title} className="min-w-0">
      {showHeader !== false && (
      <header
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-md px-4 py-3",
          tone === "traveller" ? "bg-primary-800" : "bg-accent-500"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-000/15">
            <Icon className="h-4 w-4 text-neutral-000" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="t-label-1 truncate text-neutral-000">{title}</h3>
            <p className="hidden truncate t-caption text-neutral-000/80 sm:block">
              {lead}
            </p>
          </div>
        </div>
        <span className="pill shrink-0 bg-neutral-000/15 text-neutral-000">
          {entries.length} open
        </span>
      </header>
      )}

      {entries.length === 0 ? (
        <p className="t-body-sm mt-4 rounded-md border border-dashed border-neutral-300 px-5 py-8 text-center text-text-secondary">
          {emptyText}
        </p>
      ) : (
        <ul
          className={cn(
            "grid gap-4",
            showHeader === false ? "mt-0" : "mt-4",
            single ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-1"
          )}
        >
          {entries.map((e, i) => (
            <li key={e.reference ?? `${tone}-${i}`} className="h-full">
              <BoardCard entry={e} />
            </li>
          ))}
        </ul>
      )}

      {moreHref && entries.length > 0 && (
        <p className="mt-4">
          <Link
            href={moreHref}
            className="inline-flex items-center gap-1.5 rounded-xs t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-4 transition-colors hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
          >
            See every {tone === "traveller" ? "offer" : "request"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      )}
    </section>
  );
}

/* ── Board ─────────────────────────────────────────────────────────────── */

export default function AssistFamilyBoard({
  lockSide,
  showRail = true,
  showColumnLinks = false,
}: {
  /** Pins the board to one side — used by the two dedicated list pages. */
  lockSide?: "requester" | "traveller";
  showRail?: boolean;
  showColumnLinks?: boolean;
}) {
  const { state, entries, source, reload } = useParentBoard(50);

  const [query, setQuery] = useState("");
  const [side, setSide] = useState<Side>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [when, setWhen] = useState<When>("any");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState<Sort>("soonest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeSide: Side = lockSide ?? side;

  /* Dropdown options are derived from what is actually on the board, so a
     filter can never offer an airport with nothing behind it. */
  const { fromOptions, toOptions, languageOptions } = useMemo(() => {
    const f = new Set<string>();
    const t = new Set<string>();
    const l = new Set<string>();
    for (const e of entries) {
      const fk = placeKey(e.from);
      const tk = placeKey(e.to);
      if (fk) f.add(fk);
      if (tk) t.add(tk);
      for (const part of (e.languages ?? "").split(/[,/]/)) {
        const v = part.trim();
        if (v) l.add(v);
      }
    }
    const sorted = (s: Set<string>) => [...s].sort((a, b) => a.localeCompare(b));
    return {
      fromOptions: sorted(f),
      toOptions: sorted(t),
      languageOptions: sorted(l),
    };
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const terms = q ? q.split(/\s+/) : [];

    const rows = entries.filter((e) => {
      if (activeSide !== "all" && e.type !== activeSide) return false;

      if (terms.length > 0) {
        const hay = searchHaystack(e);
        if (!terms.every((term) => hay.includes(term))) return false;
      }

      if (from && placeKey(e.from) !== from) return false;
      if (to && placeKey(e.to) !== to) return false;

      if (language) {
        const langs = (e.languages ?? "").toLowerCase();
        if (!langs.includes(language.toLowerCase())) return false;
      }

      if (when !== "any") {
        const d = daysUntil(e.dateISO);
        if (d === undefined || d < 0) return false;
        if (when === "today" && d > 1) return false;
        if (when === "week" && d > 7) return false;
        if (when === "month" && d > 30) return false;
      }

      return true;
    });

    const byDate = (e: ParsedEntry) => {
      const d = e.dateISO ? new Date(e.dateISO).getTime() : NaN;
      return Number.isFinite(d) ? d : Number.POSITIVE_INFINITY;
    };
    const byPosted = (e: ParsedEntry) => {
      const d = e.postedISO ? new Date(e.postedISO).getTime() : NaN;
      return Number.isFinite(d) ? d : 0;
    };

    return [...rows].sort((a, b) => {
      if (sort === "newest") return byPosted(b) - byPosted(a);
      if (sort === "amount") return (b.amount ?? -1) - (a.amount ?? -1);
      return byDate(a) - byDate(b);
    });
  }, [entries, activeSide, query, from, to, language, when, sort]);

  const requesters = filtered.filter((e) => e.type !== "traveller");
  const travellers = filtered.filter((e) => e.type === "traveller");

  const counts = useMemo(
    () => ({
      all: entries.length,
      requester: entries.filter((e) => e.type !== "traveller").length,
      traveller: entries.filter((e) => e.type === "traveller").length,
    }),
    [entries]
  );

  const activeChips: { label: string; clear: () => void }[] = [];
  if (query.trim())
    activeChips.push({ label: `"${query.trim()}"`, clear: () => setQuery("") });
  if (from) activeChips.push({ label: `From ${from}`, clear: () => setFrom("") });
  if (to) activeChips.push({ label: `To ${to}`, clear: () => setTo("") });
  if (when !== "any")
    activeChips.push({
      label: WHEN_OPTIONS.find((w) => w.key === when)?.label ?? when,
      clear: () => setWhen("any"),
    });
  if (language)
    activeChips.push({ label: language, clear: () => setLanguage("") });
  if (!lockSide && side !== "all")
    activeChips.push({
      label: side === "traveller" ? "Offering to help" : "Needs a companion",
      clear: () => setSide("all"),
    });

  const resetAll = () => {
    setQuery("");
    setFrom("");
    setTo("");
    setWhen("any");
    setLanguage("");
    if (!lockSide) setSide("all");
  };

  /* A face on the departures rail is a filter, not a link: tapping it pins
     the board to that person's exact route so you immediately see who is on
     the other side of it. */
  const pickRoute = (e: ParsedEntry) => {
    setQuery("");
    setFrom(placeKey(e.from) ?? "");
    setTo(placeKey(e.to) ?? "");
    setWhen("any");
    if (!lockSide) setSide("all");
    setFiltersOpen(true);
  };

  /* ── Loading ─────────────────────────────────────────────────────── */
  if (state.status === "loading") {
    return (
      <div>
        <p className="sr-only" role="status">
          Loading the board…
        </p>
        <div className="h-14 rounded-md bg-neutral-100" aria-hidden="true" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="card h-64 animate-pulse p-5"
              aria-hidden="true"
            >
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-full bg-neutral-100" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 w-28 rounded-xs bg-neutral-100" />
                  <div className="h-3 w-20 rounded-xs bg-neutral-100" />
                </div>
              </div>
              <div className="mt-6 h-6 w-full rounded-xs bg-neutral-100" />
              <div className="mt-4 h-4 w-full rounded-xs bg-neutral-100" />
              <div className="mt-2 h-4 w-3/4 rounded-xs bg-neutral-100" />
            </div>
          ))}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 t-body-sm text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading the board…
        </p>
      </div>
    );
  }

  const single = activeSide !== "all";

  return (
    <div>
      {showRail && (
        <>
          <Stats entries={entries} />
          <div className="mt-4">
            <DeparturesRail entries={entries} onPick={pickRoute} />
          </div>
        </>
      )}

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          "sticky top-16 z-raised rounded-md border border-neutral-300 bg-neutral-000/95 p-3 shadow-e1 backdrop-blur sm:p-4",
          showRail && "mt-6"
        )}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search route, airline, language…"
              aria-label="Search the board"
              className="input pl-11 pr-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-text-secondary transition-colors hover:bg-neutral-100 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              className={cn(
                "inline-flex min-h-[48px] items-center gap-2 rounded-sm border px-4 t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
                filtersOpen || activeChips.length > 0
                  ? "border-primary-800 bg-primary-800 text-neutral-000"
                  : "border-neutral-300 bg-neutral-000 text-primary-800 hover:bg-primary-050"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
              {activeChips.length > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 t-caption font-bold text-neutral-000">
                  {activeChips.length}
                </span>
              )}
            </button>

            <label className="relative inline-flex min-h-[48px] items-center">
              <span className="sr-only">Sort the board</span>
              <ArrowUpDown
                className="pointer-events-none absolute left-3 h-4 w-4 text-text-secondary"
                aria-hidden="true"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-12 appearance-none rounded-sm border border-neutral-300 bg-neutral-000 pl-9 pr-8 font-sans text-[14px] font-bold leading-[20px] text-primary-800 focus-visible:border-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Side tabs — the one filter that is never hidden behind a toggle. */}
        {!lockSide && (
          <div
            role="group"
            aria-label="Which side of the board"
            className="mt-3 grid grid-cols-3 gap-1 rounded-sm bg-neutral-100 p-1"
          >
            {(
              [
                { key: "all", label: "Everyone", short: "All" },
                { key: "requester", label: "Needs a companion", short: "Needs help" },
                { key: "traveller", label: "Offering to help", short: "Offering" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setSide(t.key)}
                aria-pressed={side === t.key}
                className={cn(
                  "inline-flex min-h-[40px] items-center justify-center gap-1 rounded-xs px-1 t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 sm:gap-2 sm:px-2",
                  side === t.key
                    ? "bg-neutral-000 text-primary-800 shadow-e1"
                    : "text-text-secondary hover:text-primary-800"
                )}
              >
                <span className="truncate sm:hidden">{t.short}</span>
                <span className="hidden truncate sm:inline">{t.label}</span>
                <span
                  className={cn(
                    "t-caption font-bold",
                    side === t.key ? "text-accent-600" : "text-text-secondary"
                  )}
                >
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* The placeholder has to stay short enough to survive a 390px screen,
            so the worked examples live here instead — and only while the box
            is empty, where they are a hint rather than clutter. */}
        {!query && (
          <p className="mt-3 t-caption text-text-secondary">
            Try an airport code (“LHR”), an airline (“Emirates”), a language
            (“Urdu”) — or paste the reference you were given.
          </p>
        )}

        {filtersOpen && (
          <div className="mt-3 grid gap-3 border-t border-neutral-200 pt-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Flying from"
              value={from}
              onChange={setFrom}
              options={fromOptions}
              anyLabel="Any airport"
            />
            <Select
              label="Flying to"
              value={to}
              onChange={setTo}
              options={toOptions}
              anyLabel="Anywhere"
            />
            <Select
              label="When"
              value={when}
              onChange={(v) => setWhen(v as When)}
              options={WHEN_OPTIONS.map((w) => w.key)}
              optionLabel={(k) =>
                WHEN_OPTIONS.find((w) => w.key === k)?.label ?? k
              }
              anyLabel="Any date"
              omitBlank
            />
            <Select
              label="Language"
              value={language}
              onChange={setLanguage}
              options={languageOptions}
              anyLabel="Any language"
            />
          </div>
        )}

        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="t-caption text-text-secondary">Filtering by</span>
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.clear}
                className="pill bg-primary-050 text-primary-700 transition-colors hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
              >
                {chip.label}
                <X className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">Remove this filter</span>
              </button>
            ))}
            <button
              type="button"
              onClick={resetAll}
              className="rounded-xs t-label-3 text-text-secondary underline underline-offset-4 transition-colors hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Source banner ───────────────────────────────────────────── */}
      {source === "sample" && (
        <div className="mt-6 rounded-md border border-warning/30 bg-warning-surface px-4 py-4 md:flex md:items-start md:gap-3">
          <Info
            className="mb-2 h-5 w-5 shrink-0 text-accent-700 md:mb-0 md:mt-0.5"
            aria-hidden="true"
          />
          <div className="min-w-0 md:flex-1">
            <p className="t-label-2 text-primary-800">
              These are example listings, not real people
            </p>
            <p className="t-body-sm mt-1 text-text-secondary">
              {state.status === "ready" && state.feedError
                ? "The live board isn’t reachable at the moment, so here’s what it looks like in use. "
                : "Nothing is open on the live board right now, so here’s what it looks like in use. "}
              Every card below is marked “Example”. Post a real one and it
              appears here the moment a coordinator approves it.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 md:mt-0 md:shrink-0">
            <button type="button" onClick={reload} className="btn btn-outline btn-sm">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Retry
            </button>
            <a href="#post-to-the-board" className="btn btn-primary btn-sm">
              Post yours
            </a>
          </div>
        </div>
      )}

      {source === "live" && (
        <p className="mt-6 flex items-center gap-2 t-body-sm text-text-secondary">
          <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
          Live board · {entries.length}{" "}
          {entries.length === 1 ? "entry" : "entries"} open · updated
          continuously
        </p>
      )}

      {/* ── Results ─────────────────────────────────────────────────── */}
      <div className="mt-6">
        {filtered.length === 0 ? (
          <NoMatches onReset={resetAll} />
        ) : single ? (
          <Column
            single
            showHeader={!lockSide}
            title={
              activeSide === "traveller"
                ? "Travellers offering to help"
                : "Families asking for a companion"
            }
            lead={
              activeSide === "traveller"
                ? "Already booked on the route, happy to keep someone company"
                : "Someone flying alone, and the family who’d rather they weren’t"
            }
            icon={activeSide === "traveller" ? HandHeart : Users}
            tone={activeSide === "traveller" ? "traveller" : "requester"}
            entries={filtered}
            emptyText="Nothing open on this side right now."
            moreHref={undefined}
          />
        ) : (
          <div className="grid gap-8 xl:grid-cols-2 xl:gap-6">
            <Column
              single={false}
              title="Families asking for a companion"
              lead="Someone flying alone, and the family who’d rather they weren’t"
              icon={Users}
              tone="requester"
              entries={requesters}
              emptyText="No families are asking on this route yet — if you’re flying it, your offer would be the first."
              moreHref={showColumnLinks ? "/parents-tickets/requests" : undefined}
            />
            <Column
              single={false}
              title="Travellers offering to help"
              lead="Already booked on the route, happy to keep someone company"
              icon={HandHeart}
              tone="traveller"
              entries={travellers}
              emptyText="Nobody is offering this route yet — post the journey and our team will go looking."
              moreHref={showColumnLinks ? "/parents-tickets/offers" : undefined}
            />
          </div>
        )}
      </div>

      <p className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center t-body-sm text-text-secondary">
        <Sparkles className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
        Showing {filtered.length} of {entries.length}. Cards are already
        shortened — first names and last initials only, never a phone number or
        email. Our team makes every introduction.
      </p>
    </div>
  );
}

/* ── Filter select ─────────────────────────────────────────────────────── */

function Select({
  label,
  value,
  onChange,
  options,
  anyLabel,
  optionLabel,
  omitBlank,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  anyLabel: string;
  optionLabel?: (v: string) => string;
  omitBlank?: boolean;
}) {
  return (
    <label className="block">
      <span className="t-label-3 block text-text-secondary">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input mt-1.5 h-12 cursor-pointer py-0 pr-8 font-sans text-[14px] leading-[20px]"
      >
        {!omitBlank && <option value="">{anyLabel}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {optionLabel ? optionLabel(o) : o}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ── Zero results ──────────────────────────────────────────────────────── */

function NoMatches({ onReset }: { onReset: () => void }) {
  return (
    <div className="card mx-auto max-w-xl p-8 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-050">
        <Search className="h-6 w-6 text-primary-700" aria-hidden="true" />
      </span>
      <h3 className="t-h4 mt-6 text-primary-800">
        Nothing matches that — yet
      </h3>
      <p className="t-body-sm mx-auto mt-3 max-w-sm text-text-secondary">
        Routes fill up as people book, so a quiet search is normal rather than a
        dead end. Widen the filters, or post the journey and our team will go
        looking for the other half of it.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onReset} className="btn btn-outline">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Clear the filters
        </button>
        <a href="#post-to-the-board" className="btn btn-primary">
          Post to the board
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp us
        </a>
      </div>
    </div>
  );
}
