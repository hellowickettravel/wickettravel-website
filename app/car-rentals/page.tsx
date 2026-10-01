import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Cog,
  DoorOpen,
  Headset,
  KeyRound,
  Luggage,
  MapPin,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AREA_SERVED_UK,
  BUSINESS,
  OG_BASE,
  ORGANIZATION_ID,
  SISTER_BRAND,
  SITE_URL,
  TWITTER_BASE,
} from "@/lib/seo";
import { HOLIDAYS_URL, PHONE_LINK, externalLinkProps } from "@/lib/links";

/**
 * /car-rentals — Wicket Travel's car hire showcase.
 *
 * Wicket Travel books flights; car hire (like hotels and packages) is fulfilled
 * by the sister brand — see lib/links.ts, which routes every non-flight product
 * to HOLIDAYS_URL. This page therefore *showcases* the product and hands the
 * booking itself to Wicket Travel Holidays. Same rules as /hotels:
 *
 *   1. The hero's pickup/drop-off panel is explicitly an EXAMPLE — static text
 *      in field-shaped boxes, never <input>/<form> elements — so nothing here
 *      can read as a local rental booking engine that doesn't exist. The one
 *      real control is the link out to Holidays.
 *   2. Vehicles are shown by CLASS (capacity, luggage, transmission, doors),
 *      never as a named model at a named rate. No prices, daily rates or
 *      currency figures anywhere, per PRODUCT.md principle 4.
 *   3. Partner brands are typeset wordmarks, not logo marks — the same rule
 *      components/AirlineLogos.tsx follows: we never fabricate or distort a
 *      mark we have not been licensed to reproduce.
 *
 * Motion follows the trimmed homepage standard: no scroll-reveals, colour
 * transitions and a 2px lift only. Server component, ships no JS of its own.
 */

