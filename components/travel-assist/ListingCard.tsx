"use client";

import Image from "next/image";
import { ArrowRight, BadgeCheck, Plane, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { cityOf, helpLabel, type Listing } from "@/lib/travelAssist";
import { shortDate } from "@/components/travel-assist/dates";

/**
 * One person on the board, led by their photo: who they are and when they fly
 * on top, the route as a small flight line, one line in their own words, and
 * the action. Families show the parent(s) who are flying; travellers show
 * themselves.
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
  const tags = isRequest ? listing.needs : listing.helpsWith;
  const subtitle = isRequest
    ? listing.who
    : `${listing.about} · can accompany ${listing.capacity}`;

  return (
    <article className="flex h-full gap-4 rounded-lg border border-neutral-300 bg-neutral-000 p-3 transition-shadow hover:shadow-e2 sm:gap-5 sm:p-4">
      <div className="relative w-24 shrink-0 self-stretch overflow-hidden rounded-md bg-primary-050 sm:w-32">
        <Image
          src={listing.photo}
          alt={isRequest ? `${listing.who}, travelling` : listing.name}
          fill
          sizes="(min-width: 640px) 128px, 96px"
          className="object-cover"
        />
        <span className="absolute inset-x-1.5 bottom-1.5 inline-flex items-center justify-center gap-1 rounded-full bg-neutral-000/95 px-1.5 py-0.5 t-label-3 text-success shadow-e1">
          <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Verified
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate t-label-1 text-primary-800">{listing.name}</h3>
            <p className="truncate t-caption text-text-secondary">{subtitle}</p>
          </div>
          <span className="shrink-0 rounded-full bg-primary-050 px-2.5 py-1 t-label-3 text-primary-800">
            {today === null ? " " : shortDate(today, listing.dayOffset)}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="sr-only">
            {cityOf(listing.from)} to {cityOf(listing.to)} with {listing.airline}
          </span>
          <span aria-hidden="true" className="font-mono text-[16px] font-medium text-primary-800">{listing.from}</span>
          <span aria-hidden="true" className="flex flex-1 items-center">
            <span className="h-px flex-1 border-t border-dashed border-primary-200" />
            <Plane className="mx-1 h-3.5 w-3.5 shrink-0 text-accent-500 rtl:-scale-x-100" />
            <span className="h-px flex-1 border-t border-dashed border-primary-200" />
          </span>
          <span aria-hidden="true" className="font-mono text-[16px] font-medium text-primary-800">{listing.to}</span>
          <span aria-hidden="true" className="ml-1 hidden truncate t-caption text-text-secondary md:inline">
            · {listing.airline}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 t-body-sm text-neutral-700">{listing.line}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 2).map((tag, i) => (
            <li
              key={tag}
              className={cn(
                "rounded-full bg-accent-050 px-2.5 py-0.5 t-label-3 text-primary-800 ring-1 ring-accent-200",
                // Phones get one tag, so a card stays a card and not a list.
                i > 0 && "hidden sm:block"
              )}
            >
              {helpLabel(tag)}
            </li>
          ))}
          <li className="rounded-full bg-primary-050 px-2.5 py-0.5 t-label-3 text-primary-700">
            {listing.languages.slice(0, 2).join(" · ")}
          </li>
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 t-label-3",
              matchCount > 0 ? "text-success" : "text-text-secondary"
            )}
          >
            {matchCount > 0 && <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
            {matchCount > 0 ? `${matchCount} on the same route` : "Looking for a match"}
          </span>
          <button
            type="button"
            onClick={() => onAct(listing)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 t-button-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2",
              isRequest
                ? "bg-primary-800 text-text-on-dark hover:bg-primary-700"
                : "bg-accent-500 text-text-on-dark hover:bg-accent-600"
            )}
          >
            {isRequest ? `Help ${first}’s family` : `Match with ${first}`}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
