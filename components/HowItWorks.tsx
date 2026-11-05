"use client";

import { Search, Plane, PlaneTakeoff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Search or ask",
    body: "Search your route, or tell us where and when on WhatsApp. We look across the world's leading airlines for the best available fares.",
  },
  {
    icon: Plane,
    step: "02",
    title: "Agree your quote",
    body: "A consultant confirms the total price, the flights and the fare rules (baggage, changes, refunds) in writing. Nothing is booked until you agree.",
  },
  {
    icon: PlaneTakeoff,
    step: "03",
    title: "Pay & fly",
    body: "Once you pay, we book your seat with the airline on your behalf and send your e-ticket and booking reference.",
  },
];

export default function HowItWorks() {
  const { t } = useI18n();
  return (
    <section id="how-it-works" className="section scroll-mt-16 bg-primary-800">
      <div className="container-page">
        <div className="section-lead text-center">
          <h2 className="t-h2 text-text-on-dark">{t("how.title")}</h2>
          <p className="t-body mt-4 text-primary-100">
            No clutter, no pressure, no surprises at checkout. Wicket Travel
            books your flight for you, at a price you&apos;ve agreed.
          </p>
        </div>

        <div className="relative mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Connecting line on desktop. This gradient stays: it is a mask, not
              decoration — the rule has to dissolve at both ends so it reads as
              linking the three step markers rather than as a stray hairline
              colliding with the container edges. A flat rule cannot do that. */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-neutral-000/15 to-transparent md:block"
          />
          {STEPS.map(({ icon: Icon, step, title, body }) => (
            <div key={step} className="relative text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-accent-500 text-text-on-dark shadow-e2 shadow-accent-500/30 ring-8 ring-primary-800">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <div className="mt-6 t-label-2 text-accent-400">
                STEP {step}
              </div>
              {/* Was `t-h3 mt-2 t-body-lg` — two type-scale classes on one
                  element, so the later globals.css definition silently won
                  and this rendered at body weight/size instead of h3. */}
              <h3 className="t-h3 mt-2 text-text-on-dark">{title}</h3>
              <p className="t-body-sm mx-auto mt-2 max-w-xs text-primary-100">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
