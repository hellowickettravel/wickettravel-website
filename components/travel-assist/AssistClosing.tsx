import Link from "next/link";
import { ArrowRight, HandHeart, MessageCircle, PhoneCall, Plus } from "lucide-react";
import { BUSINESS } from "@/lib/seo";
import { HASH, whatsappLink } from "@/components/travel-assist/constants";

/** Last word: post the trip, or book the flights — both lead to a match. */
export default function AssistClosing() {
  return (
    <section aria-labelledby="assist-closing-heading" className="section bg-sand-500">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-lg bg-primary-800 px-6 py-12 text-center sm:px-12 md:py-16">
          {/* A single dashed flight arc behind the copy — the page's motif. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 800 200"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-6 h-40 w-full text-primary-500"
          >
            <path
              d="M-20 180 C 200 20, 600 20, 820 150"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 10"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative">
            <h2 id="assist-closing-heading" className="t-display-3 text-balance text-text-on-dark">
              Ready when their flight is.
            </h2>
            <p className="mx-auto mt-4 max-w-lg t-body-lg text-primary-100">
              Post the trip in two minutes — or book their tickets with us and
              we&rsquo;ll match them on the same flight.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={`#${HASH.postTrip}`} className="btn btn-primary w-full rounded-full px-8 py-4 sm:w-auto">
                <Plus className="h-5 w-5" aria-hidden="true" />
                Post my parents&rsquo; trip
              </a>
              <Link
                href="/flights"
                className="btn w-full rounded-full bg-neutral-000 px-8 py-4 text-primary-800 hover:bg-primary-050 focus-visible:ring-offset-primary-800 sm:w-auto"
              >
                Book their flights
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            <a
              href={`#${HASH.postOffer}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xs t-label-2 text-primary-100 underline decoration-accent-400 decoration-2 underline-offset-4 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            >
              <HandHeart className="h-4 w-4" aria-hidden="true" />
              Flying soon? Offer to help a family
            </a>

            <div className="mx-auto mt-10 flex max-w-md flex-col items-center justify-center gap-3 border-t border-neutral-000/15 pt-6 t-label-2 text-text-on-dark sm:flex-row sm:gap-8">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="inline-flex items-center gap-2 rounded-xs hover:text-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <PhoneCall className="h-4 w-4 text-accent-400" aria-hidden="true" />
                {BUSINESS.phoneDisplay}
              </a>
              <a
                href={whatsappLink(
                  "Hi Wicket Travel — I'd like to know more about Parents Travel Assist."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xs hover:text-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <MessageCircle className="h-4 w-4 text-accent-400" aria-hidden="true" />
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
