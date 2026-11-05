import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Headset,
  HeartHandshake,
  Lightbulb,
  PiggyBank,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SisterBrand from "@/components/SisterBrand";
import {
  BUSINESS,
  OG_BASE,
  ORGANIZATION_ID,
  SITE_URL,
  TWITTER_BASE,
  UK_DEPARTURES,
  starBackground,
} from "@/lib/seo";
import { COMPANY } from "@/lib/legal";

/* Who runs the company, from the public register (Companies House, company
   17001759, checked 5 November 2026). Website audit, 5 Nov 2026: "add who
   runs the company and when it was founded". */
const COMPANY_FACTS = [
  { label: "Company", value: `${COMPANY.legalName}, a private limited company` },
  { label: "Registered in", value: `${COMPANY.jurisdiction}, company number ${COMPANY.number}` },
  { label: "Incorporated", value: COMPANY.incorporated },
  { label: "Directors", value: "Nagaraju Vadranam and Bala Shobha Rani Maramreddy" },
  { label: "Registered office", value: COMPANY.registeredOffice },
  { label: "IATA", value: `TIDS registered, code ${COMPANY.iataTids}` },
];

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Wicket Travel Limited is a UK travel agent that books airline tickets on your behalf at the best available fares. Who runs us, what we stand for and how we work.",
  alternates: { canonical: "/about" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/about`,
    title: "About Wicket Travel | Trusted Airline Tickets from the UK",
    description:
      "Who we are, what we do and why travelers trust Wicket Travel for the best available airline ticket fares from the UK.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "About Wicket Travel | Trusted Airline Tickets from the UK",
    description:
      "A UK flight-booking service with one job: the best available fare, booked on a trusted carrier, with no hidden fees.",
  },
};

/* AboutPage node alongside the breadcrumb, with `mainEntity` pointing at the
   homepage's Organization @id so this page is explicitly *about* the same
   business entity the rest of the graph describes. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/about#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${SITE_URL}/about`,
        },
      ],
    },
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#webpage`,
      url: `${SITE_URL}/about`,
      name: "About Wicket Travel",
      description:
        "Who Wicket Travel Limited is, what the business does and the principles it books flights by.",
      inLanguage: "en-GB",
      mainEntity: { "@id": ORGANIZATION_ID },
    },
  ],
};

const VALUES = [
  {
    icon: ScrollText,
    title: "Honesty, always",
    body: "The fare we quote is the fare you pay. We explain exactly what's included and never bury surprise charges in the small print.",
  },
  {
    icon: HeartHandshake,
    title: "People, not tickets",
    body: "Behind every booking is a real traveler — a family visiting home, a student starting a new term. We treat every enquiry that way.",
  },
  {
    icon: Sparkles,
    title: "Reliability you can plan around",
    body: "Fares checked with the airlines, clear written confirmations and a team that answers when a schedule changes.",
  },
  {
    icon: Lightbulb,
    title: "Always improving",
    body: "We listen to every review — good or bad — and use it to make the next booking faster and fairer.",
  },
];

const WHY_CHOOSE = [
  {
    icon: PiggyBank,
    title: "Best available fares",
    body: "We check pricing across leading airlines and quote you the best fare we can find for your route and dates.",
  },
  {
    icon: ShieldCheck,
    title: "Booked with the airline",
    body: "We book your seat with the airline on your behalf, and the airline issues your e-ticket — British Airways, Emirates, Qatar Airways and more.",
  },
  {
    icon: Users,
    title: "No hidden fees",
    body: "The total price we quote includes any service fee, and you agree it before you pay. Nothing is added at checkout.",
  },
  {
    icon: Headset,
    title: "24/7 on WhatsApp",
    body: "Call or message us on WhatsApp at any hour, or email us — whenever your plans need a hand.",
  },
];

