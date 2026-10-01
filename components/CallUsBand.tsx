"use client";

import Image from "next/image";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PHONE_LINK } from "@/lib/links";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

const PHONE_DISPLAY = "+44 7417 564704";

/**
 * "Talk to a real person" — standalone premium support section placed
 * mid-page. A real, friendly agent photo + a prominent number that opens WhatsApp
 * make phone booking feel human and trustworthy. 24/7, on-brand navy/orange.
 */
export default function CallUsBand() {
  const { t } = useI18n();

  return (
    <section aria-labelledby="call-us-heading" className="section bg-sand-500">
      <div className="container-page">
        {/* Flat navy. This carried `bg-gradient-to-br from-primary-800
            via-primary-800 to-primary-900` — a gradient whose first two stops
            were the same colour, so it amounted to a faint sheen in one corner
            of a section background. That is decoration, which PRODUCT.md's
            anti-references rule out; primary-800 is the token that was already
            doing 95% of the work. */}
        <div className="relative overflow-hidden rounded-lg bg-primary-800 shadow-e3 shadow-primary-900/30 ring-1 ring-neutral-000/10">
          <div className="relative grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[auto_1fr_auto] lg:gap-12">
            {/* Friendly real support agent */}
            <div className="mx-auto lg:mx-0">
              <div className="relative">
                <div className="relative h-44 w-44 overflow-hidden rounded-lg ring-4 ring-neutral-000/15 sm:h-52 sm:w-52">
                  <Image
                    src="/support/agent-on-call.jpg"
                    alt="A friendly Wicket Travel support agent taking a customer call"
                    fill
                    sizes="(max-width: 640px) 176px, 208px"
                    className="object-cover"
                  />
                </div>
                {/* Online-now badge. The dot is static: it used to carry
                    `animate-ping`, an infinite pulse on a claim that never
                    changes. PRODUCT.md's anti-references call out blinking
                    urgency devices, and a permanent loop on a permanent fact is
                    the same move in a friendlier costume. A solid success-green
                    dot beside the words "Online now" says it already. */}
                <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-neutral-000 px-3 py-2 t-label-3 text-primary-800 shadow-e2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                  Online now
                </span>
              </div>
            </div>

            {/* Copy */}
            <div className="text-center lg:text-left">
              <h2 id="call-us-heading" className="t-h2 text-text-on-dark">
                {t("call.title")}
              </h2>
              <p className="t-body mx-auto mt-3 max-w-xl text-primary-200 lg:mx-0">
                {t("call.lead")}
              </p>
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 t-label-2 text-primary-100 lg:justify-start">
                <li className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent-400" aria-hidden="true" />
                  Available 24/7 — day or night
                </li>
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent-400" aria-hidden="true" />
                  Trusted airlines · no hidden fees
                </li>
              </ul>
            </div>

            {/* Click-to-call */}
            <div className="flex shrink-0 flex-col items-center gap-3">
              {/* Plain anchor. The scale-1.03 hover / 0.98 tap made the primary
                  phone CTA swell under the pointer; a button that changes size
                  reads as a toy, and this is the single most important action on
                  the page. The accent-600 hover fill is the feedback. */}
              <a
                {...PHONE_LINK}
                className="inline-flex items-center gap-3 rounded-full bg-accent-500 px-8 py-4 t-h4 text-text-on-dark shadow-e2 shadow-accent-500/30 transition-colors hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800"
                aria-label={`Chat with us on WhatsApp: ${PHONE_DISPLAY}`}
              >
                <WhatsAppIcon className="h-6 w-6" />
                {PHONE_DISPLAY}
              </a>
              {/* The number opens WhatsApp (lib/links.ts, PHONE_LINK), so the
                  line under it says so rather than offering a second button
                  to the same place. */}
              <p className="inline-flex items-center gap-2 t-label-2 text-primary-100">
                <MessageCircle className="h-4 w-4 text-success" aria-hidden="true" />
                Tap to chat or call on WhatsApp · 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
