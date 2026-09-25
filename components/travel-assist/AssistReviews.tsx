import { ArrowUpRight, Quote } from "lucide-react";
import { TRUSTPILOT_REVIEWS } from "@/lib/travelAssist";
import TrustpilotStars from "@/components/travel-assist/TrustpilotStars";
import { TRUSTPILOT_URL } from "@/components/travel-assist/constants";

/**
 * Real Trustpilot reviews only (lib/travelAssist.ts → TRUSTPILOT_REVIEWS),
 * each one five stars on the profile, and the headline score is the
 * profile's own TrustScore — so everything here survives a click-through.
 * Below md the cards become a swipeable row instead of a tall stack.
 */
export default function AssistReviews() {
  return (
    <section aria-labelledby="assist-reviews-heading" className="section bg-neutral-000">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-overline text-primary-500">Reviews</p>
            <h2 id="assist-reviews-heading" className="mt-2 t-h2 text-balance text-primary-800">
              Families trust us with their trips
            </h2>
          </div>
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 self-start rounded-md bg-neutral-000 px-4 py-3 ring-1 ring-neutral-300 transition-colors hover:ring-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 md:self-auto"
          >
            <TrustpilotStars />
            <span className="leading-tight">
              <span className="block t-label-1 text-primary-800">Excellent · 4.5 / 5</span>
              <span className="inline-flex items-center gap-1 t-caption text-text-secondary">
                TrustScore on Trustpilot
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </span>
            <span className="sr-only">(opens Trustpilot in a new tab)</span>
          </a>
        </div>

        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {TRUSTPILOT_REVIEWS.map((review) => (
            <li
              key={review.name}
              className="flex w-[85%] shrink-0 snap-start flex-col rounded-md border border-neutral-300 bg-neutral-000 p-6 sm:w-[60%] md:w-auto"
            >
              <div className="flex items-center justify-between">
                <TrustpilotStars rating={5} size="sm" />
                <Quote className="h-6 w-6 text-primary-100" aria-hidden="true" />
              </div>
              <blockquote className="mt-4 flex-1 t-body text-primary-800">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <p className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                <span className="t-label-2 text-primary-800">{review.name}</span>
                <span className="t-caption text-text-secondary">
                  {review.date} · Trustpilot
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