export default function AboutPage() {
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
        <PageHero
          title="Trusted airline tickets, honest fares."
          lead="We find the best available fares across leading airlines and book your flight for you from the UK — one total price, agreed before you pay, and no hidden fees."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        />

        {/* Who we are & what we do */}
        <section className="section bg-neutral-000">
          <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="t-h2 text-balance text-primary-800">
                A UK flight-booking service built around one job: the best fare, done right
              </h2>
              <div className="t-body mt-6 space-y-4 text-text-secondary">
                <p>
                  <strong className="font-bold text-primary-800">
                    {BUSINESS.legalName}
                  </strong>{" "}
                  (company registration {BUSINESS.registration}) is a UK
                  travel agent. We find fares across leading airlines and book
                  flights on our customers&apos; behalf, for travellers from
                  across the UK — from {UK_DEPARTURES[0]} to {UK_DEPARTURES[2]}{" "}
                  and beyond.
                </p>
                <p>
                  Flights are our craft and our sole focus at Wicket Travel.
                  Whether you&apos;re flying home to see family, booking a
                  once-a-year holiday or arranging last-minute business
                  travel, our team checks pricing and availability, quotes you
                  a total price with the fare rules, and books with the airline
                  once you agree — with a real person on hand if you need one.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-e3 shadow-primary-800/10 ring-1 ring-neutral-300/60">
              <Image
                src="/about/above-the-clouds.jpg"
                alt="View from an airplane window above the clouds"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Who runs Wicket Travel — facts from the public register */}
        <section className="section bg-neutral-050" aria-labelledby="who-runs-heading">
          <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <h2 id="who-runs-heading" className="t-h2 text-balance text-primary-800">
                Who runs Wicket Travel
              </h2>
              <p className="t-body mt-4 text-text-secondary">
                Wicket Travel is run by {COMPANY.legalName}, a UK travel agency
                incorporated on {COMPANY.incorporated} and led by its two
                directors. Every detail here can be checked on the public
                register at Companies House.
              </p>
              <a
                href={COMPANY.companiesHouseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
              >
                View us on Companies House
              </a>
            </div>
            <dl className="card divide-y divide-neutral-300">
              {COMPANY_FACTS.map((f) => (
                <div key={f.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[160px_1fr] sm:gap-4">
                  <dt className="t-label-2 text-text-secondary">{f.label}</dt>
                  <dd className="t-body-sm text-primary-800">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Mission & values */}
        <section className="section bg-sand-500">
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 className="t-h2 text-balance text-primary-800">
                What guides every fare we find
              </h2>
              <p className="t-body mt-4 text-pretty text-text-on-sand">
                Our mission is simple: make booking a trusted airline ticket
                from the UK fast, fair and stress-free — every single time.
              </p>
            </div>

            {/* Vertical icon-cards. This is the page's ONE four-up card grid —
                see the "Why choose us" section below for why it isn't two. */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <div key={v.title} className="card h-full p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-md bg-primary-050 text-primary-700">
                    <v.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="t-h3 mt-6 text-primary-800">{v.title}</h3>
                  <p className="t-body-sm mt-2 text-text-secondary">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="section bg-neutral-000">
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 className="t-h2 text-balance text-primary-800">
                Four reasons travelers keep coming back
              </h2>
            </div>

            {/* Horizontal icon + text cards, two-up — deliberately NOT a second
                four-up vertical icon-card grid. Rendered that way, this section
                and "What guides every fare we find" directly above it were the
                same component twice in a row, which is the "identical icon-card
                grids" pattern PRODUCT.md's anti-references name by name. The
                layout here is the one already shipping on /contact (card, icon
                tile, copy beside it), so it reuses an existing site pattern
                rather than introducing a third card treatment. */}
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
              {WHY_CHOOSE.map((v) => (
                <div
                  key={v.title}
                  className="card flex h-full items-start gap-4 p-6"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary-050 text-primary-700">
                    <v.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block t-label-1 text-primary-800">
                      {v.title}
                    </span>
                    <span className="mt-1 block t-body-sm text-text-secondary">
                      {v.body}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sister brand */}
        <SisterBrand />

        {/* Trust signals */}
        <section className="section bg-sand-500">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="t-h2 text-balance text-primary-800">
                Real reviews, real protection
              </h2>
            </div>

            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="card h-full p-8 text-center">
                <span className="mx-auto flex w-fit gap-1" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="grid h-7 w-7 place-items-center rounded-xs"
                      style={{ background: starBackground(i, BUSINESS.ratingValue) }}
                    >
                      <Star className="h-4 w-4 fill-neutral-000 text-text-on-dark" />
                    </span>
                  ))}
                </span>
                <p className="mt-4 t-h3 text-primary-800">
                  {BUSINESS.ratingValue} out of 5
                </p>
                <p className="t-body-sm mt-1 text-text-secondary">
                  Rated &ldquo;Excellent&rdquo; on Trustpilot
                </p>
                <a
                  href={BUSINESS.sameAs[3]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                >
                  Read our reviews on Trustpilot
                </a>
              </div>
              <div className="card h-full p-8">
                <span className="grid h-12 w-12 place-items-center rounded-md bg-primary-050 text-primary-700">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="t-h3 mt-6 text-primary-800">Booking protection, made clear</h3>
                <p className="t-body-sm mt-2 text-text-secondary">
                  {COMPANY.legalName} does not hold an ATOL licence, and
                  flight-only bookings are not ATOL protected. Your ticket is
                  issued by the airline under its own conditions of carriage.
                  If you pay by credit card, Section 75 of the Consumer Credit
                  Act may cover bookings over £100; debit card payments may be
                  covered by your bank&apos;s chargeback scheme.
                </p>
                <Link
                  href="/terms"
                  className="mt-4 inline-block t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                >
                  How bookings work: our terms
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-neutral-000">
          <div className="container-page">
            {/* Flat navy, matching CallUsBand / ParentsBanner / VisaBanner. This
                carried `bg-gradient-to-br from-primary-800 via-primary-800
                to-primary-900` — the first two stops are the same colour, so it
                was a faint sheen in one corner of a flat panel: decoration, and
                the same no-op gradient already removed from those three. */}
            <div className="rounded-lg bg-primary-800 px-6 py-12 text-center shadow-e3 shadow-primary-900/30 ring-1 ring-neutral-000/10 sm:px-10 sm:py-16">
              <div className="mx-auto max-w-xl">
                <h2 className="t-h2 text-balance text-text-on-dark">Ready to find your fare?</h2>
                <p className="t-body mt-4 text-pretty text-primary-100">
                  Search fares from the UK, or tell us your dates and let our
                  team find the best deal for you.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/" className="btn btn-primary h-12 w-full px-8 focus-visible:ring-offset-primary-800 sm:w-auto">
                    Search flights
                  </Link>
                  <Link
                    href="/quote"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-000/20 bg-neutral-000/5 px-8 t-label-2 text-text-on-dark transition-colors duration-200 hover:bg-neutral-000/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:w-auto"
                  >
                    Get a quote
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
