"use client";

import { useState } from "react";
import { ChevronDown, HandHeart, Info, Plus, Users, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { placeLabel, possibleMatches, type Listing } from "@/lib/travelAssist";
import ListingCard from "@/components/travel-assist/ListingCard";
import { offsetOf, shortDate } from "@/components/travel-assist/dates";
import type { Mode, Query } from "@/components/travel-assist/MatchFinder";

type Kind = Listing["kind"];

const PREVIEW = 4;

const COLUMNS: Record<
  Kind,
  { title: string; tab: string; caption: string; icon: typeof Users; tone: string; empty: string }
> = {
  request: {
    title: "Families looking for a companion",
    tab: "Families",
    caption: "Parents flying soon who’d rather not travel alone.",
    icon: Users,
    tone: "bg-accent-100 text-accent-700",
    empty: "No family has asked for this route yet.",
  },
  offer: {
    title: "Travellers happy to help",
    tab: "Helpers",
    caption: "Already booked, and glad to keep someone company.",
    icon: HandHeart,
    tone: "bg-primary-050 text-primary-700",
    empty: "No traveller has offered this route yet.",
  },
};

/** The column a visitor in each mode is actually shopping in. */
const FOR_MODE: Record<Mode, Kind> = { requester: "offer", traveller: "request" };

function Column({
  kind,
  items,
  pool,
  today,
  highlighted,
  expanded,
  onToggle,
  onAct,
  onPost,
  className,
}: {
  kind: Kind;
  items: Listing[];
  pool: Listing[];
  today: number | null;
  highlighted: boolean;
  expanded: boolean;
  onToggle: () => void;
  onAct: (listing: Listing) => void;
  onPost: (kind: Kind) => void;
  className?: string;
}) {
  const meta = COLUMNS[kind];
  const Icon = meta.icon;
  const shown = expanded ? items : items.slice(0, PREVIEW);
  const headingId = `board-${kind}-heading`;

  return (
    <section aria-labelledby={headingId} className={cn("flex flex-col", className)}>
      <header className="mb-4 flex items-start gap-3">
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-md", meta.tone)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={headingId} className="flex flex-wrap items-center gap-2 t-h5 text-primary-800">
            {meta.title}
            <span className="rounded-full bg-primary-800 px-2 py-0.5 t-label-3 text-text-on-dark">
              {items.length}
            </span>
            {highlighted && (
              <span className="rounded-full bg-accent-500 px-2 py-0.5 t-label-3 text-text-on-dark">
                For you
              </span>
            )}
          </h3>
          <p className="mt-0.5 t-body-sm text-text-on-sand">{meta.caption}</p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed border-sand-600 bg-neutral-000/60 px-6 py-10 text-center">
          <Icon className="h-8 w-8 text-primary-300" aria-hidden="true" />
          <p className="mt-3 t-label-1 text-primary-800">{meta.empty}</p>
          <p className="mt-1 max-w-xs t-body-sm text-text-secondary">
            {kind === "offer"
              ? "Post your parents’ trip and our team will look for a verified traveller on that flight."
              : "Post your flight and we’ll tell you when a family on it needs a hand."}
          </p>
          <button
            type="button"
            onClick={() => onPost(kind)}
            className="btn btn-primary btn-sm mt-5 rounded-full"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {kind === "offer" ? "Post my parents’ trip" : "Offer to help on my flight"}
          </button>
        </div>
      ) : (
        <>
          <ul className="grid gap-4">
            {shown.map((listing) => (
              <li key={listing.id}>
                <ListingCard
                  listing={listing}
                  today={today}
                  matchCount={possibleMatches(listing, pool).length}
                  onAct={onAct}
                />
              </li>
            ))}
          </ul>
          {items.length > PREVIEW && (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              className="mt-4 inline-flex items-center justify-center gap-2 self-center rounded-full bg-neutral-000 px-5 py-2.5 t-label-2 text-primary-800 ring-1 ring-sand-600 transition-colors hover:bg-primary-050 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
            >
              {expanded ? "Show fewer" : `Show all ${items.length}`}
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
                aria-hidden="true"
              />
            </button>
          )}
        </>
      )}
    </section>
  );
}

