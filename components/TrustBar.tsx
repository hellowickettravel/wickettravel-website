/* Server component: with the scroll-reveal wrappers gone this section holds no
   state, no hooks and no client-only APIs, so it ships no JS of its own. */
import { ShieldCheck } from "lucide-react";
import { BUSINESS } from "@/lib/seo";
import { COMPANY } from "@/lib/legal";

/* Every figure here can be checked by a visitor: the IATA TIDS code, the
   Companies House number, the live Trustpilot score and the WhatsApp line.
   The old "2M+ travelers", "60+ airlines" and "120+ countries" figures were
   removed (website audit, 5 Nov 2026): nothing on record backs them up. */
const TRUSTPILOT_URL =
  BUSINESS.sameAs.find((u) => u.includes("trustpilot.com")) ??
  "https://www.trustpilot.com/review/wickettravel.com";

const STATS: { value: string; label: string; href?: string }[] = [
  { value: "IATA", label: `TIDS registered · ${COMPANY.iataTids}` },
  {
    value: "Ltd",
    label: `Companies House · No. ${COMPANY.number}`,
    href: COMPANY.companiesHouseUrl,
  },
  {
    value: `${BUSINESS.ratingValue}★`,
    label: "Rated Excellent on Trustpilot",
    href: TRUSTPILOT_URL,
  },
  { value: "24/7", label: "On WhatsApp" },
];

export default function TrustBar() {
  return (
    <section className="bg-neutral-000 py-12 sm:py-16">
      <div className="container-page">
        <div className="card overflow-hidden">
          <h2 className="sr-only">
            Why UK travellers book their flights with Wicket Travel
          </h2>
          {/* Stats band */}
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={[
                  "px-6 py-8 text-center sm:py-8",
                  i === 1 || i === 3 ? "border-l border-neutral-300" : "",
                  i === 2 || i === 3 ? "border-t border-neutral-300" : "",
                  "sm:border-t-0",
                  i !== 0 ? "sm:border-l sm:border-neutral-300" : "sm:border-l-0",
                ].join(" ")}
              >
                <div className="t-display-3 text-primary-800">
                  {s.value}
                </div>
                <div className="mt-1 t-label-2 text-text-secondary">
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-primary-800"
                    >
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Promise band */}
          <div className="flex flex-col items-center gap-4 border-t border-neutral-300 bg-sand-500/60 px-6 py-6 text-center sm:flex-row sm:justify-center sm:gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-000 px-4 py-2 t-label-2 text-primary-800 shadow-e1 ring-1 ring-neutral-300">
              <ShieldCheck
                className="h-4 w-4 text-accent-500"
                aria-hidden="true"
              />
              Your total price is agreed before you pay — nothing added at checkout
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
