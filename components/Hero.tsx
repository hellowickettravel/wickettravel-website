"use client";

import Image from "next/image";
import { Headset, ShieldCheck, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { BUSINESS } from "@/lib/seo";
import FlightSearch from "@/components/FlightSearch";
import TrustpilotBadge from "@/components/TrustpilotBadge";

/* Proof points, not decoration: each one is a claim already made elsewhere on
   the site (the rating feeds the JSON-LD, the fee promise and 24/7 line are the
   agency's standing commitments). Rendered as a plain inline row rather than
   chips or stat tiles — the hero's weight belongs to the search widget. */
const PROOF = [
  {
    icon: Star,
    text: `${BUSINESS.ratingValue}/5 rated Excellent on Trustpilot`,
  },
  { icon: ShieldCheck, text: "No hidden booking fees" },
  { icon: Headset, text: "Real UK agents, 24/7" },
];

export default function Hero() {
  const { t } = useI18n();

  return (
    <>
    {/* The header is `fixed` (see Header.tsx), so it never occupies flow
       space here — the photograph runs to the very top of the page with no
       margin trick needed to cancel out a header height. pt is generous
       enough to clear the fixed header with real breathing room below it,
       not just enough to avoid overlap. */}
    <section
      id="top"
      className="relative isolate overflow-hidden pb-[420px] pt-28 sm:pb-[340px] sm:pt-32 lg:pb-[236px] lg:pt-36"
    >
      {/* A wing over a mountain range from the cabin window — the view a
          traveller actually buys. The wing sweeps from centre to lower right,
          so the subject sits on the half of the canvas this layout leaves open,
          and the sky is bright enough to carry a firm scrim on the copy side
          without going muddy. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero/cabin-window-wing.jpg"
          alt="An aircraft wing over a green mountain range, seen from the cabin window"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[55%_50%]"
        />
        {/* Scrim in three passes: darken from the left so the left-aligned copy
            clears 4.5:1 while the runway lights stay legible on the right;
            deepen the top so the overlaid nav reads; deepen the base so the
            search panel sits on ground rather than floating. */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 from-22% via-primary-900/70 via-60% to-primary-900/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 via-transparent via-35% to-primary-900/35" />
      </div>

      <div className="container-page">
        <div className="max-w-xl">
          {/* Trust badge — on phones (below sm, where the widget below stacks
              full-width with nothing to anchor a corner badge to) it drops
              into normal flow above the headline. From sm up it moves onto
              the search widget itself (see the widget wrapper below) instead
              of floating alone near the header — "near the widget" is the
              point, not just "somewhere in the hero". */}
          <div className="hero-rise mb-4 flex justify-start sm:hidden">
            <TrustpilotBadge />
          </div>
          <h1 className="hero-rise t-display-3 text-balance text-text-on-dark">
            {t("hero.title")}
            <span className="block">{t("hero.accent")}</span>
          </h1>
          <p className="hero-rise hero-rise-2 t-body mt-3 max-w-lg text-pretty text-primary-100">
            {t("hero.subline")}
          </p>

          <ul className="hero-rise hero-rise-3 mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            {PROOF.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 t-body-sm text-text-on-dark"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-accent-400"
                  aria-hidden="true"
                />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* The search widget is the hero's call to action, pulled up to straddle
        the hero/next-section boundary — half still reading as part of the
        photograph, half already grounded on the section below. The negative
        margin is tuned per breakpoint to the widget's own rendered height
        (measured, not guessed) since a plain percentage margin can't express
        "half of my own height" for an auto-sized block. z-raised keeps it
        painting above AirlineLogos, which follows immediately after. */}
    <div className="hero-rise hero-rise-4 container-page relative z-raised -mt-[341px] sm:-mt-[289px] lg:-mt-[184px]">
      {/* The cap only bites once the container itself passes 1116px, which is
          a viewport around 1196 — below that the widget needs every pixel it
          can get. Above it the container is wider than the form has any use
          for, and the shorter run makes the row scan as one instrument rather
          than a band stretched across the page.

          Deliberately NOT centred. This block used to carry `mx-auto`, which
          centred the widget inside the container independently of the hero copy
          above it — at 1440 that put the title's left edge at 112.5px and the
          widget's at 154.5px, a 42px step that read as a misalignment rather
          than as an inset. With no inline margins the shrunk box sits on the
          container's inline-start edge, so the widget, the h1 and the header
          wordmark all share one left edge at every breakpoint. Margins are left
          unset rather than set to `mr-auto` so the alignment follows `dir` and
          survives the Arabic/Urdu flips the brand ships. */}
      <div className="relative w-full lg:max-w-[1116px]">
        {/* Trust badge, from sm up: anchored to the search widget's own
            top-right corner (this div, not the wider outer container — the
            widget isn't centred in it, see the comment above), overlapping
            its top edge like a hung tag rather than floating independently
            near the header. Scaled down a touch so it reads as a badge on
            the widget, not a second competing panel. */}
        <div className="absolute right-4 top-0 z-10 hidden -translate-y-1/2 scale-90 sm:block sm:right-6">
          <TrustpilotBadge />
        </div>
        <FlightSearch />
      </div>
    </div>
    </>
  );
}
