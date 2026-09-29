"use client";

import { type ReactNode, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  HandHeart,
  Info,
  Languages,
  Loader2,
  MapPin,
  MessageCircle,
  PenLine,
  Plane,
  RefreshCw,
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
  initialsOf,
  type ParsedEntry,
  placeKey,
  postedAgo,
  searchHaystack,
  splitPlace,
} from "@/lib/parents";
import { useParentBoard } from "@/lib/useParentBoard";

/**
 * THE ASSIST FAMILY APP — the whole of /parents-tickets above the form.
 *
 * WHAT THIS IS FOR. The audience already runs this service by hand in
 * WhatsApp groups: somebody posts "flying LHR→HYD Thursday, anyone need
 * help?" and whoever recognises the route replies. A page of prose cannot
 * replace that. What can is the layout below, which is a search product:
 *
 *   hero          the question, and one From / To / When widget to ask it
 *   left rail     the filters, always visible, never behind a toggle on desktop
 *   centre        two tabs — the two sides of the board — and the results
 *   right rail    how it works, what we promise, and the way in
 *
 * ONE LIST, NOT TWO. The two sides are tabs rather than facing columns: at
 * this column width a split view halves the room each row has, and a visitor
 * is only ever shopping one side. The counts sit on the tabs so the other
 * side's size is still visible without switching.
 *
 * EVERY FILTER IS BUILT FROM THE DATA. Airports, languages, airlines and
 * support needs are all collected from the entries actually on the board, so
 * a filter can never offer an option with nothing behind it — and there is
 * no filter here for anything the feed does not carry. In particular there
 * is no "verified only" toggle and no response-time badge: we issue no
 * verification and measure no response time, so neither may appear as if we
 * did.
 *
 * AVATARS ARE INITIALS, NEVER PHOTOGRAPHS. The feed is anonymised down to a
 * first name and a last initial, so there is no real face to show — a stock
 * portrait would tell the visitor we had one.
 *
 * PRIVACY IS UNCHANGED. Every field rendered is one the poster ticked a box
 * to publish; the feed carries no contact details at all; the only call to
 * action is to ask our team.
 */

type Side = "requester" | "traveller";
type When = "any" | "today" | "week" | "month";
type Sort = "soonest" | "newest" | "amount";

const WHEN_OPTIONS: { key: When; label: string }[] = [
  { key: "any", label: "Any date" },
  { key: "today", label: "Today or tomorrow" },
  { key: "week", label: "Next 7 days" },
  { key: "month", label: "Next 30 days" },
];

const SORT_OPTIONS: { key: Sort; label: string }[] = [
  { key: "soonest", label: "Departing soonest" },
  { key: "newest", label: "Recently posted" },
  { key: "amount", label: "Highest amount" },
];

/** "None — just company and reassurance" is a form label, not a filter chip. */
function shortSupport(value: string): string {
  return value
    .replace(/^None\s*[—-]\s*/i, "")
    .replace(/\s*\(described in the notes\)$/i, "")
    .replace(/^./, (c) => c.toUpperCase());
}

/* ── Small parts ───────────────────────────────────────────────────────── */

function Avatar({ name, size = 52 }: { name: string | undefined; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-sans font-extrabold ring-1",
        avatarTone(name),
        size > 44 ? "text-[16px]" : "text-[13px]"
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: typeof MapPin;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 t-label-3 text-text-secondary">
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />}
        {label}
      </span>
      {children}
    </label>
  );
}

const selectClass =
  "mt-1.5 h-11 w-full cursor-pointer rounded-sm border border-neutral-300 bg-neutral-000 px-3 font-sans text-[14px] leading-[20px] text-text-primary focus-visible:border-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700";

