/* Server component: no hooks or client-only APIs remain after the scroll-reveal
   wrapper and the CTA's scale gesture were removed. */
import { HeartHandshake, MessageCircle, PhoneCall } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/links";

const PHONE_DISPLAY = "+44 7417 564704";
const PHONE_TEL = "+447417564704";

/**
 * Parents Tickets — marketing banner only. The community board and enquiry
 * form are retired for now; enquiries come in by phone or WhatsApp, where a
 * real person arranges the introduction.
 *
 * Styling only deliberately kept distinct from CallUsBand two sections up:
 * same copy, same phone/WhatsApp CTAs, but a light card instead of a second
 * flat-navy block, so the two don't read as twins in the scroll. No content
 * was invented to do this — an icon medallion stands in for CallUsBand's
 * agent photo (no equivalent photo exists for this service), and the accent
 * phone button keeps its brand colour so it still reads as "the call button"
 * site-wide. Content-level differentiation (a dedicated photo, or merging
 * this with CallUsBand into one panel) is a decision for the client, not a
 * design guess — see WORK-STATUS.md.
 */
export default function ParentsBanner() {
  return (
    <section
      id="parents-tickets"
      className="section scroll-mt-16 bg-neutral-000"
      aria-labelledby="parents-tickets-heading"
    >
      <div className="container-page">
        <div className="relative overflow-hidden rounded-lg bg-sand-500 shadow-e2 ring-1 ring-primary-800/10">
          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[auto_1fr_auto] lg:gap-10">
            {/* Icon medallion stands in for a photo — this service has no
                equivalent agent portrait, and a stock "elderly couple"
                photo would be exactly the kind of invented content this
                pass is avoiding. */}
            <div className="mx-auto lg:mx-0">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-primary-800 shadow-e1 sm:h-24 sm:w-24">
                <HeartHandshake className="h-9 w-9 text-accent-400 sm:h-10 sm:w-10" aria-hidden="true" />
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h2 id="parents-tickets-heading" className="t-h2 text-primary-800">
                Travelling with elderly parents, made easier
              </h2>
              <p className="t-body-lg mx-auto mt-4 max-w-xl text-text-on-sand lg:mx-0">
                We connect families who need someone to accompany an elderly
                parent with trusted travellers already going the same way — and
                our team personally arranges every introduction.
              </p>
              <p className="mt-6 flex items-center justify-center gap-2 t-label-2 text-primary-700 lg:justify-start">
                <HeartHandshake className="h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
                A warm, human service — no accounts, no fees to enquire.
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-3">
              {/* Plain anchor — scale hover/tap dropped, see CallUsBand. Same
                  accent-500 fill as every other phone CTA on the page: the
                  button's job is to be recognised as "the call button," not
                  to carry this section's differentiation. */}
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-3 rounded-full bg-accent-500 px-8 py-4 t-label-1 text-text-on-dark shadow-e2 shadow-accent-500/30 transition-colors hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-500"
                aria-label={`Call us about Parents Travel Assist on ${PHONE_DISPLAY}`}
              >
                <PhoneCall className="h-5 w-5" aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 t-label-2 text-primary-700 transition-colors hover:text-primary-900 focus-visible:text-primary-900 focus-visible:outline-none"
              >
                <MessageCircle className="h-4 w-4 text-success" aria-hidden="true" />
                Or message us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
