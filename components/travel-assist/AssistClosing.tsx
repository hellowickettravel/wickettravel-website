import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandHeart, MessageCircle, PhoneCall, Plus } from "lucide-react";
import { BUSINESS } from "@/lib/seo";
import { HASH, whatsappLink } from "@/components/travel-assist/constants";

/**
 * Last word: post the trip, or book the flights — both lead to a match.
 * Split card: the offer on navy, and the mudra-hands wall of Delhi T3 — the
 * sculpture every one of these parents walks past on the way to the gate.
 */
export default function AssistClosing() {
  return (
    <section aria-labelledby="assist-closing-heading" className="section bg-neutral-000">
      <div className="container-page">
        <div className="grid grid-cols-1 overflow-hidden rounded-lg bg-primary-800 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative h-56 sm:h-72 lg:order-2 lg:h-auto">
            <Image
              src="/parents-travel-assist/delhi-t3-hands.jpg"
              alt="The mudra hand sculptures above the departures hall at Delhi airport Terminal 3"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-[50%_35%]"
            />
          </div>

          <div className="px-6 py-10 sm:px-10 sm:py-12 lg:py-16">
            <h2 id="assist-closing-heading" className="t-display-3 text-balance text-text-on-dark">
              Ready when their flight is.
            </h2>
            <p className="mt-4 max-w-md t-body-lg text-primary-100">
              Post the trip in two minutes — or book their tickets with us and
              we&rsquo;ll match them on the same flight.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={`#${HASH.postTrip}`} className="btn btn-primary rounded-full px-7 py-4">
                <Plus className="h-5 w-5" aria-hidden="true" />
                Post my parents&rsquo; trip
              </a>
              <Link
                href="/flights"
                className="btn rounded-full bg-neutral-000 px-7 py-4 text-primary-800 hover:bg-primary-050 focus-visible:ring-offset-primary-800"
              >
                Book their flights
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            <a
              href={`#${HASH.postOffer}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xs t-label-2 text-primary-100 underline decoration-accent-400 decoration-2 underline-offset-4 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            >
              <HandHeart className="h-4 w-4" aria-hidden="true" />
              Flying soon? Offer to help a family
            </a>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-neutral-000/15 pt-6 t-label-2 text-text-on-dark">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="inline-flex items-center gap-2 rounded-xs hover:text-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <PhoneCall className="h-4 w-4 text-accent-400" aria-hidden="true" />
                {BUSINESS.phoneDisplay}
              </a>
              <a
                href={whatsappLink("Hi Wicket Travel — I'd like to know more about Parents Travel Assist.")}
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
