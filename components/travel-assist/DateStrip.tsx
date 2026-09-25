"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { STRIP_DAYS } from "@/lib/travelAssist";
import { dateParts } from "@/components/travel-assist/dates";

export type DayCount = { families: number; helpers: number };

/**
 * "Who's flying when" — the next three weeks as a row of day tiles, each one
 * showing how many families need a companion and how many travellers can
 * help that day (under whatever route / language / help filters are set).
 * Tapping a day filters the board to it; "All dates" clears it.
 */
export default function DateStrip({
  today,
  counts,
  selected,
  onSelect,
}: {
  today: number | null;
  /** Index = days from today. */
  counts: DayCount[];
  /** Selected day offset, or null for all dates. */
  selected: number | null;
  onSelect: (dayOffset: number | null) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const nudge = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: "smooth" });

  const tile =
    "flex w-[84px] shrink-0 snap-start flex-col items-center rounded-md border px-2 pb-2.5 pt-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2";

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4">
        <ul className="flex items-center gap-4 t-caption text-text-secondary" aria-label="Legend">
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-500" aria-hidden="true" />
            Families needing help
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary-700" aria-hidden="true" />
            Travellers who can help
          </li>
        </ul>
        <div className="hidden gap-2 md:flex">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => nudge(dir)}
              aria-label={dir < 0 ? "Earlier dates" : "Later dates"}
              className="grid h-9 w-9 place-items-center rounded-full bg-neutral-000 text-primary-800 ring-1 ring-sand-600 transition-colors hover:bg-primary-050 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
            >
              {dir < 0 ? <ChevronLeft className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scroller}
        role="group"
        aria-label="Choose a travel day"
        className="-mx-4 mt-4 flex snap-x gap-2 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:px-0 [scrollbar-width:thin]"
      >
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-pressed={selected === null}
          className={cn(
            tile,
            "justify-center",
            selected === null
              ? "border-primary-800 bg-primary-800 text-text-on-dark"
              : "border-sand-600 bg-neutral-000 text-primary-800 hover:border-primary-200"
          )}
        >
          <span className="t-label-2">All</span>
          <span className="t-caption opacity-80">dates</span>
        </button>

        {today === null
          ? Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className={cn(tile, "h-[92px] animate-pulse border-sand-600 bg-neutral-000/60")} aria-hidden="true" />
            ))
          : Array.from({ length: STRIP_DAYS }).map((_, day) => {
              const { weekday, day: num, month } = dateParts(today, day);
              const c = counts[day] ?? { families: 0, helpers: 0 };
              const empty = c.families + c.helpers === 0;
              const active = selected === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => onSelect(day)}
                  aria-pressed={active}
                  aria-label={`${weekday} ${num} ${month}: ${c.families} ${c.families === 1 ? "family" : "families"}, ${c.helpers} ${c.helpers === 1 ? "helper" : "helpers"}`}
                  className={cn(
                    tile,
                    active
                      ? "border-primary-800 bg-primary-800 text-text-on-dark"
                      : "border-sand-600 bg-neutral-000 text-primary-800 hover:border-primary-200",
                    empty && !active && "opacity-60"
                  )}
                >
                  <span className={cn("t-overline", active ? "text-primary-100" : "text-text-secondary")}>
                    {day === 0 ? "Today" : weekday}
                  </span>
                  <span className="mt-0.5 font-mono text-[22px] font-medium leading-[26px]">{num}</span>
                  <span className={cn("t-caption", active ? "text-primary-100" : "text-text-secondary")}>{month}</span>
                  <span className="mt-1.5 flex items-center gap-2 t-label-3" aria-hidden="true">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-accent-500" />
                      {c.families}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className={cn("h-2 w-2 rounded-full", active ? "bg-primary-200" : "bg-primary-700")} />
                      {c.helpers}
                    </span>
                  </span>
                </button>
              );
            })}
      </div>
    </div>
  );
}
