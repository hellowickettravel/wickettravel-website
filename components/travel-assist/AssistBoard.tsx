"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { possibleMatches, type Listing } from "@/lib/travelAssist";
import ListingCard from "@/components/travel-assist/ListingCard";
import type { Mode } from "@/components/travel-assist/MatchFinder";

type Kind = Listing["kind"];

const PREVIEW = 3;

const COLUMNS: Record<Kind, { title: string; tab: string; caption: string; empty: string; dot: string }> = {
  request: {
    title: "Parents who need a companion",
    tab: "Parents",
    caption: "Flying soon and would rather not travel alone.",
    empty: "No parents listed for these filters yet.",
    dot: "bg-accent-500",
  },
  offer: {
    title: "Travellers who can help",
    tab: "Helpers",
    caption: "Already booked, and glad to keep someone company.",
    empty: "No travellers listed for these filters yet.",
    dot: "bg-primary-700",
  },
};

/** The column a visitor in each mode is actually shopping in. */
const FOR_MODE: Record<Mode, Kind> = { requester: "offer", traveller: "request" };

/** Three overlapping faces from the column — a quick "real people" cue. */
function FaceStack({ items }: { items: Listing[] }) {
  return (
    <span className="flex -space-x-3" aria-hidden="true">
      {items.slice(0, 3).map((l) => (
        <span key={l.id} className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-sand-500">
          <Image src={l.photo} alt="" fill sizes="40px" className="object-cover" />
        </span>
      ))}
    </span>
  );
}

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
}) {
  const meta = COLUMNS[kind];
  const shown = expanded ? items : items.slice(0, PREVIEW);
  const headingId = `board-${kind}-heading`;

  return (
    <section aria-labelledby={headingId} className="flex h-full flex-col">
      <header className="mb-5 flex min-w-0 items-center gap-4">
        {items.length > 0 && <FaceStack items={items} />}
        <div className="min-w-0">
          <h3 id={headingId} className="flex flex-wrap items-center gap-2 t-h4 text-primary-800">
            <span className={cn("h-2.5 w-2.5 rounded-full", meta.dot)} aria-hidden="true" />
            {meta.title}
            <span className="t-label-2 text-text-secondary">({items.length})</span>
            {highlighted && (
              <span className="rounded-full bg-accent-500 px-2 py-0.5 t-label-3 text-text-on-dark">For you</span>
            )}
          </h3>
          <p className="mt-0.5 t-body-sm text-text-on-sand">{meta.caption}</p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-sand-600 bg-neutral-000/60 px-6 py-12 text-center">
          <p className="t-label-1 text-primary-800">{meta.empty}</p>
          <p className="mt-1 max-w-xs t-body-sm text-text-secondary">
            {kind === "offer"
              ? "Post your parents’ trip — our team will look for a verified traveller on that flight."
              : "Post your flight — we’ll let you know when a family on it needs a hand."}
          </p>
          <button type="button" onClick={() => onPost(kind)} className="btn btn-primary btn-sm mt-5 rounded-full">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {kind === "offer" ? "Post my parents’ trip" : "Offer to help on my flight"}
          </button>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-4">
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
              className="mt-5 inline-flex items-center justify-center gap-2 self-center rounded-full bg-neutral-000 px-5 py-2.5 t-label-2 text-primary-800 ring-1 ring-sand-600 transition-colors hover:bg-primary-050 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
            >
              {expanded ? "Show fewer" : `Show all ${items.length}`}
              <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
            </button>
          )}
        </>
      )}
    </section>
  );
}

/**
 * The two-sided board: parents on one side, travellers on the other, side by
 * side from lg; below that, two tabs, opening on the side the visitor is
 * shopping in (a family wants helpers first, and vice versa).
 */
export default function AssistBoard({
  mode,
  requests,
  offers,
  pool,
  today,
  onAct,
  onPost,
}: {
  mode: Mode;
  requests: Listing[];
  offers: Listing[];
  /** Every listing, unfiltered — matches are counted against all of them. */
  pool: Listing[];
  today: number | null;
  onAct: (listing: Listing) => void;
  onPost: (kind: Kind) => void;
}) {
  const [tabOverride, setTabOverride] = useState<{ mode: Mode; tab: Kind } | null>(null);
  const [expanded, setExpanded] = useState<Record<Kind, boolean>>({ request: false, offer: false });
  const activeTab = tabOverride?.mode === mode ? tabOverride.tab : FOR_MODE[mode];

  const columns: [Kind, Listing[]][] = [
    ["request", requests],
    ["offer", offers],
  ];

  return (
    <div>
      {/* Tabs below lg */}
      <div role="tablist" aria-label="Board side" className="grid grid-cols-2 gap-1 rounded-full bg-neutral-000 p-1 ring-1 ring-sand-600 lg:hidden">
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
                "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
                active ? "bg-primary-800 text-text-on-dark" : "text-primary-800 hover:bg-primary-050"
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", COLUMNS[kind].dot)} aria-hidden="true" />
              {COLUMNS[kind].tab} ({items.length})
            </button>
          );
        })}
      </div>

      {/* grid-cols-1 (minmax(0,1fr)) not a bare `grid`: an implicit track sizes
          to its content's min-content width, and the cards' single-line
          truncated text would push it wider than a phone screen. */}
      <div className="mt-6 grid grid-cols-1 gap-10 lg:mt-0 lg:grid-cols-2 lg:gap-10">
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
            />
          </div>
        ))}
      </div>
    </div>
  );
}