export const metadata: Metadata = {
  title: "Car Rentals",
  description:
    "Car hire arranged with Wicket Travel Holidays — economy hatchbacks to SUVs, luxury saloons and 7-seat people carriers, collected at the airport desk.",
  alternates: { canonical: "/car-rentals" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/car-rentals`,
    title: "Car Rentals | Wicket Travel",
    description:
      "Airport pickup, clear terms and a real UK team on the phone. Car hire arranged with Wicket Travel Holidays alongside the flight we book for you.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Car Rentals | Wicket Travel",
    description:
      "Economy hatchbacks to seven-seat people carriers, collected at the airport desk — with the insurance terms written down first.",
  },
};

/* ── Hero: an EXAMPLE enquiry, not a form ────────────────────────────────
   Field-shaped boxes holding static text. Deliberately not <input>s: the
   rental itself is completed on the sister site, and a live-looking search
   bar here would promise a booking engine Wicket Travel does not run. */
const EXAMPLE_SEARCH = [
  { icon: MapPin, label: "Pick-up", value: "Dubai International (DXB)" },
  { icon: MapPin, label: "Drop-off", value: "Same location" },
  { icon: CalendarDays, label: "Collect", value: "Fri 12 June · 14:00" },
  { icon: CalendarCheck, label: "Return", value: "Tue 16 June · 11:00" },
] as const;

/* ── Vehicle classes ─────────────────────────────────────────────────────
   Classes, not models: a rental desk allocates "or similar", so naming a
   specific car at a specific rate would be a promise nobody can keep. Specs
   are the ones a traveler actually chooses on — seats, bags, gearbox, doors.
   No rates: PRODUCT.md principle 4 keeps every figure soft-verifiable. */
type VehicleClass = {
  name: string;
  tagline: string;
  body: string;
  img: string;
  alt: string;
  specs: { icon: typeof Users; label: string; value: string }[];
};

const VEHICLES: VehicleClass[] = [
  {
    name: "Economy",
    tagline: "City runs & short hops",
    body: "A compact hatchback for two, easy to park in an old town and the cheapest class to fuel. The default choice for a long weekend.",
    img: "/cars/economy-hatchback.jpg",
    alt: "A compact blue hatchback parked on open ground under an overcast sky",
    specs: [
      { icon: Users, label: "Seats", value: "4 adults" },
      { icon: Luggage, label: "Luggage", value: "1 large · 1 cabin" },
      { icon: Cog, label: "Gearbox", value: "Manual or automatic" },
      { icon: DoorOpen, label: "Doors", value: "3 or 5" },
    ],
  },
  {
    name: "SUV",
    tagline: "Families & rough roads",
    body: "Higher ride, proper boot space and a spare row of legroom. What most families end up in for a fortnight with cases and a pushchair.",
    img: "/cars/suv.jpg",
    alt: "A white SUV parked on a desert track beside red rock formations",
    specs: [
      { icon: Users, label: "Seats", value: "5 adults" },
      { icon: Luggage, label: "Luggage", value: "3 large · 2 cabin" },
      { icon: Cog, label: "Gearbox", value: "Automatic" },
      { icon: DoorOpen, label: "Doors", value: "5" },
    ],
  },
  {
    name: "Luxury",
    tagline: "Business trips & arrivals",
    body: "A full-size saloon with a quiet cabin and a boot that swallows two suitcases without argument. Chauffeur can be added at some desks.",
    img: "/cars/luxury-sedan.jpg",
    alt: "A dark grey luxury saloon parked on a city street",
    specs: [
      { icon: Users, label: "Seats", value: "5 adults" },
      { icon: Luggage, label: "Luggage", value: "2 large · 2 cabin" },
      { icon: Cog, label: "Gearbox", value: "Automatic" },
      { icon: DoorOpen, label: "Doors", value: "4" },
    ],
  },
  {
    name: "Van & people carrier",
    tagline: "Groups & extended family",
    body: "Seven or eight seats with the back row up, or five seats and everyone's luggage with it folded. The one to book when the whole family flies together.",
    img: "/cars/people-carrier.jpg",
    alt: "A white seven-seat people carrier parked in an empty car park",
    specs: [
      { icon: Users, label: "Seats", value: "7 to 8" },
      { icon: Luggage, label: "Luggage", value: "4 large · 3 cabin" },
      { icon: Cog, label: "Gearbox", value: "Manual or automatic" },
      { icon: DoorOpen, label: "Doors", value: "5, sliding" },
    ],
  },
];

/* ── How it works ────────────────────────────────────────────────────────
   Three steps, laid out as an editorial ledger: a rule across the top of each
   column with an accent tick and a typeset step number. Deliberately NOT the
   homepage pattern (components/HowItWorks.tsx uses orange icon medallions
   ringed on a navy band with a connecting hairline) — same information
   architecture, a visibly different device, so the two don't read as one
   section pasted twice. */
const STEPS = [
  {
    n: "01",
    title: "Tell us the dates",
    body: "Add the car when you book the flight, or call us later — the pick-up desk, the drop-off and the times are all we need to start. Nothing is charged at this stage.",
  },
  {
    n: "02",
    title: "We pass it to Holidays",
    body: "Our sister brand's rental desk confirms the vehicle class, the driver requirements and the full terms in writing before anything is agreed. No card details over the phone, ever.",
  },
  {
    n: "03",
    title: "Collect the keys",
    body: "Show your licence, passport and the booking reference at the desk in the arrivals hall. If the flight lands late, the desk already has your flight number.",
  },
];

/* ── Rental partners ─────────────────────────────────────────────────────
   Typeset wordmarks only. We have no licence to reproduce these companies'
   logo marks, and AirlineLogos.tsx already sets the house rule: a clean
   labeled name beats a fabricated or distorted mark. */
const RENTAL_BRANDS = [
  "Hertz",
  "Avis",
  "Europcar",
  "Sixt",
  "Enterprise",
  "Budget",
];

/* ── Requirements FAQ ────────────────────────────────────────────────────
   The five things a UK traveler is actually caught out by at the desk.
   Answers stay figure-free on anything commercial — ages and document rules
   are facts; deposits, excesses and surcharges are described, never priced. */
const CAR_FAQ = [
  {
    question: "How old do I need to be to hire a car?",
    answer:
      "Most partners rent to drivers aged 21 and over, and some classes — luxury saloons and larger vans in particular — are restricted to 25 and over. Drivers under 25 are usually subject to a young-driver surcharge, which the rental desk states in full on the terms before you agree to anything. Tell us the driver's age when you enquire and we will only show you classes they can actually be given.",
  },
  {
    question: "Which driving licence do I need, and do I need an IDP?",
    answer:
      "A full UK photocard licence held for at least a year covers most destinations, and you must bring the physical card — a photo of it is not accepted at the desk. Some countries also want an International Driving Permit alongside it; the UAE accepts a UK licence for tourists, while several other destinations do not. IDPs are issued over the counter at UK Post Offices. We will confirm which applies to your destination in writing before you travel.",
  },
  {
    question: "What insurance is included, and what is the excess?",
    answer:
      "Rentals arrived through our partners include collision damage waiver and theft protection as standard, with a damage excess you remain liable for. That excess amount, and the deposit held on your card at the desk, are both shown in full on the rental terms before the booking is confirmed — never sprung on you at pick-up. Excess-reduction cover can be added at the desk or bought separately from a UK insurer; either is fine, and we will not push you towards one.",
  },
  {
    question: "Can I drive the car across a border?",
    answer:
      "Sometimes, but never assume it. Cross-border travel has to be declared before you collect the car so the right documentation and insurance extension travel with it, and some partners exclude certain neighbouring countries outright. Tell us the route when you enquire — if the crossing is not permitted on that booking, it is far better to find out from us than at a frontier post.",
  },
  {
    question: "How does the fuel policy work?",
    answer:
      "The usual arrangement is like-for-like: you collect the car with a full tank and return it full, refuelling near the drop-off point and keeping the receipt. If it comes back short, the desk refuels it and charges for doing so. A few locations only offer a pre-purchased tank instead, in which case unused fuel is not refunded — we will tell you which policy applies to your booking before you confirm it.",
  },
];

/* ── Structured data ─────────────────────────────────────────────────────
   One @graph, matching the homepage convention. Same split-brand honesty as
   /hotels: Wicket Travel arranges the hire (so `provider` resolves to the
   homepage Organization @id) and the sister brand completes it, named in the
   description rather than asserted as a second provider. Vehicle classes are
   listed as the categories the page actually shows — no rates, no deposits,
   no availability, matching the no-pricing rule the page copy follows. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/car-rentals#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Car Rentals",
          item: `${SITE_URL}/car-rentals`,
        },
      ],
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/car-rentals#service`,
      name: "Car hire booking",
      serviceType: "Car rental booking",
      url: `${SITE_URL}/car-rentals`,
      description: `Wicket Travel arranges car hire to collect on arrival alongside the flights it books for UK travellers. The rental is contracted and confirmed by its sister brand, ${SISTER_BRAND.name}, through the established international rental networks.`,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: AREA_SERVED_UK,
      audience: {
        "@type": "Audience",
        audienceType: "Travellers departing from the United Kingdom",
      },
      category: VEHICLES.map((v) => v.name),
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: SISTER_BRAND.url,
        servicePhone: {
          "@type": "ContactPoint",
          telephone: BUSINESS.phone,
          contactType: "reservations",
          areaServed: "GB",
          availableLanguage: ["English", "Hindi", "Urdu", "Arabic"],
        },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/car-rentals#faq`,
      mainEntity: CAR_FAQ.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default function CarRentalsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden py-12 sm:py-16 lg:py-20">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/cars/hero-coast-road.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[52%_58%]"
            />
            {/* Two scrim passes, same recipe as the homepage and /hotels heroes:
                darken from the copy side to clear 4.5:1, then settle the base so
                the example panel sits on ground rather than floating. */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 from-20% via-primary-900/78 via-55% to-primary-900/45" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 via-transparent via-40% to-primary-900/45" />
          </div>

          <div className="container-page relative">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 t-label-3 text-primary-200">
                <li>
                  <Link
                    href="/"
                    className="rounded-xs transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight
                    className="h-3.5 w-3.5 text-primary-300"
                    aria-hidden="true"
                  />
                  <span aria-current="page" className="text-text-on-dark">
                    Car rentals
                  </span>
                </li>
              </ol>
            </nav>

            <div className="mt-6 max-w-2xl">
              <span className="t-overline inline-flex items-center gap-2 text-accent-400">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-6 rounded-full bg-accent-500"
                />
                In partnership with {SISTER_BRAND.name}
              </span>

              <h1 className="t-h1 mt-4 text-balance text-text-on-dark">
                Land, collect the keys, keep going.
              </h1>

              <p className="t-body-lg mt-4 max-w-xl text-primary-100">
                We book the flight. Our holidays brand arranges the car waiting
                for you at the other end — economy hatchbacks to seven-seat
                people carriers, with the terms written down before you agree to
                anything.
              </p>

              <ul className="mt-8 flex flex-wrap gap-3">
                {[
                  { icon: KeyRound, label: "Airport desk pick-up" },
                  { icon: ShieldCheck, label: "Insurance terms in writing" },
                  { icon: Headset, label: "Real UK agents, 24/7" },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-000/10 bg-neutral-000/5 px-4 py-2 t-label-2 text-primary-100"
                  >
                    <Icon
                      className="h-4 w-4 text-accent-400"
                      aria-hidden="true"
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Example enquiry panel — a full-width pick-up/drop-off bar, the
                shape a traveler expects from car hire, but static text rather
                than a live search. The only control is the link out. */}
            <div className="mt-10 card rounded-lg p-5 shadow-e3 shadow-primary-900/30 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="t-label-1 text-primary-800">
                  Pick-up and drop-off
                </p>
                <span className="pill bg-accent-100 text-accent-700">
                  Example enquiry
                </span>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {EXAMPLE_SEARCH.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-sm border border-neutral-300 bg-neutral-050 px-4 py-3"
                  >
                    <span className="t-overline block text-text-secondary">
                      {label}
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                      <Icon
                        className="h-[18px] w-[18px] shrink-0 text-primary-500"
                        aria-hidden="true"
                      />
                      <span className="t-body-sm truncate text-text-secondary">
                        {value}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <p className="t-body-sm max-w-xl text-text-secondary">
                  Car hire is completed on {SISTER_BRAND.name}, our sister brand
                  — this panel shows what you&apos;ll fill in there. Flights
                  stay here with us, and you can book both in one phone call.
                </p>
                {/* min-h rather than a fixed h throughout this page's CTAs: the
                    sister brand's full name makes these labels long enough to
                    wrap at 375px, and a fixed height clips the second line. */}
                <a
                  {...externalLinkProps}
                  className="btn btn-primary min-h-12 w-full shrink-0 rounded-md lg:w-auto"
                >
                  Check cars on {SISTER_BRAND.name}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Vehicle classes ──────────────────────────────────────────── */}
        <section
          id="vehicles"
          aria-labelledby="vehicles-heading"
          className="section scroll-mt-24 bg-neutral-000"
        >
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 id="vehicles-heading" className="t-h2 text-primary-800">
                Pick the class, not the badge
              </h2>
              <p className="t-body mt-4 text-text-secondary">
                Rental desks allocate a car &ldquo;or similar&rdquo; on the day,
                so what actually matters is how many people and cases fit, and
                whether it is a manual. Here is what each class holds.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VEHICLES.map((v) => (
                <article key={v.name} className="card flex flex-col overflow-hidden">
                  <span className="relative block aspect-[16/10] overflow-hidden">
                    <Image
                      src={v.img}
                      alt={v.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </span>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="t-overline text-accent-700">
                      {v.tagline}
                    </span>
                    <h3 className="t-h3 mt-2 text-primary-800">{v.name}</h3>
                    <p className="t-body-sm mt-2 flex-1 text-text-secondary">
                      {v.body}
                    </p>

                    <dl className="mt-6 divide-y divide-neutral-300 border-t border-neutral-300">
                      {v.specs.map(({ icon: Icon, label, value }) => (
                        <div
                          key={label}
                          className="flex items-center justify-between gap-3 py-2.5"
                        >
                          <dt className="inline-flex items-center gap-2 t-body-sm text-text-secondary">
                            <Icon
                              className="h-4 w-4 shrink-0 text-primary-500"
                              aria-hidden="true"
                            />
                            {label}
                          </dt>
                          <dd className="t-label-2 text-right text-primary-800">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </article>
              ))}
            </div>

            <p className="t-body-sm mt-8 text-center text-text-secondary">
              Availability and rates for your dates are quoted by{" "}
              {SISTER_BRAND.name}.{" "}
              <a
                {...externalLinkProps}
                className="t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
              >
                Check what&apos;s available
                <span className="sr-only"> (opens in a new tab)</span>
              </a>{" "}
              or{" "}
              <Link
                href="/contact"
                className="t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
              >
                ask an agent
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section
          aria-labelledby="how-heading"
          className="section bg-sand-500"
        >
          <div className="container-page">
            <div className="max-w-2xl">
              <span className="t-overline text-accent-700">How it works</span>
              <h2 id="how-heading" className="t-h2 mt-3 text-primary-800">
                Three steps, one phone call
              </h2>
              <p className="t-body mt-4 text-text-on-sand">
                Booking a car through us is not a separate transaction you have
                to manage. It hangs off the flight we are already handling.
              </p>
            </div>

            <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
              {STEPS.map((s) => (
                <li key={s.n} className="relative border-t border-sand-600 pt-6">
                  {/* Accent tick sitting on the rule — the ledger device that
                      replaces the homepage's icon medallion. */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-px left-0 h-0.5 w-12 bg-accent-500"
                  />
                  <span className="t-overline block text-accent-700">
                    Step {s.n}
                  </span>
                  <h3 className="t-h3 mt-3 text-primary-800">{s.title}</h3>
                  <p className="t-body-sm mt-3 text-text-on-sand">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-col items-start gap-4 border-t border-sand-600 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-2 t-body-sm text-text-on-sand">
                <Headset
                  className="h-4 w-4 shrink-0 text-accent-500"
                  aria-hidden="true"
                />
                Prefer to just talk to someone? Call {BUSINESS.phoneDisplay} —
                any hour, any day.
              </p>
              <a {...PHONE_LINK} className="btn btn-outline btn-sm">
                WhatsApp the team
              </a>
            </div>
          </div>
        </section>

        {/* ── Rental partners ──────────────────────────────────────────── */}
        <section className="section bg-neutral-000">
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 className="t-h2 text-primary-800">
                The desks you&apos;ll be collecting from
              </h2>
              <p className="t-body mt-4 text-text-secondary">
                {SISTER_BRAND.name} books through the established international
                rental networks, so the counter you walk up to in arrivals is one
                you already recognise.
              </p>
            </div>

            {/* Typeset wordmarks, not logo marks. The -mt-px/-ml-px overlap
                gives every cell a divider at any column count without
                nth-child arithmetic, and the card's own border covers the
                outer edges. */}
            <div className="mx-auto mt-12 max-w-4xl card overflow-hidden">
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {RENTAL_BRANDS.map((brand) => (
                  <li
                    key={brand}
                    className="-ml-px -mt-px flex min-h-20 items-center justify-center border-l border-t border-neutral-300 px-4 py-6"
                  >
                    <span className="t-label-1 text-center tracking-[0.02em] text-primary-800">
                      {brand}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-center t-caption text-text-secondary">
              Names are shown as text rather than logos: these are the
              trademarks of their respective owners and we do not reproduce
              their marks without licence. Availability of a given brand varies
              by airport and by date.
            </p>

            <p className="mt-8 flex items-center justify-center gap-2 t-label-2 text-text-secondary">
              <BadgeCheck className="h-4 w-4 text-accent-500" aria-hidden="true" />
              Booked and supported by {BUSINESS.legalName}, company registration{" "}
              {BUSINESS.registration}
            </p>
          </div>
        </section>

        {/* ── Requirements FAQ ─────────────────────────────────────────── */}
        <section
          id="car-rental-faq"
          aria-labelledby="car-rental-faq-heading"
          className="section scroll-mt-24 bg-sand-500"
        >
          <div className="container-page">
            <div className="section-lead text-center">
              <h2
                id="car-rental-faq-heading"
                className="t-h2 text-primary-800"
              >
                Licences, insurance and the small print
              </h2>
              <p className="t-body mt-4 text-text-on-sand">
                The five things travelers get caught out by at the rental desk.
                Worth two minutes now rather than an argument in arrivals.
              </p>
            </div>

            {/* Native <details>, same accessible zero-JS accordion as the
                homepage and /flights FAQs. */}
            <div className="mx-auto mt-12 max-w-3xl divide-y divide-neutral-300 overflow-hidden rounded-lg border border-neutral-300/80 bg-neutral-000 shadow-e1">
              {CAR_FAQ.map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-6 text-left font-bold text-primary-800 transition-colors hover:bg-primary-050/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden">
                    <span className="t-body">{item.question}</span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-050 text-primary-700 transition-all duration-200 group-open:rotate-45 group-open:bg-accent-500 group-open:text-text-on-dark">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-text-secondary">
                    <p className="t-body-sm">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row">
              <span className="inline-flex items-center gap-2 t-body-sm text-text-on-sand">
                <Headset className="h-4 w-4 text-accent-500" aria-hidden="true" />
                Something specific to your destination? Ask before you fly.
              </span>
              <Link href="/contact" className="btn btn-outline btn-sm">
                Contact us
              </Link>
            </div>
          </div>
        </section>

        {/* ── Closing CTA ──────────────────────────────────────────────── */}
        <section className="section bg-neutral-000">
          <div className="container-page">
            {/* Flat navy, matching CallUsBand / ParentsBanner / VisaBanner /
                About's CTA. This carried `bg-gradient-to-br from-primary-800
                via-primary-800 to-primary-900` — first two stops identical,
                so it was a no-op sheen on a flat panel, the same decoration
                already removed from those other sections. */}
            <div className="relative overflow-hidden rounded-lg bg-primary-800 px-6 py-12 text-center shadow-e3 shadow-primary-900/30 ring-1 ring-neutral-000/10 sm:px-10 sm:py-16">
              <div className="relative mx-auto max-w-xl">
                <h2 className="t-h2 text-text-on-dark">
                  Flight from us, car from them.
                </h2>
                <p className="t-body mt-4 text-primary-100">
                  Book the fare here and we&apos;ll hand the hire to{" "}
                  {SISTER_BRAND.name} with your flight number attached — so the
                  desk knows when you actually land.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href={HOLIDAYS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary min-h-12 w-full px-8 sm:w-auto"
                  >
                    Check cars on {SISTER_BRAND.name}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <Link
                    href="/flights"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-000/20 bg-neutral-000/5 px-8 t-label-2 text-text-on-dark transition-colors duration-200 hover:bg-neutral-000/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:w-auto"
                  >
                    Search flights
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
