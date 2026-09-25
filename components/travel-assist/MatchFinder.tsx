"use client";

import { useId, type ReactNode } from "react";
import {
  ArrowLeftRight,
  CalendarDays,
  ChevronDown,
  HandHeart,
  HeartHandshake,
  Minus,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  INDIA_AIRPORTS,
  POPULAR_CORRIDORS,
  UK_AIRPORTS,
  cityOf,
  type AirportOption,
} from "@/lib/travelAssist";
import { isoDate, offsetOf, shortDate, useToday } from "@/components/travel-assist/dates";

export type Mode = "requester" | "traveller";
export type Query = { from: string; to: string; date: string; count: number };

export const EMPTY_QUERY: Query = { from: "", to: "", date: "", count: 1 };

const MODES: { key: Mode; label: string; short: string; icon: typeof HandHeart }[] = [
  {
    key: "requester",
    label: "My parents need a companion",
    short: "Find a companion",
    icon: HeartHandshake,
  },
  {
    key: "traveller",
    label: "I’m flying and can help",
    short: "Offer to help",
    icon: HandHeart,
  },
];

/* ── Field shell ─────────────────────────────────────────────────────────
   One look for every field: a tinted tile with a small overline label and a
   large value. The real control (a native <select> or date input) sits over
   the whole tile, invisible, so phones get their own picker — the fastest,
   most familiar control on a mid-range Android — while the tile keeps this
   page's own typography. */
function FieldTile({
  label,
  icon: Icon,
  children,
  className,
}: {
  label: string;
  icon: typeof PlaneTakeoff;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex min-h-[72px] items-center gap-3 rounded-md bg-primary-050 px-4 py-3 ring-1 ring-transparent transition-colors hover:bg-primary-100/60 focus-within:bg-neutral-000 focus-within:ring-2 focus-within:ring-primary-700",
        className
      )}
    >
      <Icon className="h-5 w-5 shrink-0 text-primary-500" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <span className="block t-overline text-text-secondary">{label}</span>
        {children}
      </div>
    </div>
  );
}

