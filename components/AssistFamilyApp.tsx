"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowRightLeft,
  CalendarDays,
  Check,
  HandHeart,
  Info,
  Loader2,
  MapPin,
  MessageCircle,
  PenLine,
  Plane,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { WHATSAPP_URL } from "@/lib/links";
import {
  avatarTone,
  daysUntil,
  departureLabel,
  formatEntryDate,
  initialsOf,
  type ParsedEntry,
  placeKey,
  postedAgo,
  searchHaystack,
  splitPlace,
} from "@/lib/parents";
import { useParentBoard } from "@/lib/useParentBoard";

/**
 * THE ASSIST FAMILY BOARD — /parents-tickets above the form.
 *
 * Built to the layout the client supplied: a search bar across the top, a
 * narrow filter rail, then the two sides of the board as facing columns —
 * families on the left, travellers on the right — and a single dark call to
 * action closing it off.
 *
 * DENSITY IS THE POINT. These rows are deliberately tight: a visitor is
 * scanning for their own route, so the job of a row is to be skimmed, not
 * read. Everything that isn't route, date, who and what-kind-of-help is a
 * chip or is one tap away on the listing's own page.
 *
 * WHY FACING COLUMNS AND NOT TABS. The two sides are the product — seeing
 * that nine families and one traveller want the same week is itself the
 * argument for posting. Below `lg` there is no room for two, so a segmented
 * control picks one; that is a responsive adaptation, not a different design.
 *
 * EVERY FILTER IS BUILT FROM THE DATA. Airports, airlines, languages and
 * support needs are collected from the entries actually on the board, so a
 * filter can never offer an option with nothing behind it — and there is no
 * filter for anything the feed does not carry. In particular there is no
 * "verified only" toggle and no response-time badge: we issue no
 * verification and measure no response time, so neither may appear as if we
 * did.
 *
 * AVATARS ARE INITIALS, NEVER PHOTOGRAPHS. The feed is anonymised down to a
 * first name and a last initial, so there is no real face to show.
 *
 * PRIVACY IS UNCHANGED. Every field rendered is one the poster ticked a box
 * to publish; the feed carries no contact details; the only call to action
 * is to ask our team.
 */

type Side = "requester" | "traveller";
type When = "any" | "today" | "week" | "month";

const WHEN_OPTIONS: { key: When; label: string }[] = [
  { key: "any", label: "Any date" },
  { key: "today", label: "Today or tomorrow" },
  { key: "week", label: "Next 7 days" },
  { key: "month", label: "Next 30 days" },
];

/**
 * The form's mobility options are written as sentences ("None — just company
 * and reassurance"), which is right beside a radio button and wrong inside a
 * chip: a row can carry three chips on one line or one chip on three. These
 * are the same options said in two or three words. The stored value is
 * untouched — only the label changes — so filtering still matches the feed.
 */
const SUPPORT_LABELS: [RegExp, string][] = [
  [/wheelchair/i, "Wheelchair help"],
  [/walking aid|slow on their feet/i, "Walking aid"],
  [/visual/i, "Visual support"],
  [/hearing/i, "Hearing support"],
  [/^none|company and reassurance/i, "Company only"],
  [/^other/i, "Other support"],
];

function shortSupport(value: string): string {
  return SUPPORT_LABELS.find(([re]) => re.test(value))?.[1] ?? value;
}

/** "Telugu, Hindi, English" is three chips' worth of width in one chip. */
function shortLanguages(value: string): string {
  const parts = value.split(/[,/]/).map((v) => v.trim()).filter(Boolean);
  if (parts.length === 0) return value;
  return parts.length === 1 ? parts[0] : `${parts[0]} +${parts.length - 1}`;
}

const selectClass =
  "h-10 w-full cursor-pointer rounded-sm border border-neutral-300 bg-neutral-000 px-3 font-sans text-[14px] leading-[20px] text-text-primary focus-visible:border-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700";

/* ── Row ───────────────────────────────────────────────────────────────── */

