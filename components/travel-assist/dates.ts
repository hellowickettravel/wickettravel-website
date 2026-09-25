import { useSyncExternalStore } from "react";

const DAY = 86_400_000;

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const noop = () => () => {};

/**
 * Midnight today (local), or `null` during server render and hydration.
 *
 * The page is statically prerendered, so any date computed on the server would
 * be frozen at build time. Reading the clock through useSyncExternalStore
 * keeps the server snapshot `null` (so hydration matches) and hands the client
 * the real day on its first render after that. The snapshot is a primitive
 * that only changes at midnight, so it is stable between renders.
 */
export function useToday(): number | null {
  return useSyncExternalStore(noop, startOfToday, () => null);
}

/** "YYYY-MM-DD" for a day offset from `today` — the shape <input type=date> and the API use. */
export function isoDate(today: number, dayOffset: number): string {
  const d = new Date(today + dayOffset * DAY);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Whole days from `today` to an ISO date (local). */
export function offsetOf(today: number, iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round((new Date(y, m - 1, d).getTime() - today) / DAY);
}

/** { day: "14", month: "Oct", weekday: "Tue" } */
export function dateParts(today: number, dayOffset: number) {
  const d = new Date(today + dayOffset * DAY);
  return {
    day: String(d.getDate()),
    month: d.toLocaleDateString("en-GB", { month: "short" }),
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
  };
}

/** "Tue 14 Oct" */
export function shortDate(today: number, dayOffset: number): string {
  const { weekday, day, month } = dateParts(today, dayOffset);
  return `${weekday} ${day} ${month}`;
}
