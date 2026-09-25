import Image from "next/image";
import {
  ArrowDown,
  BadgeCheck,
  HandHeart,
  Headset,
  HeartHandshake,
  PlaneTakeoff,
} from "lucide-react";
import TrustpilotStars from "@/components/travel-assist/TrustpilotStars";
import { TRUSTPILOT_URL } from "@/components/travel-assist/constants";

/* Three promises, each one a thing the service actually does — kept to a
   handful of words so the row scans in a glance over the photograph. */
const PROMISES = [
  { icon: BadgeCheck, text: "ID-verified companions" },
  { icon: PlaneTakeoff, text: "Same flight, gate to arrivals" },
  { icon: Headset, text: "UK team on call 24/7" },
];

/**
 * Parents Travel Assist hero — a full-bleed photograph under a navy scrim.
 *
 * The photo is a portrait frame (a younger man steadying an older woman in a
 * sari onto an escalator — the service in one picture), so it is laid out per
 * breakpoint rather than forced into one crop:
 *
 *   • below lg the frame fills the whole hero, and the scrim deepens toward
 *     the bottom where the copy sits;
 *   • from lg it bleeds off the right edge (the left one in Arabic/Urdu) at ~60% width and the navy field
 *     feathers into it, so there is no hard column edge — the page reads as
 *     one photograph with the copy set into its darker side.
 *
 * The header rides over it transparently (Header `transparent`), the same
 * pattern the homepage uses, so the image runs to the very top.
 */
export default function AssistHero() {
  return (
    <section
      aria-labelledby="assist-hero-heading"
      className="relative isolate overflow-hidden bg-primary-900"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 lg:left-auto lg:w-[62%] rtl:lg:left-0 rtl:lg:right-auto">
          <Image
            src="/parents-travel-assist/companion-escalator.jpg"
            alt="A younger man holding an older woman's hand as she steps onto an escalator in a modern terminal"
            fill
            preload
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover object-[45%_30%] lg:object-[50%_28%]"
          />
        </div>
        {/* Below lg: light at the top so the faces read, near-solid at the
            bottom where the headline and buttons sit (4.5:1 on white text). */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/25 via-primary-900/70 via-40% to-primary-900 to-65% lg:hidden" />
        {/* From lg: the navy field feathers across the photo's left edge. */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-primary-900 from-36% via-primary-900/70 via-52% to-transparent lg:block rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 hidden bg-gradient-to-b from-primary-900/40 via-transparent via-30% to-primary-900/60 lg:block" />
      </div>

      <div className="container-page pb-40 pt-[20rem] sm:pb-44 sm:pt-[24rem] lg:pb-48 lg:pt-40">
        <div className="max-w-xl">
          <p className="hero-rise inline-flex items-center gap-2 rounded-full bg-accent-500/15 px-3 py-1.5 t-overline text-accent-400 ring-1 ring-accent-400/30">
            <HeartHandshake className="h-4 w-4" aria-hidden="true" />
            Parents Travel Assist
          </p>

          <h1
            id="assist-hero-heading"
            className="hero-rise hero-rise-2 t-display-2 mt-4 text-balance text-text-on-dark"
          >
            Your parents won&rsquo;t fly alone.
          </h1>
          <p className="hero-rise hero-rise-2 t-body-lg mt-4 max-w-md text-pretty text-primary-100">
            We pair them with a verified traveller on the same flight — India to
            the UK, check-in to arrivals.
          </p>

          <ul className="hero-rise hero-rise-3 mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
            {PROMISES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 t-label-2 text-text-on-dark">
                <Icon className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>

          <div className="hero-rise hero-rise-3 mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#find-a-companion"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-7 py-4 t-button text-text-on-dark shadow-e2 shadow-accent-500/30 transition-colors hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
            >
              Find a companion
              <ArrowDown className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href="#offer-to-help"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-000/10 px-7 py-4 t-button text-text-on-dark ring-1 ring-neutral-000/25 transition-colors hover:bg-neutral-000/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/70"
            >
              <HandHeart className="h-5 w-5" aria-hidden="true" />
              I&rsquo;m flying &amp; can help
            </a>
          </div>

          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-rise hero-rise-4 mt-8 inline-flex items-center gap-3 rounded-sm t-label-2 text-text-on-dark transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/70"
          >
            <TrustpilotStars size="sm" />
            <span>
              Rated <span className="text-accent-400">Excellent</span> on Trustpilot
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
