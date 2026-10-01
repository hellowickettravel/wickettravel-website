"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  HandHeart,
  Languages,
  Loader2,
  MessageCircle,
  Phone,
  Plane,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { BUSINESS, SITE_URL } from "@/lib/seo";
import { PHONE_LINK, WHATSAPP_URL } from "@/lib/links";
import { destinationImage, formatEntryDate, type ParsedEntry } from "@/lib/parents";
import {
  buildHelpHref,
  buildShareMessage,
  buildShareUrl,
  formatShareDate,
  toIsoDay,
  type SharedDetails,
} from "@/lib/parentsShare";
import { useParentBoard } from "@/lib/useParentBoard";
import ShareToWhatsApp from "@/components/ShareToWhatsApp";

/**
 * Per-listing detail content, rendered inside
 * app/parents-tickets/listing/[reference]/page.tsx. Client-side because
 * there is no per-listing API — the only source of truth is the same live,
 * already-anonymised `/api/parent-ticket/public` feed every other board
 * surface reads (components/AssistFamilyApp.tsx) — so this fetches the
 * whole feed via the shared hook and finds the one entry whose reference
 * matches the URL.
 *
 * An entry that has since been matched, expired or withdrawn simply won't be
 * in that feed any more. That is treated as a normal, expected state ("no
 * longer available" — see NotFound below), not an error, since the
 * alternative would be inventing a reason a real integration can't know.
 *
 * A link shared into WhatsApp (lib/parentsShare.ts) also carries the flight
 * itself, because a new post isn't on the board until a coordinator approves
 * it. So the order is: the board's row if the reference is on it, else the
 * shared details, else "no longer available". A reference that isn't found
 * while the feed is failing says so rather than claiming the listing was
 * withdrawn — the two are not interchangeable when someone is checking on
 * their own mother's flight.
 *
 * Every listing ends with a share panel, so anyone who lands here can pass
 * it on to their own groups, and a family's request has a one-tap "I'm on
 * this flight" that opens the form on the helper side, already filled in.
 */
/* The share link is built from the page's own origin so preview deployments
   share themselves; the server render (and hydration) use the live site. */
const noopSubscribe = () => () => {};
function useOrigin(): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => SITE_URL
  );
}

/** Everything the listing view renders, from either source. */
type View = {
  isTraveller: boolean;
  reference: string | undefined;
  details: SharedDetails;
  name?: string;
  dateLabel?: string;
  languages?: string;
  body?: string;
  extra: string[];
  capacity?: number;
  amount?: number;
  /** Came from a shared link and isn't on the public board (yet). */
  pending: boolean;
};

function fromEntry(entry: ParsedEntry, reference: string): View {
  const extra: string[] = [];
  if (entry.relationship) extra.push(entry.relationship);
  if (entry.parentAge !== undefined) extra.push(`Age ${entry.parentAge}`);
  if (entry.mobility) extra.push(entry.mobility);
  return {
    isTraveller: entry.isTraveller,
    reference,
    details: {
      type: entry.isTraveller ? "traveller" : "requester",
      from: entry.from ?? "",
      to: entry.to ?? "",
      date: toIsoDay(entry.dateISO),
      airline: entry.airline,
    },
    name: entry.name,
    dateLabel: entry.date,
    languages: entry.languages,
    body: entry.body,
    extra,
    capacity: entry.capacity,
    amount: entry.amount,
    pending: false,
  };
}

function fromShared(shared: SharedDetails, reference: string | undefined): View {
  return {
    isTraveller: shared.type === "traveller",
    reference,
    details: shared,
    dateLabel: formatShareDate(shared.date) ?? formatEntryDate(shared.date),
    extra: [],
    pending: true,
  };
}

export default function ListingDetail({
  reference,
  shared,
}: {
  /** Undefined when a shared link was made without a portal reference. */
  reference?: string;
  shared?: SharedDetails;
}) {
  const { state, entries } = useParentBoard(50);
  const entry = reference
    ? entries.find((e) => e.reference === reference)
    : undefined;

  // The board's own row wins; a shared link's details stand in until the
  // post is on the board, and are shown straight away rather than behind a
  // spinner, since the board may never have it.
  if (entry) return <ListingView view={fromEntry(entry, reference!)} />;
  if (shared) return <ListingView view={fromShared(shared, reference)} />;

  if (state.status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-16 t-body-sm text-text-secondary">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Loading this listing…
      </div>
    );
  }

  return <NotFound feedError={state.feedError} />;
}