/**
 * One listing.
 *
 * The row is built in three tiers, because a visitor scanning forty of these
 * reads them in that order and not one of them straight through:
 *
 *   1. WHO   avatar, name, when it was posted
 *   2. WHERE the route, set as the headline — this is the fact they came for
 *   3. WHAT  the ask in their own words, then the chips, price and action
 *
 * The route used to render at caption size and show only the destination,
 * with the origin on a separate line above, so "LHR → HYD" never appeared as
 * one object and the reader had to assemble it. It is now the largest thing
 * on the row.
 *
 * The status pill that sat top-right ("Looking for help") is gone: it
 * repeated the column's own header on every row and was the loudest element
 * for no information. That slot now carries the departure countdown, which
 * differs per row and is what makes a listing urgent. The side is still
 * legible from the column header, the accent bar, and the action's wording.
 *
 * Hover moves only transform, opacity and colour (PRODUCT.md: "transform/
 * opacity motion only"), and the whole row is the link — the visible button
 * stretches over the card via a pseudo-element, so the click target is the
 * full row while the focus ring stays on one real anchor.
 */
function Row({ entry }: { entry: ParsedEntry }) {
  const {
    isTraveller,
    reference,
    name,
    from,
    to,
    date,
    dateISO,
    airline,
    languages,
    body,
    relationship,
    mobility,
    capacity,
    amount,
    postedISO,
  } = entry;

  const a = splitPlace(from);
  const b = splitPlace(to);
  const depart = departureLabel(dateISO);
  const posted = postedAgo(postedISO);

  /* Chips carry meaning through colour, not just words: the care need is the
     one a family is actually filtering on, so it is the only tinted chip. */
  const careChip = !isTraveller && mobility ? shortSupport(mobility) : undefined;
  const plainChips: string[] = [];
  if (isTraveller) {
    if (capacity !== undefined) {
      plainChips.push(`${capacity} ${capacity === 1 ? "person" : "people"}`);
    }
    if (airline) plainChips.push(airline);
  } else {
    if (relationship) plainChips.push(relationship);
  }
  if (languages) plainChips.push(shortLanguages(languages));

  const href = reference
    ? `/parents-tickets/listing/${encodeURIComponent(reference)}`
    : undefined;

  const cityLine = [a.name ?? a.code, b.name ?? b.code]
    .filter(Boolean)
    .join(" → ");

  return (
    <article
      className={cn(
        "group relative isolate px-4 py-4 transition-colors duration-200",
        "hover:bg-primary-050/50 focus-within:bg-primary-050/50",
        "focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-700"
      )}
    >
      {/* Depth without a shadow on every row: a bar that grows out of the
          left edge on hover. Pure transform, so it costs no repaint. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-200 ease-out group-hover:scale-y-100 group-focus-within:scale-y-100",
          isTraveller ? "bg-primary-800" : "bg-accent-500"
        )}
      />

      <div className="flex gap-3.5">
        <span
          aria-hidden="true"
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full font-sans text-[14px] font-extrabold ring-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-within:-translate-y-0.5",
            avatarTone(name)
          )}
        >
          {initialsOf(name)}
        </span>

        <div className="min-w-0 flex-1">
          {/* ── 1. Who ─────────────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-2">
            <p className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="t-label-1 text-primary-800">
                {name ?? "A board member"}
              </span>
              {posted && (
                <span className="t-caption text-text-secondary">{posted}</span>
              )}
            </p>

            {depart && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 t-caption font-bold",
                  // White on Accent 500 is 3.37:1 and Accent 700 on Accent
                  // 050 is 4.30:1 — both under the floor at 12px. Accent 700
                  // against white, either way round, is 4.66:1.
                  depart.tone === "today" && "bg-accent-700 text-neutral-000 shadow-e1",
                  depart.tone === "soon" &&
                    "bg-neutral-000 text-accent-700 ring-1 ring-accent-200",
                  depart.tone === "later" && "bg-primary-050 text-primary-700",
                  depart.tone === "past" && "bg-neutral-100 text-text-secondary"
                )}
              >
                <CalendarDays className="h-3 w-3 shrink-0" aria-hidden="true" />
                {depart.text}
              </span>
            )}
          </div>

          {/* ── 2. Where — the headline ─────────────────────────────── */}
          <p className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="t-h5 text-primary-800">{a.code ?? a.name ?? "—"}</span>
            <Plane
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5",
                isTraveller ? "text-primary-500" : "text-accent-500"
              )}
              aria-hidden="true"
            />
            <span className="t-h5 text-primary-800">{b.code ?? b.name ?? "—"}</span>
            <span aria-hidden="true" className="h-4 w-px bg-neutral-300" />
            <span className="t-label-3 text-text-secondary">
              {date ?? formatEntryDate(dateISO) ?? "Date on request"}
            </span>
          </p>
          {cityLine && (
            <p className="mt-1 truncate t-caption text-text-secondary">{cityLine}</p>
          )}

          {/* ── 3. What ────────────────────────────────────────────── */}
          {body && (
            <p className="t-body-sm mt-2.5 line-clamp-2 text-text-secondary">
              {body}
            </p>
          )}

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {careChip && (
              <li className="inline-flex items-center gap-1 rounded-sm bg-primary-050 px-2 py-1 t-caption font-bold text-primary-700 ring-1 ring-primary-100">
                <HandHeart className="h-3 w-3 shrink-0" aria-hidden="true" />
                {careChip}
              </li>
            )}
            {/* The chips have the row's full width now that the price and
                action sit on their own line, so a third fits. */}
            {plainChips.slice(0, careChip ? 2 : 3).map((tag) => (
              <li
                key={tag}
                className="rounded-sm bg-neutral-100 px-2 py-1 t-caption text-text-secondary"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-end gap-3 border-t border-neutral-200 pt-3">
              {amount !== undefined && (
                <span className="t-caption text-text-secondary">
                  {amount > 0 ? (
                    <>
                      {isTraveller ? "Asking " : "Offering "}
                      <span className="t-label-1 text-primary-800">£{amount}</span>
                    </>
                  ) : (
                    <span className="t-label-3 text-success">No charge</span>
                  )}
                </span>
              )}
              {href && (
                <Link
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-sm border px-3 py-2 font-sans text-[12px] font-bold leading-[16px] transition-colors duration-200",
                    "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none",
                    isTraveller
                      ? "border-primary-800 text-primary-800 group-hover:bg-primary-800 group-hover:text-neutral-000 group-focus-within:bg-primary-800 group-focus-within:text-neutral-000"
                      : "border-accent-700 text-accent-700 group-hover:bg-accent-700 group-hover:text-neutral-000 group-focus-within:bg-accent-700 group-focus-within:text-neutral-000"
                  )}
                >
                  {isTraveller ? "Ask for a match" : "View details"}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5"
                    aria-hidden="true"
                  />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Column ────────────────────────────────────────────────────────────── */

function BoardColumn({
  title,
  subtitle,
  icon: Icon,
  tone,
  rows,
  countLabel,
  empty,
  className,
}: {
  title: string;
  subtitle: string;
  icon: typeof Users;
  tone: Side;
  rows: ParsedEntry[];
  countLabel: string;
  empty: string;
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={cn(
        "min-w-0 overflow-hidden rounded-md border border-neutral-300 bg-neutral-000 shadow-e1",
        className
      )}
    >
      {/* A 2px rule in the side's own colour, so the two columns are
          distinguishable at a glance from across the page. */}
      <header
        className={cn(
          "flex items-center justify-between gap-3 border-b-2 bg-neutral-050 px-4 py-3.5",
          tone === "traveller" ? "border-primary-800" : "border-accent-500"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-sm shadow-e1 ring-1",
              tone === "traveller"
                ? "bg-primary-800 text-neutral-000 ring-primary-800"
                : "bg-accent-500 text-neutral-000 ring-accent-500"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="t-label-1 truncate text-primary-800">{title}</h3>
            <p className="t-caption truncate text-text-secondary">{subtitle}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-neutral-000 px-3 py-1 t-label-3 text-primary-800 shadow-e1 ring-1 ring-neutral-300">
          {countLabel}
        </span>
      </header>

      {rows.length === 0 ? (
        <p className="px-4 py-10 text-center t-body-sm text-text-secondary">
          {empty}
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200">
          {rows.map((entry, i) => (
            <li key={entry.reference ?? `row-${i}`}>
              <Row entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ── Filter rail ───────────────────────────────────────────────────────── */

function CheckGroup({
  title,
  icon: Icon,
  options,
  selected,
  onToggle,
  format,
}: {
  title: string;
  icon: typeof Users;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  format?: (value: string) => string;
}) {
  if (options.length === 0) return null;
  return (
    <fieldset className="border-t border-neutral-200 pt-4">
      <legend className="flex items-center gap-1.5 t-label-2 text-primary-800">
        <Icon className="h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
        {title}
      </legend>
      <ul className="mt-3 space-y-2">
        {options.map((option) => (
          <li key={option}>
            <label className="-mx-1.5 flex cursor-pointer items-start gap-2 rounded-xs px-1.5 py-1 t-caption text-text-secondary transition-colors hover:bg-primary-050 hover:text-primary-800">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="mt-px h-3.5 w-3.5 shrink-0 cursor-pointer accent-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
              />
              <span>{format ? format(option) : option}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

/* ── App ───────────────────────────────────────────────────────────────── */

export default function AssistFamilyApp({
  lockSide,
  showHero = true,
}: {
  /** Pins the board to one side — used by the two dedicated list pages. */
  lockSide?: Side;
  showHero?: boolean;
}) {
  const { state, entries, source } = useParentBoard(50);

  // The form only lives on /parents-tickets; the two list pages have to
  // link across to it rather than to an anchor that isn't on their page.
  const postHref = lockSide
    ? "/parents-tickets#post-to-the-board"
    : "#post-to-the-board";

  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [when, setWhen] = useState<When>("any");
  const [airline, setAirline] = useState("");
  const [langs, setLangs] = useState<string[]>([]);
  const [supports, setSupports] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  /** Which column a narrow screen is showing; ignored from lg up. */
  const [mobileSide, setMobileSide] = useState<Side>(lockSide ?? "requester");

  const toggle = (list: string[], set: (v: string[]) => void) => (value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const options = useMemo(() => {
    const f = new Set<string>();
    const t = new Set<string>();
    const al = new Set<string>();
    const lg = new Set<string>();
    const sp = new Set<string>();
    for (const e of entries) {
      const fk = placeKey(e.from);
      const tk = placeKey(e.to);
      if (fk) f.add(fk);
      if (tk) t.add(tk);
      if (e.airline) al.add(e.airline);
      for (const part of (e.languages ?? "").split(/[,/]/)) {
        // Posters qualify languages freely ("basic Hindi"). The qualifier is
        // theirs and stays on the card, but as a filter it would sit as a
        // second, lowercase entry beside the real one.
        const v = part
          .trim()
          .replace(/^(basic|some|fluent|conversational|a little)\s+/i, "")
          .replace(/^./, (c) => c.toUpperCase());
        if (v) lg.add(v);
      }
      if (e.mobility && e.type !== "traveller") sp.add(e.mobility);
    }
    const sorted = (s: Set<string>) => [...s].sort((x, y) => x.localeCompare(y));
    return {
      from: sorted(f),
      to: sorted(t),
      airlines: sorted(al),
      languages: sorted(lg),
      supports: sorted(sp),
    };
  }, [entries]);

  const match = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return (e: ParsedEntry) => {
      if (terms.length > 0) {
        const hay = searchHaystack(e);
        if (!terms.every((term) => hay.includes(term))) return false;
      }
      if (from && placeKey(e.from) !== from) return false;
      if (to && placeKey(e.to) !== to) return false;
      if (airline && e.airline !== airline) return false;
      if (langs.length > 0) {
        const have = (e.languages ?? "").toLowerCase();
        if (!langs.some((l) => have.includes(l.toLowerCase()))) return false;
      }
      // A support need only describes a family's post, so it narrows that
      // column and leaves the travellers' one alone.
      if (supports.length > 0 && e.type !== "traveller") {
        if (!e.mobility || !supports.includes(e.mobility)) return false;
      }
      if (when !== "any") {
        const d = daysUntil(e.dateISO);
        if (d === undefined || d < 0) return false;
        if (when === "today" && d > 1) return false;
        if (when === "week" && d > 7) return false;
        if (when === "month" && d > 30) return false;
      }
      return true;
    };
  }, [query, from, to, airline, langs, supports, when]);

  const soonest = (x: ParsedEntry, y: ParsedEntry) => {
    const v = (e: ParsedEntry) => {
      const d = e.dateISO ? new Date(e.dateISO).getTime() : NaN;
      return Number.isFinite(d) ? d : Number.POSITIVE_INFINITY;
    };
    return v(x) - v(y);
  };

  const requesters = useMemo(
    () => entries.filter((e) => e.type !== "traveller").filter(match).sort(soonest),
    [entries, match]
  );
  const travellers = useMemo(
    () => entries.filter((e) => e.type === "traveller").filter(match).sort(soonest),
    [entries, match]
  );

  const activeCount =
    (query.trim() ? 1 : 0) +
    (from ? 1 : 0) +
    (to ? 1 : 0) +
    (airline ? 1 : 0) +
    (when !== "any" ? 1 : 0) +
    langs.length +
    supports.length;

  const clearAll = () => {
    setQuery("");
    setFrom("");
    setTo("");
    setAirline("");
    setWhen("any");
    setLangs([]);
    setSupports([]);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const loading = state.status === "loading";

  const placeSelect = (
    value: string,
    set: (v: string) => void,
    list: string[],
    anyLabel: string
  ) => (
    <select
      value={value}
      onChange={(e) => set(e.target.value)}
      className={selectClass}
      disabled={loading}
    >
      <option value="">{anyLabel}</option>
      {list.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  const label = (text: string, Icon: typeof MapPin) => (
    <span className="flex items-center gap-1.5 t-label-3 text-text-secondary">
      <Icon className="h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
      {text}
    </span>
  );

  /* ── Search bar ──────────────────────────────────────────────────── */
  const searchBar = (
    <div className="rounded-md border border-neutral-300 bg-neutral-000 p-3 shadow-e3">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_1fr_auto] lg:items-end">
        <label className="block">
          {label("From", MapPin)}
          <div className="mt-1.5">
            {placeSelect(from, setFrom, options.from, "Any airport")}
          </div>
        </label>

        <button
          type="button"
          onClick={swap}
          disabled={!from && !to}
          aria-label="Swap the two airports"
          className="hidden h-10 w-10 shrink-0 place-items-center self-end rounded-full border border-neutral-300 text-text-secondary transition-colors hover:border-primary-200 hover:bg-primary-050 hover:text-primary-800 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 lg:grid"
        >
          <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <label className="block">
          {label("To", MapPin)}
          <div className="mt-1.5">
            {placeSelect(to, setTo, options.to, "Anywhere")}
          </div>
        </label>

        <label className="block">
          {label("Travel date", CalendarDays)}
          <select
            value={when}
            onChange={(e) => setWhen(e.target.value as When)}
            className={cn(selectClass, "mt-1.5")}
          >
            {WHEN_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <a
          href="#results"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-primary-800 px-7 font-sans text-[14px] font-bold leading-[20px] text-neutral-000 transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </a>
      </div>
    </div>
  );

  /* ── Filter rail ─────────────────────────────────────────────────── */
  const filters = (
    <div className="rounded-md border border-neutral-300 bg-neutral-000 p-4 shadow-e1">
      <div className="flex items-center justify-between gap-2">
        <h2 className="t-label-1 text-primary-800">Filters</h2>
        <button
          type="button"
          onClick={clearAll}
          disabled={activeCount === 0}
          className="rounded-xs t-caption text-text-secondary transition-colors hover:text-primary-800 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
        >
          Clear all
        </button>
      </div>

      <div className="mt-4 space-y-3.5">
        <label className="block">
          {label("Travel date", CalendarDays)}
          <select
            value={when}
            onChange={(e) => setWhen(e.target.value as When)}
            className={cn(selectClass, "mt-1.5 text-[13px]")}
          >
            {WHEN_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          {label("From", MapPin)}
          <div className="mt-1.5">
            {placeSelect(from, setFrom, options.from, "Any airport")}
          </div>
        </label>
        <label className="block">
          {label("To", MapPin)}
          <div className="mt-1.5">
            {placeSelect(to, setTo, options.to, "Anywhere")}
          </div>
        </label>
        <label className="block">
          {label("Airline", Plane)}
          <div className="mt-1.5">
            {placeSelect(airline, setAirline, options.airlines, "Any airline")}
          </div>
        </label>
      </div>

      <div className="mt-5 space-y-5">
        <CheckGroup
          title="Assistance needed"
          icon={HandHeart}
          options={options.supports}
          selected={supports}
          onToggle={toggle(supports, setSupports)}
          format={shortSupport}
        />
        <CheckGroup
          title="Language spoken"
          icon={Users}
          options={options.languages}
          selected={langs}
          onToggle={toggle(langs, setLangs)}
        />
      </div>
    </div>
  );

  /* ── Columns ─────────────────────────────────────────────────────── */
  const familiesColumn = lockSide === "traveller" ? null : (
    <BoardColumn
      title="Parents / Passengers"
      subtitle="Looking for help"
      icon={Users}
      tone="requester"
      rows={requesters}
      countLabel={`${requesters.length} ${requesters.length === 1 ? "request" : "requests"}`}
      empty="No families are asking on this route yet — if you're flying it, your offer would be the first."
      className={cn(!lockSide && mobileSide !== "requester" && "hidden lg:block")}
    />
  );

  const travellersColumn = lockSide === "requester" ? null : (
    <BoardColumn
      title="Travellers"
      subtitle="Available to help"
      icon={Plane}
      tone="traveller"
      rows={travellers}
      countLabel={`${travellers.length} ${travellers.length === 1 ? "helper" : "helpers"}`}
      empty="Nobody is offering this route yet — post the journey and our team will go looking."
      className={cn(!lockSide && mobileSide !== "traveller" && "hidden lg:block")}
    />
  );

  const columnGrid = lockSide
    ? "grid-cols-1"
    : "grid-cols-1 lg:grid-cols-2";

  return (
    <>
      {showHero && (
        <section className="relative overflow-hidden bg-primary-050">
          {/* Photograph from md up only: on a phone the panel is barely wider
              than the headline, so the picture lands behind the lead however
              hard the scrim works. */}
          <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
            <Image
              src="/support/airport-companion.jpg"
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-050 via-primary-050/75 to-primary-050/10" />
          </div>

          <div className="container-page relative pb-8 pt-10 sm:pt-14">
            <div className="flex flex-wrap items-start gap-x-8 gap-y-2">
              <h1 className="hero-rise t-h1 max-w-xl text-balance text-primary-800">
                Find a traveller who can help
              </h1>
              <p className="hero-rise hero-rise-2 hidden -rotate-2 t-editorial-3 italic leading-snug text-accent-600 lg:block">
                Real people.
                <br />
                Real help.
              </p>
            </div>
            <p className="hero-rise hero-rise-2 t-body mt-3 max-w-xl text-pretty text-text-secondary">
              Parents and passengers connect with travellers flying the same
              route and date. A coordinator here makes every introduction —
              contact details are never published.
            </p>

            <div className="hero-rise hero-rise-3 mt-7">{searchBar}</div>
          </div>
        </section>
      )}

      <section id="board" className="scroll-mt-16 bg-neutral-050 py-8 md:py-10">
        <div className="container-page">
          <div className="grid gap-5 lg:grid-cols-[208px_minmax(0,1fr)] lg:gap-6">
            {/* Filter rail — a disclosure on mobile, always open from lg. */}
            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
                className="flex w-full items-center justify-between gap-3 rounded-md border border-neutral-300 bg-neutral-000 px-4 py-3 t-label-2 text-primary-800 lg:hidden"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  Filters
                  {activeCount > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 t-caption text-neutral-000">
                      {activeCount}
                    </span>
                  )}
                </span>
                <span className="t-caption text-text-secondary">
                  {filtersOpen ? "Hide" : "Show"}
                </span>
              </button>
              <div className={cn("mt-3 lg:mt-0", filtersOpen ? "block" : "hidden lg:block")}>
                {filters}
              </div>
            </div>

            <div id="results" className="min-w-0 scroll-mt-20">
              {/* Keyword search sits with the results, not in the rail: it
                  searches the rows, and the rail narrows them. */}
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search the board"
                  placeholder="Search a name, route, airline or reference…"
                  className="input h-10 py-0 pl-10 pr-9 text-[14px]"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-text-secondary transition-colors hover:bg-neutral-100 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Below lg there is no room for two columns, so one is picked. */}
              {!lockSide && (
                <div
                  role="group"
                  aria-label="Which side of the board"
                  className="mt-3 grid grid-cols-2 gap-1 rounded-sm bg-neutral-100 p-1 lg:hidden"
                >
                  {(
                    [
                      { key: "requester" as const, label: "Looking for help", n: requesters.length },
                      { key: "traveller" as const, label: "Available to help", n: travellers.length },
                    ]
                  ).map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setMobileSide(t.key)}
                      aria-pressed={mobileSide === t.key}
                      className={cn(
                        "inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xs px-2 t-label-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
                        mobileSide === t.key
                          ? "bg-neutral-000 text-primary-800 shadow-e1"
                          : "text-text-secondary"
                      )}
                    >
                      <span className="truncate">{t.label}</span>
                      <span className="text-text-secondary">{t.n}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Shown whatever the feed returns. A visitor who can't see
                  their route shouldn't read that as "nobody can help": the
                  board is only one of the places we look. */}
              <div className="mt-3 flex items-start gap-3 rounded-md border border-primary-100 bg-primary-050 px-4 py-3">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary-700"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="t-label-2 text-primary-800">
                    Don’t see your route? Don’t worry.
                  </p>
                  <p className="mt-0.5 t-caption text-text-secondary">
                    Submit your request anyway. We’ll ask customers who have
                    booked the same flight with us and post it in our WhatsApp
                    travel groups, then call you as soon as someone can help.{" "}
                    <a
                      href={postHref}
                      className="font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                    >
                      Submit your request
                    </a>
                  </p>
                </div>
              </div>

              {source === "live" && (
                <p className="mt-3 flex items-center gap-2 t-caption text-text-secondary">
                  <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                  Live board · updated continuously
                </p>
              )}

              {loading ? (
                <div className={cn("mt-4 grid gap-5", columnGrid)}>
                  <p className="sr-only" role="status">
                    Loading the board…
                  </p>
                  {[0, 1].map((col) => (
                    <div
                      key={col}
                      className="overflow-hidden rounded-md border border-neutral-300 bg-neutral-000"
                      aria-hidden="true"
                    >
                      <div className="h-[61px] border-b border-neutral-200 bg-neutral-050" />
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="flex animate-pulse gap-3 px-4 py-4">
                          <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-100" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-32 rounded-xs bg-neutral-100" />
                            <div className="h-3 w-24 rounded-xs bg-neutral-100" />
                            <div className="h-3 w-full rounded-xs bg-neutral-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <p className="flex items-center justify-center gap-2 t-body-sm text-text-secondary lg:col-span-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Loading the board…
                  </p>
                </div>
              ) : (
                <div className={cn("mt-4 grid items-start gap-5", columnGrid)}>
                  {familiesColumn}
                  {travellersColumn}
                </div>
              )}

              {/* The way out of "nobody is on my route" is to post, so the
                  board closes on one dark band rather than trailing off. */}
              <div className="mt-5 flex flex-col items-center gap-4 rounded-md bg-primary-800 px-5 py-5 shadow-e2 sm:flex-row sm:justify-between sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-000/10">
                    <Users className="h-5 w-5 text-accent-400" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="t-label-1 text-neutral-000">
                      {activeCount > 0 && requesters.length === 0 && travellers.length === 0
                        ? "Nothing matches that — yet"
                        : "Can’t find someone?"}
                    </p>
                    <p className="mt-0.5 t-caption text-primary-200">
                      Post your request and let our community help you. It’s
                      free and takes two minutes.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <a href={postHref} className="btn btn-primary btn-sm">
                    <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                    Post a request
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm border border-neutral-000/25 px-4 py-2 font-sans text-[14px] font-bold leading-[20px] text-neutral-000 transition-colors hover:bg-neutral-000/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/60"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
