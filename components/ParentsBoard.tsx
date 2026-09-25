"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  HandHeart,
  Inbox,
  Languages,
  Loader2,
  MessageCircle,
  Plane,
  RefreshCw,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { BUSINESS } from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/links";
import { type ParsedEntry } from "@/lib/parents";
import { useParentBoard } from "@/lib/useParentBoard";

/**
 * The full, filterable community board — every open request or offer, in one
 * place. This used to be the main /parents-tickets page's live-listings
 * section; it now lives on the two dedicated list pages
 * (/parents-tickets/requests, /parents-tickets/offers) instead.
 *
 * Reads the real, already-anonymised public feed through the same-origin relay
 * at /api/parent-ticket/public (via lib/useParentBoard, shared with the
 * detail page). The upstream payload never carries contact
 * details, so nothing here can leak one: the card's only call to action is to
 * ask our team for the introduction, quoting the entry's reference.
 */

type Filter = "all" | "requester" | "traveller";

/* ── Card ──────────────────────────────────────────────────────────────── */

function EntryCard({ entry }: { entry: ParsedEntry }) {
  const {
    isTraveller,
    reference,
    name,
    from,
    to,
    date,
    airline,
    languages,
    body,
    relationship,
    mobility,
    parentAge,
    capacity,
    amount,
  } = entry;

  const meta: { icon: typeof CalendarDays; text: string }[] = [];
  if (date) meta.push({ icon: CalendarDays, text: date });
  if (airline) meta.push({ icon: Plane, text: airline });
  if (languages) meta.push({ icon: Languages, text: languages });
  if (capacity !== undefined)
    meta.push({
      icon: Users,
      text: `Can accompany ${capacity} ${capacity === 1 ? "person" : "people"}`,
    });

  const details: string[] = [];
  if (relationship) details.push(relationship);
  if (parentAge !== undefined) details.push(`Age ${parentAge}`);
  if (mobility) details.push(mobility);

  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={cn(
            "pill",
            isTraveller
              ? "bg-primary-050 text-primary-700"
              : "bg-accent-100 text-accent-700"
          )}
        >
          {isTraveller ? (
            <HandHeart className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {isTraveller ? "Offering to help" : "Needs a companion"}
        </span>
        {reference && (
          <span className="t-code text-text-secondary">{reference}</span>
        )}
      </div>

      {name && <p className="t-label-1 mt-4 text-primary-800">{name}</p>}

      {(from || to) && (
        <p className="mt-2 flex flex-wrap items-center gap-2 t-h5 text-primary-800">
          <span>{from ?? "—"}</span>
          <Plane
            className="h-4 w-4 shrink-0 text-accent-500"
            aria-hidden="true"
          />
          <span>{to ?? "—"}</span>
        </p>
      )}

      {meta.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {meta.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="inline-flex items-center gap-1.5 t-body-sm text-text-secondary"
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      )}

      {details.length > 0 && (
        <p className="mt-3 t-body-sm text-text-secondary">
          {details.join(" · ")}
        </p>
      )}

      {body && (
        <p className="t-body-sm mt-4 whitespace-pre-line text-text-secondary">
          {body}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
        {amount !== undefined ? (
          <span className="t-label-2 text-primary-800">
            {isTraveller ? "Asking" : "Offering"}{" "}
            <span className="t-h5 text-primary-800">£{amount}</span>
          </span>
        ) : (
          <span className="t-body-sm text-text-secondary">
            Amount agreed directly
          </span>
        )}
        <a
          href={`tel:${BUSINESS.phone}`}
          className="btn btn-outline btn-sm"
          aria-label={
            reference
              ? `Call Wicket Travel about entry ${reference}`
              : "Call Wicket Travel about this entry"
          }
        >
          Ask for an introduction
        </a>
      </div>
    </article>
  );
}

/* ── Board ─────────────────────────────────────────────────────────────── */

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "requester", label: "Needs a companion" },
  { key: "traveller", label: "Offering to help" },
];

/**
 * `lockFilter` pins the board to one side and hides the filter pills — used
 * by the two dedicated list pages, where the page itself is the filter
 * ("every open request" / "every open offer") so a redundant toggle would
 * just repeat the page's own heading.
 */
export default function ParentsBoard({
  lockFilter,
}: {
  lockFilter?: "requester" | "traveller";
}) {
  const { state, entries, reload } = useParentBoard(50);
  const [filter, setFilter] = useState<Filter>(lockFilter ?? "all");

  const counts = useMemo(
    () => ({
      all: entries.length,
      requester: entries.filter((e) => e.type === "requester").length,
      traveller: entries.filter((e) => e.type === "traveller").length,
    }),
    [entries]
  );

  const activeFilter = lockFilter ?? filter;
  const visible = useMemo(
    () =>
      activeFilter === "all"
        ? entries
        : entries.filter((e) => e.type === activeFilter),
    [entries, activeFilter]
  );

  return (
    <div>
      {/* Filters — rendered once entries exist so the counts are never a lie.
          Hidden entirely when the page itself is already a fixed filter. */}
      {!lockFilter && state.status === "ready" && entries.length > 0 && (
        <div
          role="group"
          aria-label="Filter the community board"
          className="flex flex-wrap justify-center gap-2"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={cn(
                "inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 t-label-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2",
                filter === f.key
                  ? "bg-primary-800 text-text-on-dark"
                  : "border border-neutral-300 bg-neutral-000 text-text-secondary hover:border-primary-200 hover:bg-primary-050 hover:text-primary-800"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "t-label-3",
                  filter === f.key ? "text-primary-200" : "text-text-secondary"
                )}
              >
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-10">
        {/* Loading — plain skeletons, no shimmer: this is a status, not decor. */}
        {state.status === "loading" && (
          <>
            <p className="sr-only" role="status">
              Loading community board entries…
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="card p-6" aria-hidden="true">
                  <div className="h-6 w-40 rounded-full bg-primary-050" />
                  <div className="mt-5 h-5 w-32 rounded-xs bg-primary-050" />
                  <div className="mt-3 h-5 w-48 rounded-xs bg-primary-050" />
                  <div className="mt-6 h-4 w-full rounded-xs bg-primary-050" />
                  <div className="mt-2 h-4 w-4/5 rounded-xs bg-primary-050" />
                </div>
              ))}
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 t-body-sm text-text-secondary">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading live entries…
            </p>
          </>
        )}

        {state.status === "error" && (
          <div className="card mx-auto max-w-xl p-8 text-center" role="alert">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-warning-surface">
              <AlertTriangle className="h-6 w-6 text-warning" aria-hidden="true" />
            </span>
            <h3 className="t-h4 mt-6 text-primary-800">
              {state.kind === "rate_limited"
                ? "Too many requests just now"
                : "We couldn’t load the board"}
            </h3>
            <p className="t-body-sm mx-auto mt-3 max-w-sm text-text-secondary">
              {state.kind === "rate_limited"
                ? "The board has been busy. Give it a minute and try again — or call us and we’ll read out what’s open."
                : "The live listings didn’t load. This doesn’t affect posting — your entry will still reach our team."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reload} className="btn btn-outline">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try again
              </button>
              <a href={`tel:${BUSINESS.phone}`} className="btn btn-secondary">
                Call {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        )}

        {state.status === "ready" && entries.length === 0 && (
          <div className="card mx-auto max-w-xl p-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-050">
              <Inbox className="h-6 w-6 text-primary-700" aria-hidden="true" />
            </span>
            <h3 className="t-h4 mt-6 text-primary-800">
              No open requests right now — be the first to post
            </h3>
            <p className="t-body-sm mx-auto mt-3 max-w-sm text-text-secondary">
              The board only shows entries whose posters ticked the consent box,
              so it can be quiet even when our team is arranging matches behind
              the scenes. Post yours above, or talk to us directly.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/parents-tickets#post-to-the-board" className="btn btn-primary">
                Post to the board
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp us
              </a>
            </div>
          </div>
        )}

        {state.status === "ready" && entries.length > 0 && (
          <>
            {visible.length === 0 ? (
              <p className="t-body mx-auto max-w-md text-center text-text-secondary">
                {lockFilter ? (
                  "Nothing open on this side of the board right now — check back soon, or talk to us directly."
                ) : (
                  <>
                    Nothing under this filter yet. Switch to{" "}
                    <button
                      type="button"
                      onClick={() => setFilter("all")}
                      className="rounded-xs t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
                    >
                      everything
                    </button>{" "}
                    to see the open entries.
                  </>
                )}
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((entry, i) => (
                  <li key={entry.reference ?? `entry-${i}`} className="h-full">
                    <EntryCard entry={entry} />
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <p className="t-body-sm text-text-secondary">
                Showing {visible.length} of {entries.length} open{" "}
                {entries.length === 1 ? "entry" : "entries"}. Contact details are
                never published — our team makes every introduction.
              </p>
              <button
                type="button"
                onClick={reload}
                className="inline-flex items-center gap-2 rounded-xs t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 transition-colors hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Refresh
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
