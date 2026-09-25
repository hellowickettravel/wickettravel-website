"use client";

import { ArrowRight, BadgeCheck, Languages, Plane, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { cityOf, type Listing } from "@/lib/travelAssist";
import { dateParts } from "@/components/travel-assist/dates";

function initials(name: string): string {
  return name
    .replace(/&.*/, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * One listing, drawn as a boarding-pass stub: who and when on top, the route
 * as a flight line across the middle, and a perforated tear-off at the foot
 * that carries the match status and the one action. Families and travellers
 * share the shell; the avatar tint and the button are what tell them apart.
 */
export default function ListingCard({
  listing,
  today,
  matchCount,
  onAct,
}: {
  listing: Listing;
  /** Midnight today, or null before the client clock is read. */
  today: number | null;
  /** Listings on the other side this one could be paired with. */
  matchCount: number;
  onAct: (listing: Listing) => void;
}) {
  const isRequest = listing.kind === "request";
  const first = listing.name.split(/[\s&]/)[0];
  const date = today === null ? null : dateParts(today, listing.dayOffset);
  const chips = isRequest ? listing.needs : [];
  const subtitle = isRequest
    ? `${listing.forWhom} · ${listing.travellers} flying`
    : `${listing.about} · helps ${listing.capacity}`;

  return (
    <article className="group relative flex h-full flex-col rounded-md border border-neutral-300 bg-neutral-000 transition-colors hover:border-primary-200">
      {/* Who + when */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <span
          aria-hidden="true"
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full t-label-2",
            isRequest ? "bg-accent-100 text-primary-800" : "bg-primary-050 text-primary-700"
          )}
        >
          {initials(listing.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="t-label-1 text-primary-800">{listing.name}</span>
            <span className="inline-flex items-center gap-1 t-label-3 text-success">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              ID checked
            </span>
          </h3>
          <p className="t-caption text-text-secondary">{subtitle}</p>
        </div>
        <div className="shrink-0 text-center">
          {date ? (
            <>
              <span className="sr-only">Flying {date.weekday} {date.day} {date.month}</span>
              <span aria-hidden="true" className="block font-mono text-[24px] font-medium leading-none text-primary-800">{date.day}</span>
              <span aria-hidden="true" className="mt-1 block t-overline text-text-secondary">{date.month}</span>
            </>
          ) : (
            <span className="block h-9 w-8 animate-pulse rounded-xs bg-primary-050" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Route as a flight line */}
      <div className="flex items-center gap-3 px-4">
        <span className="sr-only">
          {cityOf(listing.from)} to {cityOf(listing.to)} with {listing.airline}
        </span>
        <div className="min-w-0" aria-hidden="true">
          <span className="block font-mono text-[20px] font-medium leading-[24px] text-primary-800">{listing.from}</span>
          <span className="block truncate t-caption text-text-secondary">{cityOf(listing.from)}</span>
        </div>
        <div className="relative flex flex-1 items-center" aria-hidden="true">
          <span className="h-px flex-1 border-t border-dashed border-primary-200" />
          <Plane className="mx-1.5 h-4 w-4 shrink-0 text-accent-500 rtl:-scale-x-100" />
          <span className="h-px flex-1 border-t border-dashed border-primary-200" />
          <span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap t-caption text-text-secondary">
            {listing.airline}
          </span>
        </div>
        <div className="min-w-0 text-end" aria-hidden="true">
          <span className="block font-mono text-[20px] font-medium leading-[24px] text-primary-800">{listing.to}</span>
          <span className="block truncate t-caption text-text-secondary">{cityOf(listing.to)}</span>
        </div>
      </div>

      <p className="mt-4 px-4 t-body-sm text-neutral-700">&ldquo;{listing.line}&rdquo;</p>

      <ul className="mt-3 flex flex-wrap gap-1.5 px-4">
        {chips.map((chip) => (
          <li key={chip} className="pill bg-accent-050 text-primary-800 ring-1 ring-accent-200">
            {chip}
          </li>
        ))}
        <li className="pill bg-primary-050 text-primary-700">
          <Languages className="h-3 w-3" aria-hidden="true" />
          {listing.languages.join(" · ")}
        </li>
      </ul>

      {/* Perforated tear-off */}
      <div className="relative mt-auto pt-4">
        <div className="relative mx-4 border-t border-dashed border-neutral-300" aria-hidden="true">
          <span className="absolute -left-[25px] -top-2 h-4 w-4 rounded-full border border-neutral-300 bg-sand-500 [clip-path:inset(0_0_0_50%)] group-hover:border-primary-200" />
          <span className="absolute -right-[25px] -top-2 h-4 w-4 rounded-full border border-neutral-300 bg-sand-500 [clip-path:inset(0_50%_0_0)] group-hover:border-primary-200" />
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <span
            className={cn(
              "inline-flex min-w-0 items-center gap-1.5 t-label-3",
              matchCount > 0 ? "text-success" : "text-text-secondary"
            )}
          >
            {matchCount > 0 ? (
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">
              {matchCount > 0
                ? `${matchCount} possible ${matchCount === 1 ? "match" : "matches"}`
                : "Looking for a match"}
            </span>
          </span>
          <button
            type="button"
            onClick={() => onAct(listing)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 t-button-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2",
              isRequest
                ? "bg-primary-800 text-text-on-dark hover:bg-primary-700"
                : "bg-accent-500 text-text-on-dark hover:bg-accent-600"
            )}
          >
            {isRequest ? `I can help ${first}` : `Match with ${first}`}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