function ListingView({ view }: { view: View }) {
  const origin = useOrigin();
  const { isTraveller, reference, details, name, dateLabel, languages, body, extra, capacity, amount, pending } = view;
  const { from, to, airline } = details;

  const bg = destinationImage(to, from);
  const route = [from, to].filter(Boolean).join(" → ") || "Route on request";

  const meta: { icon: typeof CalendarDays; text: string }[] = [];
  if (dateLabel) meta.push({ icon: CalendarDays, text: dateLabel });
  if (airline) meta.push({ icon: Plane, text: airline });
  if (languages) meta.push({ icon: Languages, text: languages });
  if (capacity !== undefined)
    meta.push({
      icon: Users,
      text: `Can accompany ${capacity} ${capacity === 1 ? "person" : "people"}`,
    });

  const shareUrl = buildShareUrl(origin, reference ?? null, details);
  const shareMessage = buildShareMessage({
    details,
    reference: reference ?? null,
    url: shareUrl,
    voice: "board",
  });

  const whatsappUs = `${WHATSAPP_URL}?text=${encodeURIComponent(
    `Hi Wicket Travel, I'm getting in touch about Parent Travel Assist ${
      reference ? `listing ${reference}` : "a shared request"
    } (${route}${dateLabel ? `, ${dateLabel}` : ""}).`
  )}`;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative h-56 w-full overflow-hidden rounded-lg shadow-e2 ring-1 ring-primary-900/10 sm:h-72">
        <Image
          src={bg}
          alt=""
          fill
          sizes="768px"
          preload
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
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
          <p className="mt-3 t-h3 text-text-on-dark">{route}</p>
        </div>
      </div>

      <div className="card mt-6 p-6 sm:p-8">
        {name && <p className="t-label-1 text-primary-800">{name}</p>}

        {meta.length > 0 && (
          <ul className={cn("flex flex-wrap gap-x-5 gap-y-2", name && "mt-3")}>
            {meta.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="inline-flex items-center gap-1.5 t-body-sm text-text-secondary"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        )}

        {extra.length > 0 && (
          <p className="mt-4 t-body-sm text-text-secondary">
            {extra.join(" · ")}
          </p>
        )}

        {body && (
          <p className="t-body mt-5 whitespace-pre-line text-text-secondary">
            {body}
          </p>
        )}

        {pending && (
          <p className="mt-5 flex items-start gap-3 rounded-md bg-primary-050 px-4 py-3 t-body-sm text-text-secondary">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
            <span>
              {isTraveller
                ? "This traveller has shared their flight with us. Their contact details stay with our team, and we make every introduction ourselves."
                : "This family has sent their full details to our team. If you’re on this flight, tell us you can help and a coordinator will call you both to make the introduction."}
            </span>
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6">
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
          <div className="flex flex-wrap gap-3">
            {isTraveller ? (
              <a
                {...PHONE_LINK}
                className="btn btn-primary"
                aria-label={`Message Wicket Travel on WhatsApp about ${reference ? `entry ${reference}` : "this listing"}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Ask for an introduction
              </a>
            ) : (
              // A full page load, not <Link>: the form reads its prefill
              // from the address bar as it mounts.
              <a href={buildHelpHref(details, reference ?? null)} className="btn btn-primary">
                <HandHeart className="h-4 w-4" aria-hidden="true" />
                I’m on this flight, I can help
              </a>
            )}
            <a
              href={whatsappUs}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp us
            </a>
          </div>
        </div>
        <p className="mt-4 t-body-sm text-text-secondary">
          {reference ? (
            <>
              Reference <span className="t-code">{reference}</span>. Contact
              details are never published — quote this reference and our team
              makes the introduction.
            </>
          ) : (
            "Contact details are never published — our team makes every introduction."
          )}
          {!isTraveller && (
            <>
              {" "}Rather talk?{" "}
              <a
                {...PHONE_LINK}
                className="font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
              >
                WhatsApp {BUSINESS.phoneDisplay}
              </a>
              .
            </>
          )}
        </p>
      </div>

      <ShareToWhatsApp
        key={shareUrl}
        className="mt-6"
        initialMessage={shareMessage}
        url={shareUrl}
        title={
          isTraveller
            ? "Know a family who needs this? Share it"
            : "Know someone on this flight? Share it"
        }
        lead="Help is usually found through someone who knows someone. Send this to your WhatsApp groups. The link opens this page, and our team handles every introduction."
      />

      <div className="mt-6 flex flex-wrap gap-4 t-label-2">
        <Link
          href="/parents-tickets/requests"
          className="text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
        >
          See all requests
        </Link>
        <Link
          href="/parents-tickets/offers"
          className="text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
        >
          See all offers
        </Link>
      </div>
    </div>
  );
}

function NotFound({ feedError }: { feedError?: "rate_limited" | "generic" }) {
  return (
    <div className="card mx-auto max-w-xl p-8 text-center">
      {feedError ? (
        <>
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-warning-surface">
            <AlertTriangle className="h-6 w-6 text-warning" aria-hidden="true" />
          </span>
          <h2 className="t-h4 mt-6 text-primary-800">
            {feedError === "rate_limited"
              ? "Too many requests just now"
              : "We couldn’t reach the board"}
          </h2>
          <p className="t-body-sm mx-auto mt-3 max-w-sm text-text-secondary">
            This listing may well still be open — we just can’t read the board
            to confirm it. Call us quoting the reference and we’ll look it up
            directly.
          </p>
        </>
      ) : (
        <>
          <h2 className="t-h4 text-primary-800">
            This listing is no longer available
          </h2>
          <p className="t-body-sm mx-auto mt-3 max-w-sm text-text-secondary">
            It may have already been matched, expired, or been withdrawn by
            whoever posted it. Have a look at what&rsquo;s open now, or call us
            directly.
          </p>
        </>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/parents-tickets/requests" className="btn btn-outline">
          See requests
        </Link>
        <Link href="/parents-tickets/offers" className="btn btn-outline">
          See offers
        </Link>
        <a {...PHONE_LINK} className="btn btn-secondary">
          WhatsApp {BUSINESS.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
