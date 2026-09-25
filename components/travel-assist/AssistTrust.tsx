import { ArrowUpRight, HeartHandshake, IdCard, PhoneCall, PlaneTakeoff } from "lucide-react";
import { TRUSTPILOT_REVIEWS } from "@/lib/travelAssist";
import TrustpilotStars from "@/components/travel-assist/TrustpilotStars";
import { TRUSTPILOT_URL } from "@/components/travel-assist/constants";

/* What the team checks before any introduction — commitments the operations
   team has to keep (see WORK-STATUS.md). */
const CHECKS = [
  { icon: IdCard, title: "Passport checked", text: "Matched to the name on the ticket." },
  { icon: PlaneTakeoff, title: "Same flight confirmed", text: "We see the booking, not a promise." },
  { icon: PhoneCall, title: "Phone verified", text: "Both sides reachable before the day." },
  { icon: HeartHandshake, title: "Introduced by us", text: "Details shared only when both agree." },
];

/**
 * Trust in one place: what we check on both sides, then real Trustpilot
 * reviews (verbatim, lib/travelAssist.ts) under the profile's own TrustScore.
 * Reviews swipe on phones; three show on desktop with a link to the rest.
 */
export default function AssistTrust() {
  return (
    <section aria-labelledby="assist-trust-heading" className="section bg-sand-500">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="t-overline text-primary-500">Safe hands</p>
            <h2 id="assist-trust-heading" className="mt-2 t-h2 text-balance text-primary-800">
              Checked by us. Trusted by families.
            </h2>
          </div>
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 self-start rounded-md bg-neutral-000 px-4 py-3 ring-1 ring-sand-600 transition-colors hover:ring-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 md:self-auto"
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

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHECKS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4 rounded-lg bg-neutral-000 p-5 ring-1 ring-sand-600">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-success-surface text-success">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block t-label-1 text-primary-800">{title}</span>
                <span className="mt-0.5 block t-body-sm text-text-secondary">{text}</span>
              </span>
            </li>
          ))}
        </ul>

        <ul className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 lg:[&>li:nth-child(n+4)]:hidden">
          {TRUSTPILOT_REVIEWS.map((review) => (
            <li key={review.name} className="flex w-[85%] shrink-0 snap-start flex-col rounded-lg bg-neutral-000 p-6 ring-1 ring-sand-600 sm:w-[60%] md:w-auto">
              <TrustpilotStars rating={5} size="sm" />
              <blockquote className="mt-4 flex-1 t-body text-primary-800">&ldquo;{review.text}&rdquo;</blockquote>
              <p className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                <span className="t-label-2 text-primary-800">{review.name}</span>
                <span className="t-caption text-text-secondary">{review.date} · Trustpilot</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
