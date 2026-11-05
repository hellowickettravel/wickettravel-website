/* Server component: the stagger wrappers were the only client-side code here. */
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BadgeCheck, Headphones, ShieldCheck, Sparkles } from "lucide-react";
import { HOLIDAYS_URL } from "@/lib/links";

/**
 *"Meet Wicket Travel Holidays" — introduces the sister brand so every
 * hotels/cars/packages redirect on this page has context. Sits right before the
 * hotels & resorts collection, which shows the properties themselves; this
 * section is about the brand.
 *
 * The sister brand is introduced by its LOGO and its NAME, not by importing a
 * second colour palette. This section previously ran on a hand-rolled
 * `SUNSET_GRADIENT` plus four raw hex values (#febb38, #f78839, #f1573b,
 * #188dd3) sampled from the Holidays logo, used for a gradient-filled heading,
 * a gradient-filled pill button, a tri-colour hairline and every icon. Three
 * separate rules said not to:
 *   · PRODUCT.md anti-references — "gradient text" by name;
 *   · PRODUCT.md design principle 2 — one design system, no per-section drift;
 *   · globals.css's own header — components consume tokens, no raw hex.
 * It was also the only place on the page where a heading was unselectable-
 * looking, low-contrast painted type rather than solid text.
 *
 * Now: Wicket navy carries the section, accent-400 (the on-navy orange the
 * token file designates for exactly this) carries the highlights, and the
 * Holidays identity comes through where it actually belongs — the logo lockup.
 */

const TRUST_CUES = [
  { icon: Sparkles, label:"Handpicked stays" },
  { icon: ShieldCheck, label:"Sold under its own terms" },
  { icon: Headphones, label:"24/7 support" },
] as const;

export default function SisterBrand() {
  return (
    <section
      aria-labelledby="sister-brand-heading"
      className="section relative overflow-hidden bg-primary-900"
    >
      {/* Top hairline in the section's own navy ramp. It used to run
          primary-500 → #f78839 → #188dd3, importing two off-system hues to make
          a decorative rainbow rule. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-primary-700"
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand story */}
          <div className="lg:col-span-6">
            <span className="t-overline inline-flex items-center gap-2 text-accent-400">
              <span
                aria-hidden="true"
                className="h-1.5 w-6 rounded-full bg-accent-500"
              />
              Part of the Wicket family
            </span>

            {/* Solid type. The brand name was previously painted with
                `bg-clip-text text-transparent` over the sunset gradient — the
                exact "gradient text" pattern PRODUCT.md names as an
                anti-reference. Setting it in accent-400 keeps the name
                emphasised, keeps it a real colour a screen reader's high-contrast
                mode can override, and clears AA on primary-900. */}
            <h2 id="sister-brand-heading" className="t-h2 mt-4 text-text-on-dark">
              Meet{" "}
              <span className="text-accent-400">Wicket Travel Holidays</span>
            </h2>

            <p className="t-body-lg mt-6 max-w-xl text-primary-100">
              Flights are our craft — everything around them belongs to our
              sister company, Wicket Travel Holidays. Hotels and resorts,
              tailored packages and car rentals are booked with and sold by
              Wicket Travel Holidays, under its own terms.
            </p>

            <ul className="mt-8 flex flex-wrap gap-3">
              {TRUST_CUES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-000/10 bg-neutral-000/5 px-4 py-2 t-label-2 text-primary-100"
                >
                  <Icon className="h-4 w-4 text-accent-400" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Flat accent fill instead of the sunset gradient, and no hover
                  lift: `transition-all` + `-translate-y-0.5` + a shadow swap made
                  the primary CTA jump off the page under the pointer. */}
              <a
                href={HOLIDAYS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-8 py-3 t-label-2 text-text-on-dark shadow-e2 transition-colors duration-200 hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
              >
                Explore Wicket Travel Holidays
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href="#hotels"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-000/15 bg-neutral-000/5 px-8 py-3 t-label-2 text-text-on-dark transition-colors duration-200 hover:bg-neutral-000/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
              >
                Browse hotels & resorts
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 t-body-sm text-primary-200">
              <BadgeCheck className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
              Operated by the same team behind Wicket Travel.
            </p>
          </div>

          {/* Resort collage + brand lockup */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative aspect-[7/6]">
                <div
                  className="absolute right-0 top-0 h-[74%] w-[76%] overflow-hidden rounded-lg shadow-e3 ring-1 ring-neutral-000/15"
                >
                  <Image
                    src="/hotels/maldives-overwater.jpg"
                    alt="Overwater villas above a lagoon in the Maldives"
                    fill
                    sizes="(max-width: 1024px) 76vw, 38vw"
                    className="object-cover"
                  />
                  {/* No scrim: nothing is set on this photo, so a darkening pass
                      over it would be decoration rather than legibility. */}
                </div>

                <div
                  className="absolute bottom-[14%] left-0 h-[54%] w-[46%]"
                >
                  <div className="relative h-full w-full -rotate-2 overflow-hidden rounded-lg shadow-e3 ring-[6px] ring-primary-900">
                    <Image
                      src="/hotels/santorini-suites.jpg"
                      alt="Whitewashed cliffside buildings in Santorini"
                      fill
                      sizes="(max-width: 1024px) 46vw, 23vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Brand lockup card — the logo sits on white so its palm mark stays crisp */}
                <div
                  className="absolute bottom-0 right-0 max-w-[min(100%,20rem)]"
                >
                  <div className="flex items-center gap-4 rounded-lg border border-neutral-000/15 bg-neutral-000/10 p-4 shadow-e3 backdrop-blur-md">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-neutral-000 p-2 shadow-e1">
                      <Image
                        src="/holidays/wicket-travel-holidays-logo.png"
                        alt="Wicket Travel Holidays logo"
                        width={44}
                        height={38}
                        className="h-auto w-full object-contain"
                      />
                    </span>
                    <span>
                      <span className="block t-label-2 text-text-on-dark">
                        Wicket Travel Holidays
                      </span>
                      <span className="mt-1 block t-label-3 text-primary-100">
                        Hotels · Resorts · Packages · Car rentals
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 t-label-3 uppercase text-center text-primary-200 lg:text-left">
              One family · two specialists — flights here, holidays there
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
