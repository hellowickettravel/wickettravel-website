import { Star } from "lucide-react";
import { BUSINESS, starBackground } from "@/lib/seo";

/* The real Trustpilot profile URL lives in BUSINESS.sameAs alongside the
   social links — reused here rather than duplicated. */
const TRUSTPILOT_URL =
  BUSINESS.sameAs.find((url) => url.includes("trustpilot.com")) ??
  "https://www.trustpilot.com/review/wickettravel.com";

/**
 * A verifiable trust signal, not a lookalike widget: it states the score
 * (BUSINESS.ratingValue) and the "Excellent" label but no review count (the
 * client doesn't want one claimed), and the whole badge links straight to the
 * real Trustpilot profile — every claim it makes is one click from being
 * checked. This is deliberately NOT an embedded Trustpilot TrustBox widget:
 * that requires a Business Unit ID issued from a Trustpilot Business
 * account, which this project doesn't have on file. If one is ever
 * obtained, swap this component's contents for the official embed script.
 */
export default function TrustpilotBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href={TRUSTPILOT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Rated ${BUSINESS.ratingValue} out of 5, Excellent, on Trustpilot — read our reviews, opens in a new tab`}
      className={`inline-flex items-center gap-2 rounded-md bg-neutral-000 px-2.5 py-2 shadow-e2 ring-1 ring-neutral-300 transition-transform duration-200 ease-out hover:-translate-y-0.5 sm:gap-2.5 sm:px-3 sm:py-2.5 ${className}`}
    >
      <span className="flex shrink-0 gap-px" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="grid h-4 w-4 place-items-center rounded-[2px] sm:h-[18px] sm:w-[18px]"
            style={{ background: starBackground(i, BUSINESS.ratingValue) }}
          >
            <Star
              fill="currentColor"
              className="h-2 w-2 text-neutral-000 sm:h-2.5 sm:w-2.5"
            />
          </span>
        ))}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="t-label-2 text-primary-800">
          {BUSINESS.ratingValue}{" "}
          <span className="font-normal text-text-secondary">Excellent</span>
        </span>
        <span className="t-caption text-text-secondary">
          Rated on <span className="font-bold text-primary-800">Trustpilot</span>
        </span>
      </span>
    </a>
  );
}
