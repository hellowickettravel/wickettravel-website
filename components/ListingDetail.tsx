"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  CalendarDays,
  Info,
  HandHeart,
  Languages,
  Loader2,
  MessageCircle,
  Phone,
  Plane,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { BUSINESS } from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/links";
import { destinationImage } from "@/lib/parents";
import { useParentBoard } from "@/lib/useParentBoard";

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
 * When the relay itself is down the hook stands the board's worked examples
 * in for it (see lib/useParentBoard.ts). This page honours that but does not
 * hide it: a sample listing is banner-tagged as an example, and a reference
 * that isn't found while the feed is failing says so rather than claiming the
 * listing was withdrawn — the two are not interchangeable when someone is
 * checking on their own mother's flight.
 */
export default function ListingDetail({ reference }: { reference: string }) {
  const { state, entries } = useParentBoard(50);
  const entry = entries.find((e) => e.reference === reference);

  if (state.status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-16 t-body-sm text-text-secondary">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Loading this listing…
      </div>
    );
  }

  const feedError = state.status === "ready" ? state.feedError : undefined;

  if (!entry) {
    return <NotFound feedError={feedError} />;
  }

  const {
    isTraveller,
    isSample,
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

  const bg = destinationImage(to, from);
  const route = [from, to].filter(Boolean).join(" → ") || "Route on request";

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

      {isSample && (
        <p className="mt-6 flex items-start gap-3 rounded-md border border-warning/30 bg-warning-surface px-4 py-3 t-body-sm text-text-secondary">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" aria-hidden="true" />
          <span>
            <span className="t-label-2 block text-primary-800">
              This is an example listing
            </span>
            It shows what a real entry looks like while the live board is
            quiet. Nobody is waiting on this one — post your own and it
            appears here once a coordinator approves it.
          </span>
        </p>
      )}

      <div className="card mt-6 p-6 sm:p-8">
        {name && <p className="t-label-1 text-primary-800">{name}</p>}

        {meta.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
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

        {details.length > 0 && (
          <p className="mt-4 t-body-sm text-text-secondary">
            {details.join(" · ")}
          </p>
        )}

        {body && (
          <p className="t-body mt-5 whitespace-pre-line text-text-secondary">
            {body}
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
            <a
              href={`tel:${BUSINESS.phone}`}
              className="btn btn-primary"
              aria-label={`Call Wicket Travel about entry ${reference}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Ask for an introduction
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
        <p className="mt-4 t-body-sm text-text-secondary">
          Reference <span className="t-code">{reference}</span>. Contact
          details are never published — quote this reference and our team
          makes the introduction.
        </p>
      </div>

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
        <a href={`tel:${BUSINESS.phone}`} className="btn btn-secondary">
          Call {BUSINESS.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