function CheckGroup({
  title,
  icon: Icon,
  options,
  selected,
  onToggle,
  format,
}: {
  title: string;
  icon: typeof Languages;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  format?: (value: string) => string;
}) {
  if (options.length === 0) return null;
  return (
    <fieldset className="border-t border-neutral-200 pt-4">
      <legend className="flex items-center gap-1.5 t-label-2 text-primary-800">
        <Icon className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
        {title}
      </legend>
      <ul className="mt-2.5 space-y-2.5">
        {options.map((option) => (
          <li key={option}>
            <label className="flex cursor-pointer items-start gap-2.5 t-body-sm text-text-secondary transition-colors hover:text-primary-800">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
              />
              <span>{format ? format(option) : option}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

/* ── Result row ────────────────────────────────────────────────────────── */

function ResultRow({ entry }: { entry: ParsedEntry }) {
  const {
    isTraveller,
    isSample,
    reference,
    name,
    from,
    to,
    dateISO,
    airline,
    languages,
    body,
    relationship,
    mobility,
    parentAge,
    capacity,
    amount,
    postedISO,
  } = entry;

  const a = splitPlace(from);
  const b = splitPlace(to);
  const depart = departureLabel(dateISO);
  const posted = postedAgo(postedISO);

  /* Only real fields. No "responds within 2 hrs" — nobody measures that. */
  const facts: { icon: typeof Users; text: string }[] = [];
  if (isTraveller) {
    if (capacity !== undefined) {
      facts.push({
        icon: Users,
        text: `Can accompany ${capacity} ${capacity === 1 ? "person" : "people"}`,
      });
    }
  } else {
    if (relationship) {
      facts.push({
        icon: Users,
        text: `Posted by their ${relationship.toLowerCase()}${
          parentAge !== undefined ? ` · age ${parentAge}` : ""
        }`,
      });
    }
    if (mobility) facts.push({ icon: HandHeart, text: shortSupport(mobility) });
  }
  if (languages) facts.push({ icon: Languages, text: languages });

  const href = reference
    ? `/parents-tickets/listing/${encodeURIComponent(reference)}`
    : undefined;

  return (
    <article className="group relative rounded-md border border-neutral-300 bg-neutral-000 p-5 transition-all duration-200 hover:border-primary-200 hover:shadow-e2">
      <div className="flex gap-4">
        <Avatar name={name} />

        <div className="min-w-0 flex-1">
          {/* Name row — status chip rides the right edge, as on a feed. */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="t-label-1 text-primary-800">
                  {name ?? "A board member"}
                </span>
                {isSample && (
                  <span className="pill bg-neutral-100 text-text-secondary">
                    Example
                  </span>
                )}
              </p>
              {(a.name ?? a.code) && (
                <p className="mt-0.5 flex items-center gap-1 t-caption text-text-secondary">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                  Departing from {a.name ?? a.code}
                </p>
              )}
            </div>
            <span
              className={cn(
                "pill shrink-0",
                isTraveller
                  ? "bg-success-surface text-success"
                  : "bg-accent-100 text-accent-700"
              )}
            >
              {isTraveller ? (
                <HandHeart className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {isTraveller ? "Available to help" : "Looking for help"}
            </span>
          </div>

          {/* Route line — the row's spine, and the thing people scan for. */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="flex items-center gap-2 t-label-2 text-primary-800">
              <Plane className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
              <span>{a.code ?? a.name ?? "—"}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
              <span>{b.code ?? b.name ?? "—"}</span>
            </p>
            {depart && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 t-label-3",
                  depart.tone === "today"
                    ? "bg-accent-500 text-neutral-000"
                    : depart.tone === "soon"
                      ? "bg-accent-050 text-accent-700"
                      : "bg-neutral-100 text-text-secondary"
                )}
              >
                <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {depart.text}
              </span>
            )}
            {airline && (
              <span className="inline-flex items-center gap-1.5 t-caption text-text-secondary">
                <Plane className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {airline}
              </span>
            )}
          </div>

          {body && (
            <p className="t-body-sm mt-3 line-clamp-2 text-text-secondary">
              {body}
            </p>
          )}

          {/* Footer — facts left, the one action right. */}
          <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <ul className="flex min-w-0 flex-wrap gap-x-4 gap-y-1">
              {facts.map((f) => (
                <li
                  key={f.text}
                  className="inline-flex items-center gap-1.5 t-caption text-text-secondary"
                >
                  <f.icon className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                  {f.text}
                </li>
              ))}
              {posted && (
                <li className="t-caption text-text-tertiary">Posted {posted}</li>
              )}
            </ul>

            <div className="flex shrink-0 items-center gap-4">
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
              {href && (
                <Link
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-sm px-4 py-2.5 t-button-sm text-neutral-000 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isTraveller
                      ? "bg-primary-800 hover:bg-primary-700 focus-visible:ring-primary-700"
                      : "bg-accent-500 hover:bg-accent-600 focus-visible:ring-accent-500"
                  )}
                >
                  {isTraveller ? "Offer to match" : "View details"}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── App ───────────────────────────────────────────────────────────────── */

export default function AssistFamilyApp({
  lockSide,
  showHero = true,
  aside,
}: {
  /** Pins the board to one side — used by the two dedicated list pages. */
  lockSide?: Side;
  showHero?: boolean;
  aside?: ReactNode;
}) {
  const { state, entries, source, reload } = useParentBoard(50);

  const [side, setSide] = useState<Side>(lockSide ?? "requester");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [when, setWhen] = useState<When>("any");
  const [airline, setAirline] = useState("");
  const [langs, setLangs] = useState<string[]>([]);
  const [supports, setSupports] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("soonest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeSide = lockSide ?? side;

  const toggle = (list: string[], set: (v: string[]) => void) => (value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  /* Options come from the entries in hand, so no filter is ever a dead end. */
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
        // Posters qualify languages freely ("basic Hindi", "some Urdu").
        // The qualifier is theirs to write and is kept on the card, but as a
        // filter it would sit as a second, lowercase entry beside the real
        // one — so the option list normalises to the language itself.
        const v = part
          .trim()
          .replace(/^(basic|some|fluent|conversational|a little)\s+/i, "")
          .replace(/^./, (c) => c.toUpperCase());
        if (v) lg.add(v);
      }
      if (e.mobility && e.type !== "traveller") sp.add(e.mobility);
    }
    const sorted = (s: Set<string>) => [...s].sort((a, b) => a.localeCompare(b));
    return {
      from: sorted(f),
      to: sorted(t),
      airlines: sorted(al),
      languages: sorted(lg),
      supports: sorted(sp),
    };
  }, [entries]);

  const bySide = useMemo(
    () => ({
      requester: entries.filter((e) => e.type !== "traveller"),
      traveller: entries.filter((e) => e.type === "traveller"),
    }),
    [entries]
  );

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    const rows = bySide[activeSide].filter((e) => {
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
      // Support needs only describe a family's post, so this narrows the
      // families tab and is not offered on the travellers one.
      if (activeSide === "requester" && supports.length > 0) {
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
    });

    const date = (e: ParsedEntry) => {
      const d = e.dateISO ? new Date(e.dateISO).getTime() : NaN;
      return Number.isFinite(d) ? d : Number.POSITIVE_INFINITY;
    };
    const posted = (e: ParsedEntry) => {
      const d = e.postedISO ? new Date(e.postedISO).getTime() : NaN;
      return Number.isFinite(d) ? d : 0;
    };

    return [...rows].sort((a, b) => {
      if (sort === "newest") return posted(b) - posted(a);
      if (sort === "amount") return (b.amount ?? -1) - (a.amount ?? -1);
      return date(a) - date(b);
    });
  }, [bySide, activeSide, query, from, to, airline, langs, supports, when, sort]);

  const activeCount =
    (query.trim() ? 1 : 0) +
    (from ? 1 : 0) +
    (to ? 1 : 0) +
    (airline ? 1 : 0) +
    (when !== "any" ? 1 : 0) +
    langs.length +
    (activeSide === "requester" ? supports.length : 0);

  const reset = () => {
    setQuery("");
    setFrom("");
    setTo("");
    setAirline("");
    setWhen("any");
    setLangs([]);
    setSupports([]);
  };

  const loading = state.status === "loading";

  /* ── Filter rail ─────────────────────────────────────────────────── */
  const filters = (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="t-label-1 flex items-center gap-2 text-primary-800">
          <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 t-caption text-neutral-000">
              {activeCount}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={reset}
          disabled={activeCount === 0}
          className="rounded-xs t-label-3 text-text-secondary underline underline-offset-4 transition-colors hover:text-primary-800 disabled:no-underline disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
        >
          Reset
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <Field label="Travel date" icon={CalendarDays}>
          <select
            value={when}
            onChange={(e) => setWhen(e.target.value as When)}
            className={selectClass}
          >
            {WHEN_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="From" icon={MapPin}>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={selectClass}
          >
            <option value="">Any airport</option>
            {options.from.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="To" icon={MapPin}>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={selectClass}
          >
            <option value="">Anywhere</option>
            {options.to.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Airline" icon={Plane}>
          <select
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            className={selectClass}
          >
            <option value="">Any airline</option>
            {options.airlines.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6 space-y-6">
        {activeSide === "requester" && (
          <CheckGroup
            title="Support needed"
            icon={HandHeart}
            options={options.supports}
            selected={supports}
            onToggle={toggle(supports, setSupports)}
            format={shortSupport}
          />
        )}
        <CheckGroup
          title="Language spoken"
          icon={Languages}
          options={options.languages}
          selected={langs}
          onToggle={toggle(langs, setLangs)}
        />
      </div>
    </div>
  );

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <>
      {showHero && (
        <section className="relative overflow-hidden bg-primary-050">
          {/* Photograph from md up only. On a phone the panel is barely wider
              than the headline, so the picture lands directly behind the lead
              paragraph however hard the scrim works. */}
          <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
            <Image
              src="/support/airport-companion.jpg"
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
            />
            {/* Fades the photograph into the panel rather than cutting it
                against a hard edge, so the headline can run long without
                colliding with it. */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-050 via-primary-050/70 to-primary-050/10" />
          </div>

          <div className="container-page relative pb-10 pt-12 sm:pt-16">
            <div className="flex flex-wrap items-start gap-x-10 gap-y-3">
              <h1 className="hero-rise t-display-3 max-w-xl text-balance text-primary-800">
                Find a traveller who can help
              </h1>
              <p className="hero-rise hero-rise-2 hidden max-w-[12rem] -rotate-2 t-editorial-2 italic leading-tight text-accent-600 lg:block">
                Real people.
                <br />
                Real help.
              </p>
            </div>
            <p className="hero-rise hero-rise-2 t-body-lg mt-4 max-w-xl text-pretty text-text-secondary">
              Families whose relative is flying alone, and travellers already
              booked on the same route. Search the board, and a coordinator
              here makes the introduction.
            </p>

            {/* The search widget: the same three questions the group chat
                asks, as one control. Fields apply as you set them; the
                button is the affordance that takes you to the results. */}
            <div className="hero-rise hero-rise-3 mt-8 rounded-md border border-neutral-300 bg-neutral-000 p-3 shadow-e3 sm:p-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
                <Field label="From" icon={MapPin}>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className={selectClass}
                    disabled={loading}
                  >
                    <option value="">Any airport</option>
                    {options.from.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="To" icon={MapPin}>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className={selectClass}
                    disabled={loading}
                  >
                    <option value="">Anywhere</option>
                    {options.to.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Travel date" icon={CalendarDays}>
                  <select
                    value={when}
                    onChange={(e) => setWhen(e.target.value as When)}
                    className={selectClass}
                  >
                    {WHEN_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <a
                  href="#results"
                  className="btn btn-secondary h-11 w-full px-8 lg:w-auto"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        id="board"
        className={cn("scroll-mt-16 bg-neutral-050", showHero ? "py-10" : "py-10 md:py-12")}
      >
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)_296px]">
            {/* Left rail — a drawer on mobile, always open from lg. */}
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
                <span className="t-label-3 text-text-secondary">
                  {filtersOpen ? "Hide" : "Show"}
                </span>
              </button>
              <div className={cn("mt-3 lg:mt-0", filtersOpen ? "block" : "hidden lg:block")}>
                {filters}
              </div>
            </div>

            {/* Centre — tabs, then the results. */}
            <div id="results" className="min-w-0 scroll-mt-20">
              {!lockSide && (
                <div
                  role="tablist"
                  aria-label="Which side of the board"
                  className="flex overflow-hidden rounded-md border border-neutral-300 bg-neutral-000"
                >
                  {(
                    [
                      {
                        key: "requester" as const,
                        label: "Families looking for help",
                        short: "Looking for help",
                        icon: Users,
                      },
                      {
                        key: "traveller" as const,
                        label: "Travellers available to help",
                        short: "Available to help",
                        icon: HandHeart,
                      },
                    ]
                  ).map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      aria-selected={side === t.key}
                      onClick={() => setSide(t.key)}
                      className={cn(
                        "flex min-h-[56px] flex-1 items-center justify-center gap-2 border-b-2 px-3 t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-700",
                        side === t.key
                          ? "border-accent-500 bg-accent-050 text-primary-800"
                          : "border-transparent text-text-secondary hover:bg-neutral-050 hover:text-primary-800"
                      )}
                    >
                      <t.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate sm:hidden">{t.short}</span>
                      <span className="hidden truncate sm:inline">{t.label}</span>
                      <span
                        className={cn(
                          "grid h-6 min-w-6 shrink-0 place-items-center rounded-full px-1.5 t-label-3",
                          side === t.key
                            ? "bg-accent-500 text-neutral-000"
                            : "bg-neutral-100 text-text-secondary"
                        )}
                      >
                        {bySide[t.key].length}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Keyword search + sort — the two controls that belong beside
                  the results rather than in the rail. */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
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
                    className="input h-11 py-0 pl-10 pr-9 text-[14px]"
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
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  aria-label="Sort the results"
                  className={cn(selectClass, "mt-0 sm:w-56")}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {source === "sample" && (
                <div className="mt-4 rounded-md border border-warning/30 bg-warning-surface px-4 py-3 md:flex md:items-start md:gap-3">
                  <Info
                    className="mb-2 h-5 w-5 shrink-0 text-accent-700 md:mb-0 md:mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 md:flex-1">
                    <p className="t-label-2 text-primary-800">
                      These are example listings, not real people
                    </p>
                    <p className="t-caption mt-1 text-text-secondary">
                      {state.status === "ready" && state.feedError
                        ? "The live board isn’t reachable at the moment, so here’s what it looks like in use. "
                        : "Nothing is open on the live board right now, so here’s what it looks like in use. "}
                      Every row is marked “Example”. Post a real one and it
                      appears here once a coordinator approves it.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={reload}
                    className="btn btn-outline btn-sm mt-3 shrink-0 md:mt-0"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Retry
                  </button>
                </div>
              )}

              {source === "live" && (
                <p className="mt-4 flex items-center gap-2 t-caption text-text-secondary">
                  <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  Live board · updated continuously
                </p>
              )}

              {loading ? (
                <div className="mt-4 space-y-4">
                  <p className="sr-only" role="status">
                    Loading the board…
                  </p>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="card animate-pulse p-5"
                      aria-hidden="true"
                    >
                      <div className="flex gap-4">
                        <div className="h-[52px] w-[52px] shrink-0 rounded-full bg-neutral-100" />
                        <div className="flex-1 space-y-3 pt-1">
                          <div className="h-4 w-40 rounded-xs bg-neutral-100" />
                          <div className="h-3 w-32 rounded-xs bg-neutral-100" />
                          <div className="h-3 w-full rounded-xs bg-neutral-100" />
                          <div className="h-3 w-4/5 rounded-xs bg-neutral-100" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="flex items-center justify-center gap-2 t-body-sm text-text-secondary">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Loading the board…
                  </p>
                </div>
              ) : (
                <>
                  <p className="mt-4 t-caption text-text-secondary">
                    Showing <strong className="text-primary-800">{results.length}</strong>{" "}
                    of {bySide[activeSide].length}{" "}
                    {activeSide === "traveller" ? "offers" : "requests"}
                    {activeCount > 0 && (
                      <>
                        {" · "}
                        <button
                          type="button"
                          onClick={reset}
                          className="rounded-xs t-label-3 text-primary-800 underline underline-offset-2 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
                        >
                          clear filters
                        </button>
                      </>
                    )}
                  </p>

                  <ul className="mt-3 space-y-4">
                    {results.map((entry, i) => (
                      <li key={entry.reference ?? `row-${i}`}>
                        <ResultRow entry={entry} />
                      </li>
                    ))}
                  </ul>

                  {/* Always the last thing in the list, as much for a full
                      board as an empty one: the way out of "nobody is on my
                      route" is to post, not to keep scrolling. */}
                  <div className="mt-4 rounded-md border border-dashed border-neutral-300 bg-neutral-000 px-5 py-6 text-center sm:px-8">
                    <p className="t-label-1 text-primary-800">
                      {results.length === 0
                        ? "No matching results yet"
                        : "Not the route you needed?"}
                    </p>
                    <p className="t-body-sm mx-auto mt-2 max-w-md text-text-secondary">
                      Routes fill up as people book, so a quiet search is
                      normal rather than a dead end. Post the journey and our
                      team will go looking for the other half of it.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                      <a href="#post-to-the-board" className="btn btn-primary btn-sm">
                        <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                        Post a request
                      </a>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        WhatsApp us
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

            {aside && (
              <div className="xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:self-start xl:overflow-y-auto xl:pr-1">
                {aside}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
