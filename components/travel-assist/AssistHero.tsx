import Image from "next/image";
import { BadgeCheck, CheckCircle2, Headset, HeartHandshake, PlaneTakeoff } from "lucide-react";
import TrustpilotStars from "@/components/travel-assist/TrustpilotStars";
import { TRUSTPILOT_URL } from "@/components/travel-assist/constants";

const PROMISES = [
  { icon: BadgeCheck, text: "ID-verified companions" },
  { icon: PlaneTakeoff, text: "Same flight, check-in to arrivals" },
  { icon: Headset, text: "UK team on call 24/7" },
];

/** Two photo cards and the match between them — the service in one picture.
 *  Illustrative: the same sample people who appear on the board below. */
function MatchVisual() {
  return (
    <div className="relative mx-auto h-[400px] w-full max-w-[420px]" aria-hidden="true">
      <svg viewBox="0 0 420 400" className="absolute inset-0 h-full w-full text-accent-400">
        <path d="M200 170 C 280 150, 320 190, 320 230" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
      </svg>

      <figure className="absolute left-0 top-0 w-[220px] -rotate-3 rounded-lg bg-neutral-000 p-2 shadow-e3">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md">
          <Image src="/parents-travel-assist/people/priya-parents.jpg" alt="" fill sizes="220px" className="object-cover" />
        </div>
        <figcaption className="px-1.5 pb-1 pt-2.5">
          <span className="block t-label-2 text-primary-800">Mum &amp; Dad, 68 &amp; 72</span>
          <span className="block t-caption text-text-secondary">DEL → LHR · first long-haul</span>
        </figcaption>
      </figure>

      <figure className="absolute bottom-0 right-0 w-[190px] rotate-3 rounded-lg bg-neutral-000 p-2 shadow-e3">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md">
          <Image src="/parents-travel-assist/people/arjun.jpg" alt="" fill sizes="190px" className="object-cover" />
        </div>
        <figcaption className="px-1.5 pb-1 pt-2.5">
          <span className="flex items-center gap-1 t-label-2 text-primary-800">
            Arjun <BadgeCheck className="h-4 w-4 text-success" />
          </span>
          <span className="block t-caption text-text-secondary">Same flight · can help</span>
        </figcaption>
      </figure>

      <span className="absolute bottom-6 left-0 inline-flex items-center gap-2 rounded-full bg-success px-4 py-2 t-label-2 text-text-on-dark shadow-e3">
        <CheckCircle2 className="h-4 w-4" />
        Matched · same flight
      </span>
    </div>
  );
}

/**
 * Parents Travel Assist hero — Delhi T3, Air India tails through the glass:
 * the departure hall most of these parents actually leave from. Copy on the
 * darker left, the match visual on the right from lg. No buttons here on
 * purpose: the search tabs directly below are the call to action.
 */
export default function AssistHero() {
  return (
    <section aria-labelledby="assist-hero-heading" className="relative isolate overflow-hidden bg-primary-900">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/parents-travel-assist/hero-delhi-t3.jpg"
          alt="Passengers at the windows of Delhi airport's Terminal 3, with Air India aircraft at the gates"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[60%_50%]"
        />
        <div className="absolute inset-0 bg-primary-900/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-primary-900/95 lg:via-primary-900/70 lg:via-50% lg:to-primary-900/30 rtl:lg:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/40 via-transparent via-40% to-primary-900/80" />
      </div>

      <div className="container-page grid grid-cols-1 items-center gap-10 pb-48 pt-28 sm:pb-44 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12 lg:pb-36 lg:pt-32">
        <div className="max-w-xl">
          <p className="hero-rise inline-flex items-center gap-2 rounded-full bg-accent-500/15 px-3 py-1.5 t-overline text-accent-400 ring-1 ring-accent-400/30">
            <HeartHandshake className="h-4 w-4" aria-hidden="true" />
            Parents Travel Assist
          </p>
          <h1
            id="assist-hero-heading"
            className="hero-rise hero-rise-2 t-display-2 mt-5 text-balance text-text-on-dark"
          >
            Your parents won&rsquo;t fly alone.
          </h1>
          <p className="hero-rise hero-rise-2 t-body-lg mt-4 max-w-md text-pretty text-primary-100">
            We pair them with a verified traveller on the same flight — India to
            the UK, check-in to arrivals.
          </p>

          <ul className="hero-rise hero-rise-3 mt-6 grid gap-2.5 sm:flex sm:flex-wrap sm:gap-x-6">
            {PROMISES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 t-label-2 text-text-on-dark">
                <Icon className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>

          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-rise hero-rise-3 mt-7 inline-flex items-center gap-3 rounded-sm t-label-2 text-text-on-dark transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/70"
          >
            <TrustpilotStars size="sm" />
            <span>
              Rated <span className="text-accent-400">Excellent</span> on Trustpilot
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        </div>

        <div className="hero-rise hero-rise-4 hidden lg:block">
          <MatchVisual />
        </div>
      </div>
    </section>
  );
}
