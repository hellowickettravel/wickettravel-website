"use client";

import { useId, useMemo, useState } from "react";
import Select, { type SelectOption } from "@/components/Select";
import { AIRPORTS } from "@/lib/airports";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowRightLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  HandHeart,
  Headset,
  Languages,
  LockKeyhole,
  MapPin,
  MessageCircle,
  PenLine,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Search,
  SlidersHorizontal,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { WHATSAPP_URL } from "@/lib/links";
import {
  boardTone,
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
import { MOBILITY_NEEDS } from "@/lib/parents";
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
 * FILTERS ARE FIXED LISTS, WITH COUNTS. They used to be built only from
 * the entries on the board, which made the rail shrink to two or three
 * options whenever the board was quiet (client feedback, 2026-09-30). Now
 * each filter offers a fixed list of the routes, airlines, languages and
 * support needs this service actually sees, plus anything new a post
 * brings in, and every option shows how many listings it would match.
 * Options with none are dimmed but still selectable: choosing one lands on
 * the empty state, which asks the visitor to post. There is still no
 * "verified only" toggle and no response-time badge: we issue no
 * verification and measure no response time.
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

type Sort = "soonest" | "newest";

const SORT_OPTIONS: SelectOption[] = [
  { value: "soonest", label: "Soonest departure" },
  { value: "newest", label: "Newest posts" },
];

/* The fixed lists behind the filters. Anything a real post brings in that
   isn't here is added to its list at runtime, so nothing is ever unfindable. */
const COMMON_FROM = ["LHR", "LGW", "MAN", "BHX", "STN", "EDI", "GLA", "LTN"];
const COMMON_TO = ["DXB", "DEL", "BOM", "HYD", "BLR", "ISB", "LHE", "KHI", "AUH", "DOH", "COK", "AMD", "ATQ", "DAC", "CMB", "JED"];
const COMMON_AIRLINES = [
  "Air India",
  "British Airways",
  "Emirates",
  "Etihad Airways",
  "Gulf Air",
  "Kuwait Airways",
  "Oman Air",
  "Pakistan International Airlines",
  "Qatar Airways",
  "Saudia",
  "SriLankan Airlines",
  "Turkish Airlines",
  "Virgin Atlantic",
];
const COMMON_LANGUAGES = [
  "Arabic",
  "Bengali",
  "English",
  "Gujarati",
  "Hindi",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Pashto",
  "Punjabi",
  "Sinhala",
  "Tamil",
  "Telugu",
  "Urdu",
];

/** Names for codes the directory doesn't carry, as posters usually write them. */
const EXTRA_PLACE_NAMES: Record<string, string> = {
  LTN: "London Luton",
  GLA: "Glasgow",
  ISB: "Islamabad",
  LHE: "Lahore",
  KHI: "Karachi",
  COK: "Kochi",
  AMD: "Ahmedabad",
  ATQ: "Amritsar",
  DAC: "Dhaka",
  CMB: "Colombo",
  JED: "Jeddah",
  HYD: "Hyderabad",
  BLR: "Bengaluru",
};

/** "LHR" → "LHR · London Heathrow"; a free-text place stays as it is. */
function placeLabel(key: string, seen: Map<string, string>): string {
  if (!/^[A-Z]{3}$/.test(key)) return key;
  const fromFeed = seen.get(key);
  if (fromFeed) return `${key} · ${fromFeed}`;
  const a = AIRPORTS.find((x) => x.code === key);
  if (a) {
    const name = a.name && a.name !== a.city ? `${a.city} ${a.name}` : a.city;
    return `${key} · ${name}`;
  }
  return EXTRA_PLACE_NAMES[key] ? `${key} · ${EXTRA_PLACE_NAMES[key]}` : key;
}

/** Union of a fixed list and whatever the feed brought in, sorted. */
function withFeed(fixed: string[], feed: Iterable<string>, sort = true): string[] {
  const all = new Set(fixed);
  for (const v of feed) all.add(v);
  const out = [...all];
  return sort ? out.sort((a, b) => a.localeCompare(b)) : out;
}

/** Normalise a language as posters write it ("basic Hindi" → "Hindi"). */
function cleanLanguage(part: string): string {
  return part
    .trim()
    .replace(/^(basic|some|fluent|conversational|a little)\s+/i, "")
    .replace(/^./, (c) => c.toUpperCase());
}

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
 * legible from the column panel's tint and header, and the action's wording.
 *
 * Each row is its own soft card on its column's tinted panel: the client
 * read the old hairline rows as "a drawing without colour". Hover lifts the
 * card (transform) and fades in a deeper shadow (opacity), per PRODUCT.md's
 * "transform/opacity motion only". The whole card is the link — the visible
 * button stretches over it via a pseudo-element, so the click target is the
 * full card while the focus ring stays on one real anchor.
 */
function Row({
  entry,
  tone,
}: {
  entry: ParsedEntry;
  /** This card's colour pair, from its position (lib/parents.ts, boardTone). */
  tone: ReturnType<typeof boardTone>;
}) {
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
        // Each card carries its own soft colour, a wash that holds across
        // half the card and fades to white, matched to its avatar.
        "group relative isolate rounded-md bg-gradient-to-br to-neutral-000 p-4 shadow-e1 ring-1 sm:p-5",
        tone.card,
        // The lift is a transform and the deeper shadow a pre-painted layer
        // that only fades in: nothing on hover repaints (PRODUCT.md).
        "transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:opacity-0 before:shadow-e2 before:transition-opacity before:duration-200 before:content-[''] hover:before:opacity-100",
        "focus-within:ring-2 focus-within:ring-primary-700"
      )}
    >
      <div className="flex gap-3.5">
        <span
          aria-hidden="true"
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full font-sans text-[14px] font-extrabold text-primary-800 shadow-e1 ring-2 ring-neutral-000",
            tone.avatar
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
                  depart.tone === "today" && "bg-accent-700 text-neutral-000",
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
            <p className="t-body-sm mt-3 line-clamp-2 text-text-secondary">
              {body}
            </p>
          )}

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {careChip && (
              <li className="inline-flex items-center gap-1 rounded-full bg-neutral-000 px-2.5 py-1 t-caption font-bold text-primary-800 ring-1 ring-accent-200">
                <HandHeart className="h-3 w-3 shrink-0 text-accent-700" aria-hidden="true" />
                {careChip}
              </li>
            )}
            {plainChips.slice(0, careChip ? 2 : 3).map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-neutral-000/85 px-2.5 py-1 t-caption text-primary-700 ring-1 ring-primary-900/[0.07]"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Price left, action right, on a soft footer that spans the card. */}
      <div className="-mx-4 -mb-4 mt-4 flex items-center justify-between gap-3 rounded-b-md border-t border-primary-900/[0.06] bg-neutral-000/75 px-4 py-3 sm:-mx-5 sm:-mb-5 sm:px-5">
        <span className="t-caption text-text-secondary">
          {amount === undefined ? (
            "Amount agreed with us"
          ) : amount > 0 ? (
            <>
              {isTraveller ? "Asking " : "Offering "}
              <span className="t-label-1 text-primary-800">£{amount}</span>
            </>
          ) : (
            <span className="t-label-3 text-success">No charge</span>
          )}
        </span>
        {href && (
          <Link
            href={href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 font-sans text-[12px] font-bold leading-[16px] transition-colors duration-200",
              "after:absolute after:inset-0 after:rounded-md after:content-[''] focus-visible:outline-none",
              isTraveller
                ? "border-primary-800 bg-neutral-000 text-primary-800 group-hover:bg-primary-800 group-hover:text-neutral-000 group-focus-within:bg-primary-800 group-focus-within:text-neutral-000"
                : "border-accent-700 bg-neutral-000 text-accent-700 group-hover:bg-accent-700 group-hover:text-neutral-000 group-focus-within:bg-accent-700 group-focus-within:text-neutral-000"
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
  const warm = tone === "requester";
  return (
    <section
      aria-label={title}
      // A white panel so the colour belongs to the cards; the side is told
      // by the header band (warm for families, cool navy for travellers).
      className={cn(
        "min-w-0 rounded-lg bg-neutral-000 p-2.5 shadow-e1 ring-1 ring-primary-900/[0.06] sm:p-3",
        className
      )}
    >
      <header
        className={cn(
          "mb-2.5 flex items-center justify-between gap-3 rounded-md px-3 py-3",
          warm ? "bg-accent-050" : "bg-primary-050"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-full text-neutral-000 shadow-e1",
              warm ? "bg-accent-500" : "bg-primary-800"
            )}
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-sans text-[17px] font-bold leading-[22px] text-primary-800 sm:text-[20px] sm:leading-[24px]">{title}</h3>
            <p className="t-caption truncate text-text-secondary">{subtitle}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-neutral-000 px-3 py-1 t-label-3 text-primary-800 shadow-e1">
          {countLabel}
        </span>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-md bg-neutral-000/70 px-5 py-10 text-center t-body-sm text-text-secondary">
          {empty}
        </p>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((entry, i) => (
            <li key={entry.reference ?? `row-${i}`}>
              <Row entry={entry} tone={boardTone(i, warm ? 0 : 2)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ── Filter rail ───────────────────────────────────────────────────────── */

type ChipOption = { value: string; label: string; count?: number };

/**
 * A group of filter chips. Each chip is a real checkbox (or radio, for a
 * single choice), visually hidden, so keyboard and screen reader get native
 * semantics; the label is what you see and tap. A count, where given, says
 * how many listings the option would match, and an option with none is
 * dimmed rather than removed.
 */
function ChipGroup({
  title,
  icon: Icon,
  options,
  selected,
  onToggle,
  single,
  className,
}: {
  title: string;
  icon: typeof Users;
  options: ChipOption[];
  selected: string[];
  onToggle: (value: string) => void;
  /** Radio behaviour: exactly one option is always on. */
  single?: boolean;
  className?: string;
}) {
  const name = useId();
  if (options.length === 0) return null;
  return (
    <fieldset className={className}>
      <legend className="flex items-center gap-1.5 t-label-2 text-primary-800">
        <Icon className="h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
        {title}
      </legend>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {options.map((option) => {
          const on = selected.includes(option.value);
          const empty = option.count === 0 && !on;
          return (
            <li key={option.value}>
              <label
                className={cn(
                  "inline-flex min-h-[34px] cursor-pointer select-none items-center gap-1.5 rounded-full px-3 py-1.5 t-caption transition-colors duration-150",
                  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-700 has-[:focus-visible]:ring-offset-1",
                  on
                    ? "border border-primary-800 bg-primary-800 font-bold text-neutral-000 shadow-e1"
                    : empty
                      ? "border border-dashed border-neutral-300 bg-neutral-000 text-text-secondary hover:border-primary-200"
                      : "border border-neutral-200 bg-neutral-050 text-primary-800 hover:border-primary-100 hover:bg-primary-050"
                )}
              >
                <input
                  type={single ? "radio" : "checkbox"}
                  name={single ? name : undefined}
                  checked={on}
                  onChange={() => onToggle(option.value)}
                  className="sr-only"
                />
                {on && !single && <Check className="h-3 w-3 shrink-0" aria-hidden="true" />}
                {option.label}
                {option.count !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-bold leading-[16px]",
                      on ? "bg-neutral-000/15 text-neutral-000" : "bg-neutral-000 text-text-secondary ring-1 ring-neutral-200"
                    )}
                  >
                    {option.count}
                  </span>
                )}
              </label>
            </li>
          );
        })}
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
  /** Which sides of the board are shown (the rail's "Show" group, lg up). */
  const [sides, setSides] = useState<Side[]>(["requester", "traveller"]);
  const [freeOnly, setFreeOnly] = useState(false);
  const [multi, setMulti] = useState(false);
  const [sort, setSort] = useState<Sort>("soonest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  /** Which column a narrow screen is showing; ignored from lg up. */
  const [mobileSide, setMobileSide] = useState<Side>(lockSide ?? "requester");

  const toggle = (list: string[], set: (v: string[]) => void) => (value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  /* ── Option lists: fixed lists ∪ what the feed carries, with counts ── */
  const options = useMemo(() => {
    const names = new Map<string, string>();
    const f: string[] = [];
    const t: string[] = [];
    const al: string[] = [];
    const lg: string[] = [];
    const sp: string[] = [];
    const count = new Map<string, number>();
    const bump = (k: string) => count.set(k, (count.get(k) ?? 0) + 1);

    for (const e of entries) {
      for (const raw of [e.from, e.to]) {
        const { code, name } = splitPlace(raw);
        if (code && name && !names.has(code)) names.set(code, name);
      }
      const fk = placeKey(e.from);
      const tk = placeKey(e.to);
      if (fk) {
        f.push(fk);
        bump(`from:${fk}`);
      }
      if (tk) {
        t.push(tk);
        bump(`to:${tk}`);
      }
      if (e.airline) {
        al.push(e.airline);
        bump(`air:${e.airline}`);
      }
      const spoken = new Set(
        (e.languages ?? "").split(/[,/]/).map(cleanLanguage).filter(Boolean)
      );
      for (const l of spoken) {
        lg.push(l);
        bump(`lang:${l}`);
      }
      if (e.mobility && e.type !== "traveller") {
        sp.push(e.mobility);
        bump(`sup:${e.mobility}`);
      }
    }

    const n = (k: string) => count.get(k) ?? 0;
    const listing = (c: number) => `${c} ${c === 1 ? "listing" : "listings"}`;
    const place = (kind: "from" | "to", list: string[]): SelectOption[] =>
      list.map((k) => {
        const c = n(`${kind}:${k}`);
        return { value: k, label: placeLabel(k, names), hint: listing(c), muted: c === 0 };
      });

    // Places keep the fixed order (busiest UK airports and routes first),
    // with anything new from the feed after them.
    const fromKeys = withFeed(COMMON_FROM, f.filter((k) => !COMMON_FROM.includes(k)).sort(), false);
    const toKeys = withFeed(COMMON_TO, t.filter((k) => !COMMON_TO.includes(k)).sort(), false);

    return {
      from: place("from", fromKeys),
      to: place("to", toKeys),
      airlines: withFeed(COMMON_AIRLINES, al).map((a) => {
        const c = n(`air:${a}`);
        return { value: a, label: a, hint: listing(c), muted: c === 0 };
      }),
      languages: withFeed(COMMON_LANGUAGES, lg).map((l) => ({
        value: l,
        label: l,
        count: n(`lang:${l}`),
      })),
      supports: withFeed([...MOBILITY_NEEDS], sp, false).map((v) => ({
        value: v,
        label: shortSupport(v),
        count: n(`sup:${v}`),
      })),
      sideCount: {
        requester: entries.filter((e) => e.type !== "traveller").length,
        traveller: entries.filter((e) => e.type === "traveller").length,
      },
      freeCount: entries.filter((e) => e.amount === 0).length,
      multiCount: entries.filter((e) => e.type === "traveller" && (e.capacity ?? 0) >= 2).length,
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
      // A support need only describes a family's post, and a headcount only
      // a traveller's, so each narrows its own column and leaves the other.
      if (supports.length > 0 && e.type !== "traveller") {
        if (!e.mobility || !supports.includes(e.mobility)) return false;
      }
      if (multi && e.type === "traveller" && (e.capacity ?? 0) < 2) return false;
      if (freeOnly && e.amount !== 0) return false;
      if (when !== "any") {
        const d = daysUntil(e.dateISO);
        if (d === undefined || d < 0) return false;
        if (when === "today" && d > 1) return false;
        if (when === "week" && d > 7) return false;
        if (when === "month" && d > 30) return false;
      }
      return true;
    };
  }, [query, from, to, airline, langs, supports, multi, freeOnly, when]);

  const order = useMemo(() => {
    const time = (v: string | undefined, missing: number) => {
      const d = v ? new Date(v).getTime() : NaN;
      return Number.isFinite(d) ? d : missing;
    };
    return sort === "newest"
      ? (x: ParsedEntry, y: ParsedEntry) =>
          time(y.postedISO, -Infinity) - time(x.postedISO, -Infinity)
      : (x: ParsedEntry, y: ParsedEntry) =>
          time(x.dateISO, Infinity) - time(y.dateISO, Infinity);
  }, [sort]);

  const requesters = useMemo(
    () => entries.filter((e) => e.type !== "traveller").filter(match).sort(order),
    [entries, match, order]
  );
  const travellers = useMemo(
    () => entries.filter((e) => e.type === "traveller").filter(match).sort(order),
    [entries, match, order]
  );

  const activeCount =
    (query.trim() ? 1 : 0) +
    (from ? 1 : 0) +
    (to ? 1 : 0) +
    (airline ? 1 : 0) +
    (when !== "any" ? 1 : 0) +
    (sides.length < 2 ? 1 : 0) +
    (freeOnly ? 1 : 0) +
    (multi ? 1 : 0) +
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
    setSides(["requester", "traveller"]);
    setFreeOnly(false);
    setMulti(false);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  // At least one side always stays on: switching off the last one would
  // leave an empty board that looks broken rather than filtered.
  const toggleSide = (side: string) =>
    setSides((cur) =>
      cur.includes(side as Side)
        ? cur.length > 1
          ? cur.filter((v) => v !== side)
          : cur
        : [...cur, side as Side]
    );

  const loading = state.status === "loading";

  const anyFrom: SelectOption = { value: "", label: "Any airport" };
  const anyTo: SelectOption = { value: "", label: "Anywhere" };
  const anyAirline: SelectOption = { value: "", label: "Any airline" };
  const whenOptions: SelectOption[] = WHEN_OPTIONS.map((o) => ({
    value: o.key,
    label: o.label,
  }));

  const label = (text: string, Icon: typeof MapPin) => (
    <span className="mb-1.5 flex items-center gap-1.5 t-label-2 text-primary-800">
      <Icon className="h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
      {text}
    </span>
  );

  /* ── Search bar ──────────────────────────────────────────────────── */
  const searchBar = (
    <div className="rounded-lg bg-neutral-000 p-4 shadow-e3 ring-1 ring-primary-900/[0.06] sm:p-5">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center">
        <Select
          variant="well"
          label="Flying from"
          icon={PlaneTakeoff}
          ariaLabel="Flying from"
          value={from}
          onChange={setFrom}
          options={[anyFrom, ...options.from]}
          menuMinWidth={300}
        />

        <button
          type="button"
          onClick={swap}
          disabled={!from && !to}
          aria-label="Swap the two airports"
          className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-000 text-accent-600 shadow-e1 ring-1 ring-neutral-300 transition-[transform,color] duration-200 hover:rotate-180 hover:text-accent-700 disabled:opacity-40 disabled:hover:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 motion-reduce:hover:rotate-0 lg:grid"
        >
          <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <Select
          variant="well"
          label="Flying to"
          icon={PlaneLanding}
          ariaLabel="Flying to"
          value={to}
          onChange={setTo}
          options={[anyTo, ...options.to]}
          menuMinWidth={300}
        />

        <Select
          variant="well"
          label="When"
          icon={CalendarDays}
          ariaLabel="When"
          emptyValue="any"
          value={when}
          onChange={(v) => setWhen(v as When)}
          options={whenOptions}
        />

        <a
          href="#results"
          className="btn btn-primary h-[58px] rounded-md px-8 shadow-e2 transition-transform duration-200 hover:-translate-y-px motion-reduce:hover:translate-y-0"
        >
          <Search className="h-[18px] w-[18px]" aria-hidden="true" />
          Search
        </a>
      </div>
    </div>
  );

  /* ── Filter rail ─────────────────────────────────────────────────── */
  const filters = (
    <div className="rounded-lg bg-neutral-000 p-5 shadow-e1 ring-1 ring-primary-900/[0.06]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 t-label-1 text-primary-800">
          <SlidersHorizontal className="h-4 w-4 text-accent-500" aria-hidden="true" />
          Refine
        </h2>
        <button
          type="button"
          onClick={clearAll}
          disabled={activeCount === 0}
          className="rounded-full px-2 py-1 t-caption font-bold text-accent-700 transition-colors hover:bg-accent-050 disabled:font-normal disabled:text-text-secondary disabled:opacity-60 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
        >
          Clear all{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {!lockSide && (
          <ChipGroup
            className="hidden lg:block"
            title="Show"
            icon={Users}
            options={[
              { value: "requester", label: "Families needing help", count: options.sideCount.requester },
              { value: "traveller", label: "Travellers offering help", count: options.sideCount.traveller },
            ]}
            selected={sides}
            onToggle={toggleSide}
          />
        )}

        <ChipGroup
          title="Travel date"
          icon={CalendarDays}
          single
          options={WHEN_OPTIONS.map((o) => ({ value: o.key, label: o.label }))}
          selected={[when]}
          onToggle={(v) => setWhen(v as When)}
        />

        <div className="space-y-3">
          <div>
            {label("Flying from", PlaneTakeoff)}
            <Select
              variant="compact"
              ariaLabel="Flying from"
              value={from}
              onChange={setFrom}
              options={[anyFrom, ...options.from]}
              menuMinWidth={300}
            />
          </div>
          <div>
            {label("Flying to", PlaneLanding)}
            <Select
              variant="compact"
              ariaLabel="Flying to"
              value={to}
              onChange={setTo}
              options={[anyTo, ...options.to]}
              menuMinWidth={300}
            />
          </div>
          <div>
            {label("Airline", Plane)}
            <Select
              variant="compact"
              ariaLabel="Airline"
              value={airline}
              onChange={setAirline}
              options={[anyAirline, ...options.airlines]}
              menuMinWidth={300}
            />
          </div>
        </div>

        <div className="space-y-6 border-t border-neutral-200 pt-5">
          <ChipGroup
            title="Help needed"
            icon={HandHeart}
            options={options.supports}
            selected={supports}
            onToggle={toggle(supports, setSupports)}
          />
          <ChipGroup
            title="Language spoken"
            icon={Languages}
            options={options.languages}
            selected={langs}
            onToggle={toggle(langs, setLangs)}
          />
          <ChipGroup
            title="Cost and group size"
            icon={Wallet}
            options={[
              { value: "free", label: "Free help only", count: options.freeCount },
              { value: "multi", label: "Can help 2+ people", count: options.multiCount },
            ]}
            selected={[freeOnly ? "free" : "", multi ? "multi" : ""].filter(Boolean)}
            onToggle={(v) => (v === "free" ? setFreeOnly((x) => !x) : setMulti((x) => !x))}
          />
        </div>
      </div>
    </div>
  );

  /* ── Columns ─────────────────────────────────────────────────────── */
  /* Below lg the segmented control picks one column; from lg up the rail's
     "Show" group can hide either. The two rules never share a breakpoint,
     so there's no display-class tug of war between them. */
  const columnVisibility = (side: Side) => {
    if (lockSide) return undefined;
    const mobile = mobileSide === side ? "" : "hidden";
    const desktop = sides.includes(side) ? "lg:block" : "lg:hidden";
    return cn(mobile, desktop);
  };
  const bothShown = !lockSide && sides.length === 2;

  const familiesColumn = lockSide === "traveller" ? null : (
    <BoardColumn
      title="Parents / Passengers"
      subtitle="Looking for help"
      icon={Users}
      tone="requester"
      rows={requesters}
      countLabel={`${requesters.length} ${requesters.length === 1 ? "request" : "requests"}`}
      empty="No families are asking on this route yet — if you're flying it, your offer would be the first."
      className={columnVisibility("requester")}
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
      className={columnVisibility("traveller")}
    />
  );

  const columnGrid = bothShown ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1";

  return (
    <>
      {showHero && (
        /* The site's one hero language (see /flights, /visa): a full-bleed
           photograph under two navy scrims, white type. This used to be a
           white-washed photo on a pale panel, the only page that looked
           like that. The bottom padding leaves room for the search card,
           which overlaps the hero's lower edge from the section below. */
        <section className="relative isolate overflow-hidden pb-24 pt-10 sm:pb-28 sm:pt-14 lg:pb-32 lg:pt-16">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <Image
              src="/support/airport-companion.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[70%_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 from-20% via-primary-900/80 via-60% to-primary-900/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 via-transparent via-45% to-primary-900/70" />
          </div>

          <div className="container-page relative">
            <nav aria-label="Breadcrumb" className="hero-rise">
              <ol className="flex flex-wrap items-center gap-2 t-label-3 text-primary-200">
                <li>
                  <Link
                    href="/"
                    className="rounded-xs transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-primary-300" aria-hidden="true" />
                  <span aria-current="page" className="text-text-on-dark">
                    Parent Travel Assist
                  </span>
                </li>
              </ol>
            </nav>

            <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-2">
              <h1 className="hero-rise t-h1 max-w-2xl text-balance text-text-on-dark">
                Find a traveller who can help
              </h1>
              <p className="hero-rise hero-rise-2 hidden -rotate-2 pb-1 t-editorial-3 italic leading-snug text-accent-400 lg:block">
                Real people. Real help.
              </p>
            </div>
            <p className="hero-rise hero-rise-2 t-body-lg mt-4 max-w-xl text-pretty text-primary-100">
              Parents and passengers connect with travellers flying the same
              route and date. A coordinator here makes every introduction —
              contact details are never published.
            </p>

            <ul className="hero-rise hero-rise-3 mt-6 flex flex-wrap gap-2.5">
              {[
                { icon: Headset, text: "Every introduction made by our team" },
                { icon: LockKeyhole, text: "Contact details never published" },
                { icon: Clock3, text: "Free to post, takes two minutes" },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-000/10 bg-neutral-000/5 px-3.5 py-1.5 t-label-3 text-primary-100"
                >
                  <Icon className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section
        id="board"
        className={cn(
          "scroll-mt-16 bg-neutral-050 pb-12 md:pb-16",
          showHero ? "pt-0" : "pt-8 md:pt-10"
        )}
      >
        <div className="container-page">
          {showHero && (
            <div className="hero-rise hero-rise-3 relative -mt-16 mb-8 sm:-mt-20 md:mb-10">
              {searchBar}
            </div>
          )}
          <div className="grid gap-6 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-8">
            {/* Filter rail — a disclosure on mobile, always open from lg. */}
            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
                className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-lg bg-neutral-000 px-4 py-3 t-label-2 text-primary-800 shadow-e1 ring-1 ring-primary-900/[0.06] lg:hidden"
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
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-accent-500"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search the board"
                    placeholder="Search a name, route or reference…"
                    className="input h-12 rounded-lg border-transparent py-0 pl-11 pr-10 text-[15px] shadow-e1 ring-1 ring-primary-900/[0.06] focus-visible:border-primary-700"
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
                <div className="sm:w-[220px]">
                  <Select
                    variant="toolbar"
                    icon={ArrowDownUp}
                    ariaLabel="Sort by"
                    value={sort}
                    onChange={(v) => setSort(v as Sort)}
                    options={SORT_OPTIONS}
                  />
                </div>
              </div>

              {/* Below lg there is no room for two columns, so one is picked. */}
              {!lockSide && (
                <div
                  role="group"
                  aria-label="Which side of the board"
                  className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-primary-050 p-1 ring-1 ring-primary-100 lg:hidden"
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
                        "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-2 t-label-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
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
              <div className="mt-4 flex items-start gap-3.5 rounded-lg bg-neutral-000 px-4 py-3.5 shadow-e1 ring-1 ring-primary-900/[0.06]">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-050 ring-1 ring-accent-100">
                  <MessageCircle className="h-4 w-4 text-accent-700" aria-hidden="true" />
                </span>
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
                  {(lockSide ? [lockSide] : (["requester", "traveller"] as const)).map((col) => (
                    <div
                      key={col}
                      className={cn(
                        "rounded-lg bg-neutral-000 p-3 shadow-e1 ring-1 ring-primary-900/[0.06]",
                        !lockSide && col !== mobileSide && "hidden lg:block"
                      )}
                      aria-hidden="true"
                    >
                      <div
                        className={cn(
                          "mb-2.5 flex items-center gap-3 rounded-md px-3 py-3",
                          col === "requester" ? "bg-accent-050" : "bg-primary-050"
                        )}
                      >
                        <div className="h-10 w-10 rounded-full bg-neutral-000/80" />
                        <div className="h-4 w-40 rounded-full bg-neutral-000/80" />
                      </div>
                      <div className="space-y-2.5">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="flex animate-pulse gap-3.5 rounded-md bg-neutral-050 p-5 ring-1 ring-primary-900/[0.05]">
                            <div className="h-11 w-11 shrink-0 rounded-full bg-neutral-100" />
                            <div className="flex-1 space-y-2.5">
                              <div className="h-3.5 w-32 rounded-full bg-neutral-100" />
                              <div className="h-4 w-44 rounded-full bg-neutral-100" />
                              <div className="h-3 w-full rounded-full bg-neutral-100" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cn("mt-4 grid items-start gap-5", columnGrid)}>
                  {familiesColumn}
                  {travellersColumn}
                </div>
              )}

              {/* The way out of "nobody is on my route" is to post, so the
                  board closes on one dark band rather than trailing off. */}
              <div className="mt-6 flex flex-col items-center gap-4 rounded-lg bg-primary-800 px-5 py-5 shadow-e2 sm:flex-row sm:justify-between sm:px-7 sm:py-6">
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
