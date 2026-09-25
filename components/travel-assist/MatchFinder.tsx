"use client";

import { type ReactNode } from "react";
import { ArrowLeftRight, ChevronDown, HandHeart, HeartHandshake, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  HELP_TYPES,
  INDIA_AIRPORTS,
  LANGUAGES,
  UK_AIRPORTS,
  cityOf,
  type AirportOption,
  type HelpKey,
} from "@/lib/travelAssist";
import { isoDate, offsetOf, shortDate, useToday } from "@/components/travel-assist/dates";

export type Mode = "requester" | "traveller";
export type Flex = 0 | 3 | 7;
export type Query = {
  from: string;
  to: string;
  date: string;
  flex: Flex;
  language: string;
  help: HelpKey | "";
};

export const EMPTY_QUERY: Query = { from: "", to: "", date: "", flex: 3, language: "", help: "" };

export const MODES: { key: Mode; label: string; short: string; icon: typeof HandHeart }[] = [
  { key: "requester", label: "My parents need a companion", short: "Need a companion", icon: HeartHandshake },
  { key: "traveller", label: "I’m flying and can help", short: "I can help", icon: HandHeart },
];

/* ── One field of the bar ──────────────────────────────────────────────
   A small bold label over the current value, with the real control — a
   native <select> or date input — stretched invisibly over the whole cell,
   so phones get their own picker and the bar keeps one compact look. */
function Cell({
  label,
  value,
  placeholder,
  children,
  className,
  chevron = true,
}: {
  label: string;
  value: string;
  placeholder: string;
  children: ReactNode;
  className?: string;
  chevron?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative min-w-0 rounded-md bg-primary-050/60 px-4 py-2.5 transition-colors hover:bg-primary-050 focus-within:bg-primary-050 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-700 lg:bg-transparent",
        className
      )}
    >
      <span className="block t-label-3 text-primary-800">{label}</span>
      <span
        className={cn(
          "mt-0.5 block truncate pr-5 t-body-sm",
          value ? "text-primary-800" : "text-text-secondary"
        )}
      >
        {value || placeholder}
      </span>
      {chevron && (
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}

const overlay = "absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0";

function AirportOptions({ first }: { first: "india" | "uk" }) {
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
    <>
      {groups.map(([name, list]) => (
        <optgroup key={name} label={name}>
          {list.map((a) => (
            <option key={a.code} value={a.code}>
              {a.city} — {a.name} ({a.code})
            </option>
          ))}
        </optgroup>
      ))}
    </>
  );
}

/**
 * The Parents Travel Assist search bar — built around *when*: route, date and
 * how flexible, plus the two things that make a good pairing (a shared
 * language, the kind of help). One slim row on desktop, a tidy two-column
 * grid on phones. Searching filters the board and the date strip below.
 */
export default function MatchFinder({
  mode,
  onModeChange,
  query,
  onQueryChange,
  onSubmit,
}: {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  query: Query;
  onQueryChange: (query: Query) => void;
  onSubmit: () => void;
}) {
  const today = useToday();
  const set = (patch: Partial<Query>) => onQueryChange({ ...query, ...patch });
  const dateText =
    query.date && today !== null ? shortDate(today, offsetOf(today, query.date)) : "";
  const helpText = HELP_TYPES.find((h) => h.key === query.help)?.label ?? "";
  const helpLabel = mode === "requester" ? "Help needed" : "I can help with";

  // Hairline between cells on the desktop row only.
  const divider = "lg:border-l lg:border-neutral-200";

  return (
    <div>
      {/* Which way the help runs — tabs sitting on the hero. */}
      <div role="radiogroup" aria-label="What are you looking for?" className="flex gap-2">
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
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 sm:px-5",
                active
                  ? "bg-neutral-000 text-primary-800 shadow-e2"
                  : "bg-primary-900/40 text-text-on-dark ring-1 ring-neutral-000/30 hover:bg-primary-900/60"
              )}
            >
              <Icon
                className={cn("h-4 w-4 shrink-0", active ? "text-accent-500" : "text-accent-400")}
                aria-hidden="true"
              />
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mt-3 rounded-lg bg-neutral-000 p-2 shadow-e3 ring-1 ring-primary-900/5"
      >
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-[1.2fr_1.2fr_1fr_0.85fr_1fr_1.15fr_auto] lg:items-center lg:gap-0">
          <Cell
            label="From"
            value={query.from ? `${cityOf(query.from)} (${query.from})` : ""}
            placeholder="Any Indian airport"
          >
            <select aria-label="Flying from" value={query.from} onChange={(e) => set({ from: e.target.value })} className={overlay}>
              <option value="">Any Indian airport</option>
              <AirportOptions first="india" />
            </select>
          </Cell>

          <div className={cn("relative", divider)}>
            <button
              type="button"
              onClick={() => set({ from: query.to, to: query.from })}
              aria-label="Swap departure and arrival airports"
              className="absolute -left-4 top-1/2 z-raised hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-neutral-000 text-primary-500 shadow-e1 ring-1 ring-neutral-200 transition-colors hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 lg:grid"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <Cell
              label="To"
              value={query.to ? `${cityOf(query.to)} (${query.to})` : ""}
              placeholder="Any UK airport"
              className="lg:pl-6"
            >
              <select aria-label="Flying to" value={query.to} onChange={(e) => set({ to: e.target.value })} className={overlay}>
                <option value="">Any UK airport</option>
                <AirportOptions first="uk" />
              </select>
            </Cell>
          </div>

          <div className={divider}>
            <Cell label="Travel date" value={dateText} placeholder="Any date" chevron={!query.date}>
              <input
                type="date"
                aria-label="Travel date"
                min={today === null ? undefined : isoDate(today, 0)}
                value={query.date}
                onChange={(e) => set({ date: e.target.value })}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className={overlay}
              />
              {query.date && (
                <button
                  type="button"
                  onClick={() => set({ date: "" })}
                  aria-label="Clear travel date"
                  className="absolute right-2 top-1/2 z-raised grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-neutral-000 text-primary-500 ring-1 ring-neutral-200 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </Cell>
          </div>

          <div className={divider}>
            <Cell label="Flexibility" value={query.flex === 0 ? "Exact date" : `± ${query.flex} days`} placeholder="">
              <select
                aria-label="Date flexibility"
                value={query.flex}
                onChange={(e) => set({ flex: Number(e.target.value) as Flex })}
                className={overlay}
              >
                <option value={0}>Exact date</option>
                <option value={3}>± 3 days</option>
                <option value={7}>± 7 days</option>
              </select>
            </Cell>
          </div>

          <div className={divider}>
            <Cell label="Language" value={query.language} placeholder="Any language">
              <select aria-label="Language" value={query.language} onChange={(e) => set({ language: e.target.value })} className={overlay}>
                <option value="">Any language</option>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Cell>
          </div>

          <div className={divider}>
            <Cell label={helpLabel} value={helpText} placeholder="Any help">
              <select
                aria-label={helpLabel}
                value={query.help}
                onChange={(e) => set({ help: e.target.value as HelpKey | "" })}
                className={overlay}
              >
                <option value="">Any help</option>
                {HELP_TYPES.map((h) => (
                  <option key={h.key} value={h.key}>
                    {h.label}
                  </option>
                ))}
              </select>
            </Cell>
          </div>

          <button
            type="submit"
            className="col-span-2 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent-500 px-6 t-button text-text-on-dark transition-colors hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 lg:col-span-1 lg:ml-2 lg:h-14"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