/**
 * The two-sided board: families on one side, travellers on the other, each
 * card showing how many listings on the opposite side it could be paired with.
 * Side by side from lg; below that, two tabs, opening on the side the visitor
 * is shopping in (a family wants to see helpers first, and vice versa).
 */
export default function AssistBoard({
  mode,
  requests,
  offers,
  pool,
  applied,
  today,
  onClear,
  onAct,
  onPost,
}: {
  mode: Mode;
  requests: Listing[];
  offers: Listing[];
  /** Every listing, unfiltered — matches are counted against all of them. */
  pool: Listing[];
  /** The search the board is filtered by, or null when showing everything. */
  applied: Query | null;
  today: number | null;
  onClear: () => void;
  onAct: (listing: Listing) => void;
  onPost: (kind: Kind) => void;
}) {
  const [tabOverride, setTabOverride] = useState<{ mode: Mode; tab: Kind } | null>(null);
  const [expanded, setExpanded] = useState<Record<Kind, boolean>>({ request: false, offer: false });
  const activeTab = tabOverride?.mode === mode ? tabOverride.tab : FOR_MODE[mode];

  const summary: string[] = [];
  if (applied) {
    if (applied.from || applied.to) {
      summary.push(
        `${applied.from ? placeLabel(applied.from) : "Anywhere"} → ${applied.to ? placeLabel(applied.to) : "anywhere"}`
      );
    }
    if (applied.date && today !== null) {
      summary.push(`around ${shortDate(today, offsetOf(today, applied.date))}`);
    }
    if (applied.count > 1) summary.push(`${applied.count} flying`);
  }

  const columns: [Kind, Listing[]][] = [
    ["request", requests],
    ["offer", offers],
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="t-overline text-primary-500">The board</p>
          <h2 id="assist-board-heading" className="mt-2 t-h2 text-primary-800">
            Who&rsquo;s flying soon
          </h2>
        </div>
        {summary.length > 0 && (
          <div
            className="inline-flex max-w-full items-center gap-2 self-start rounded-full bg-primary-800 py-1.5 pl-4 pr-1.5 t-label-2 text-text-on-dark md:self-auto"
            role="status"
          >
            <span className="truncate">{summary.join(" · ")}</span>
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search and show every listing"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-neutral-000/15 transition-colors hover:bg-neutral-000/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Honesty note: these listings are illustrative until the live feed is
          connected (see lib/travelAssist.ts). Remove once it is. */}
      <p className="mt-4 inline-flex items-start gap-2 rounded-md bg-neutral-000/70 px-3 py-2 t-caption text-text-secondary ring-1 ring-sand-600">
        <Info className="mt-px h-3.5 w-3.5 shrink-0 text-primary-500" aria-hidden="true" />
        Sample listings — examples of how the board works while it opens to the public.
      </p>

      {/* Tabs below lg */}
      <div role="tablist" aria-label="Board side" className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-neutral-000 p-1 ring-1 ring-sand-600 lg:hidden">
        {columns.map(([kind, items]) => {
          const active = activeTab === kind;
          return (
            <button
              key={kind}
              type="button"
              role="tab"
              id={`board-tab-${kind}`}
              aria-selected={active}
              aria-controls={`board-panel-${kind}`}
              onClick={() => setTabOverride({ mode, tab: kind })}
              className={cn(
                "rounded-full px-3 py-2.5 t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
                active ? "bg-primary-800 text-text-on-dark" : "text-primary-800 hover:bg-primary-050"
              )}
            >
              {COLUMNS[kind].tab} ({items.length})
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-2 lg:gap-8">
        {columns.map(([kind, items]) => (
          <div
            key={kind}
            id={`board-panel-${kind}`}
            role="tabpanel"
            aria-labelledby={`board-tab-${kind}`}
            className={cn(activeTab === kind ? "block" : "hidden", "lg:block")}
          >
            <Column
              kind={kind}
              items={items}
              pool={pool}
              today={today}
              highlighted={FOR_MODE[mode] === kind}
              expanded={expanded[kind]}
              onToggle={() => setExpanded((e) => ({ ...e, [kind]: !e[kind] }))}
              onAct={onAct}
              onPost={onPost}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