function AirportField({
  label,
  icon,
  value,
  onChange,
  anyLabel,
  first,
}: {
  label: string;
  icon: typeof PlaneTakeoff;
  value: string;
  onChange: (code: string) => void;
  anyLabel: string;
  /** Which country's airports to list first. */
  first: "india" | "uk";
}) {
  const id = useId();
  const groups: [string, AirportOption[]][] =
    first === "india"
      ? [
          ["India", INDIA_AIRPORTS],
          ["United Kingdom", UK_AIRPORTS],
        ]
      : [
          ["United Kingdom", UK_AIRPORTS],
          ["India", INDIA_AIRPORTS],
        ];

  return (
    <FieldTile label={label} icon={icon}>
      <span className="mt-0.5 flex items-baseline gap-2 pr-5">
        <span className={cn("truncate t-label-1", value ? "text-primary-800" : "text-text-secondary")}>
          {value ? cityOf(value) : anyLabel}
        </span>
        {value && <span className="t-code shrink-0 text-primary-500">{value}</span>}
      </span>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500"
        aria-hidden="true"
      />
      <select
        id={id}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
      >
        <option value="">{anyLabel}</option>
        {groups.map(([name, list]) => (
          <optgroup key={name} label={name}>
            {list.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} — {a.name} ({a.code})
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </FieldTile>
  );
}

function DateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const today = useToday();
  const min = today === null ? undefined : isoDate(today, 0);
  const display =
    value && today !== null ? shortDate(today, offsetOf(today, value)) : "Any date";

  return (
    <FieldTile label="Travel date" icon={CalendarDays}>
      <span
        className={cn(
          "mt-0.5 block truncate pr-6 t-label-1",
          value ? "text-primary-800" : "text-text-secondary"
        )}
      >
        {display}
      </span>
      <input
        type="date"
        aria-label="Travel date"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // Open the picker on any click, not only on the (hidden) calendar glyph.
        onClick={(e) => e.currentTarget.showPicker?.()}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear travel date"
          className="absolute right-2 top-1/2 z-raised grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </FieldTile>
  );
}

function CountField({
  mode,
  value,
  onChange,
}: {
  mode: Mode;
  value: number;
  onChange: (n: number) => void;
}) {
  const label = mode === "requester" ? "Parents flying" : "I can accompany";
  const unit = value === 1 ? "person" : "people";
  const btn =
    "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-000 text-primary-800 ring-1 ring-primary-100 transition-colors hover:ring-primary-300 disabled:cursor-not-allowed disabled:text-neutral-400 disabled:hover:ring-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700";

  return (
    <div className="flex min-h-[72px] items-center justify-between gap-3 rounded-md bg-primary-050 px-4 py-3">
      <div className="min-w-0">
        <span className="block t-overline text-text-secondary">{label}</span>
        <span className="mt-0.5 block t-label-1 text-primary-800" aria-live="polite">
          {value} {unit}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={btn}
          onClick={() => onChange(value - 1)}
          disabled={value <= 1}
          aria-label={`${label}: fewer`}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => onChange(value + 1)}
          disabled={value >= 4}
          aria-label={`${label}: more`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/**
 * The Parents Travel Assist match finder. Deliberately not the homepage flight
 * widget: there is no cabin, no return leg and no fare — what matters here is
 * which way the help runs (the two modes), the route, roughly when, and how
 * many parents are flying. Submitting filters the board below rather than
 * leaving the page.
 */
export default function MatchFinder({
  mode,
  onModeChange,
  query,
  onQueryChange,
  onSubmit,
  onCorridor,
}: {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  query: Query;
  onQueryChange: (query: Query) => void;
  onSubmit: () => void;
  onCorridor: (from: string, to: string) => void;
}) {
  const set = (patch: Partial<Query>) => onQueryChange({ ...query, ...patch });

  return (
    <div className="overflow-hidden rounded-lg bg-neutral-000 shadow-e3 ring-1 ring-primary-900/5">
      {/* Which way the help runs */}
      <div
        role="radiogroup"
        aria-label="What are you looking for?"
        className="grid grid-cols-2 border-b border-primary-100"
      >
        {MODES.map(({ key, label, short, icon: Icon }) => {
          const active = mode === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onModeChange(key)}
              className={cn(
                "relative flex items-center justify-center gap-2 px-3 py-4 t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-700 sm:py-5",
                active
                  ? "bg-neutral-000 text-primary-800"
                  : "bg-primary-050/60 text-text-secondary hover:bg-primary-050 hover:text-primary-800"
              )}
            >
              <Icon
                className={cn("h-5 w-5 shrink-0", active ? "text-accent-500" : "text-primary-300")}
                aria-hidden="true"
              />
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
              {active && (
                <span className="absolute inset-x-6 bottom-0 h-[3px] rounded-t-full bg-accent-500" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <form
        className="p-4 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          {/* From + To share a wrapper so the swap button can sit on their seam. */}
          <div className="relative grid gap-3 sm:grid-cols-2 lg:col-span-2">
            <AirportField
              label="Flying from"
              icon={PlaneTakeoff}
              value={query.from}
              onChange={(from) => set({ from })}
              anyLabel="Any airport in India"
              first="india"
            />
            <AirportField
              label="Flying to"
              icon={PlaneLanding}
              value={query.to}
              onChange={(to) => set({ to })}
              anyLabel="Any UK airport"
              first="uk"
            />
            <button
              type="button"
              onClick={() => set({ from: query.to, to: query.from })}
              aria-label="Swap departure and arrival airports"
              className="absolute right-12 top-1/2 z-raised grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-neutral-000 text-accent-600 shadow-e2 ring-1 ring-primary-100 transition-transform hover:rotate-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
            >
              <ArrowLeftRight className="h-4 w-4 rotate-90 sm:rotate-0" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2">
            <DateField value={query.date} onChange={(date) => set({ date })} />
            <CountField mode={mode} value={query.count} onChange={(count) => set({ count })} />
          </div>

          <button
            type="submit"
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-md bg-accent-500 px-7 t-button text-text-on-dark shadow-e2 shadow-accent-500/25 transition-colors hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 lg:min-h-[72px]"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            {mode === "requester" ? "Find companions" : "Find families"}
          </button>
        </div>

        {/* One-tap corridors */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 t-label-3 text-text-secondary">Popular routes</span>
          {POPULAR_CORRIDORS.map(({ from, to }) => {
            const active = query.from === from && query.to === to;
            return (
              <button
                key={`${from}-${to}`}
                type="button"
                onClick={() => onCorridor(from, to)}
                aria-pressed={active}
                aria-label={`${cityOf(from)} to ${cityOf(to)}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 t-code ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
                  active
                    ? "bg-primary-800 text-text-on-dark ring-primary-800"
                    : "bg-neutral-000 text-primary-800 ring-primary-100 hover:bg-primary-050 hover:ring-primary-200"
                )}
              >
                {from}
                <PlaneTakeoff
                  className={cn("h-3.5 w-3.5", active ? "text-accent-400" : "text-accent-500")}
                  aria-hidden="true"
                />
                {to}
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
}
