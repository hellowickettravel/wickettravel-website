import { PHONE_LINK } from "@/lib/links";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  Check,
  ChevronRight,
  Clock,
  Headset,
  Minus,
  Phone,
  Plus,
  Route as RouteIcon,
  ShieldCheck,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FlightSearch from "@/components/FlightSearch";
import {
  AREA_SERVED_UK,
  BUSINESS,
  OG_BASE,
  ORGANIZATION_ID,
  SITE_URL,
  TWITTER_BASE,
  UK_DEPARTURES,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Flights from the UK",
  description:
    "Search flights from Heathrow, Manchester, Birmingham, Gatwick, Luton and Edinburgh — popular routes, flight times, cabin comparison and baggage answers.",
  alternates: { canonical: "/flights" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/flights`,
    title: "Flights from the UK | Wicket Travel",
    description:
      "Search live fares from UK airports, compare Economy, Premium Economy, Business and First, and get straight answers on baggage, changes and check-in.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Flights from the UK | Wicket Travel",
    description:
      "Live fares from Heathrow, Manchester, Birmingham, Gatwick, Luton and Edinburgh — with a real UK agent on the phone before you pay.",
  },
};

/* ── Popular routes ──────────────────────────────────────────────────────
   UK side is drawn from UK_DEPARTURES so this page and the rest of the site
   name the same six airports. Destinations match the carriers already
   featured on the homepage (FeaturedAirlineFares). Deliberately no fares or
   figures — PRODUCT.md principle 4 keeps pricing language soft everywhere.
   Flight times are scheduled block times, rounded, and the "best season"
   column is climate/demand guidance, not a promise. */
type RouteCard = {
  from: string;
  to: string;
  country: string;
  img: string;
  duration: string;
  stops: string;
  season: string;
};

const ROUTES: RouteCard[] = [
  {
    from: UK_DEPARTURES[0], // London Heathrow
    to: "Dubai",
    country: "United Arab Emirates",
    img: "/cities/dubai.jpg",
    duration: "About 7 hours",
    stops: "Direct",
    season: "November – March",
  },
  {
    from: UK_DEPARTURES[0], // London Heathrow
    to: "Delhi",
    country: "India",
    img: "/cities/delhi.jpg",
    duration: "About 8h 30m",
    stops: "Direct",
    season: "October – March",
  },
  {
    from: UK_DEPARTURES[1], // Manchester
    to: "Mumbai",
    country: "India",
    img: "/cities/mumbai.jpg",
    duration: "About 10h 30m",
    stops: "One stop",
    season: "November – February",
  },
  {
    from: UK_DEPARTURES[3], // London Gatwick
    to: "New York",
    country: "United States",
    img: "/cities/new-york.jpg",
    duration: "About 8 hours",
    stops: "Direct",
    season: "April – June, September – October",
  },
  {
    from: UK_DEPARTURES[0], // London Heathrow
    to: "Bangkok",
    country: "Thailand",
    img: "/cities/bangkok.jpg",
    duration: "About 11h 30m",
    stops: "Direct",
    season: "November – February",
  },
  {
    from: UK_DEPARTURES[2], // Birmingham
    to: "Cape Town",
    country: "South Africa",
    img: "/cities/cape-town.jpg",
    duration: "About 14h 30m",
    stops: "One stop",
    season: "November – March",
  },
];

/* ── Cabin comparison ────────────────────────────────────────────────────
   Compared by what you get, never by price. `true`/`false` render as a tick
   or a dash; everything else is short plain text. Values are the industry
   norms across the carriers we ticket — the note under the table says so,
   so nothing here reads as a guarantee for a specific fare. */
type Cell = string | boolean;
const CABIN_COLUMNS = ["Economy", "Premium Economy", "Business", "First"] as const;
const CABIN_ROWS: { feature: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  {
    feature: "Cabin baggage",
    cells: ["1 bag", "1 bag + personal item", "2 bags", "2 bags"],
  },
  {
    feature: "Checked baggage",
    cells: ["0–1 bag, fare-dependent", "1–2 bags", "2 bags", "2–3 bags"],
  },
  {
    feature: "Typical seat pitch",
    cells: ["30–32 in", "34–38 in", "Lie-flat", "Private suite"],
  },
  {
    feature: "Seat type",
    cells: [
      "Standard recliner",
      "Wider recliner, extra legroom",
      "Fully flat bed",
      "Suite, often with a door",
    ],
  },
  {
    feature: "Priority check-in",
    cells: [false, "Varies by airline", true, true],
  },
  { feature: "Priority boarding", cells: [false, "Varies by airline", true, true] },
  { feature: "Lounge access", cells: [false, false, true, true] },
  {
    feature: "Changes & flexibility",
    cells: [
      "Fee on most fares",
      "Fee, usually lower",
      "Often changeable",
      "Most flexible",
    ],
  },
  {
    feature: "Meal service",
    cells: ["Included on long-haul", "Upgraded menu", "Multi-course, on request", "Dine on demand"],
  },
];

/* ── Flights FAQ ─────────────────────────────────────────────────────────
   Deliberately page-local rather than added to lib/faq.ts: that file is the
   homepage FAQ and feeds the homepage's FAQPage JSON-LD, and these six
   questions are all ones it does not already answer (it covers how we find
   fares, India/Dubai routes, protection, fees, phone support and hotels).
   Answers stay plain text so the visible copy and the structured data below
   are the same string. */
type FlightFaq = {
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

const FLIGHT_FAQ: FlightFaq[] = [
  {
    question: "How much baggage is included with my flight ticket?",
    answer:
      "Cabin baggage is included on every ticket we issue; checked baggage depends on the airline, the cabin and the specific fare you book. Economy fares can include anything from no checked bag to one, while Premium Economy, Business and First almost always include one or more. We confirm the exact allowance for your ticket before you pay, and you can tick 'include checked baggage' in the search above so we only show fares that carry it.",
  },
  {
    question: "Can I change or cancel my flight after booking?",
    answer:
      "That is set by the airline's fare rules, not by us. Most Economy tickets allow a date change for a fee plus any difference in fare, and many are non-refundable once the free cancellation window has passed. Premium and Business fares are usually more flexible. Tell us what you need before you book and we will point you at a fare whose rules actually fit your plans, then handle the change with the airline if things move later.",
  },
  {
    question: "How early should I check in and get to the airport?",
    answer:
      "Online check-in usually opens 24 to 48 hours before departure and is the easiest way to secure your seat. At the airport, arrive around 2 hours before a short-haul departure and 3 hours before a long-haul one from a UK airport — more if you are travelling with children, need special assistance, or are flying at a peak time such as a school holiday.",
  },
  {
    question: "Do I need a visa for the country I am flying to?",
    answer:
      "Entry rules depend on your nationality, the country you are visiting and how long you are staying, so always check the requirements for your own passport before you fly. If you are flying to Dubai or elsewhere in the UAE, we handle UAE tourist and visit visa applications ourselves — start a visa enquiry and our team will tell you exactly what you need.",
    /* Points at the dedicated /visa page rather than the homepage's
       #dubai-visa banner anchor — same service, but the real page is the
       stronger internal-link target and carries the full enquiry form. */
    link: { href: "/visa", label: "Apply for a UAE visa" },
  },
  {
    question: "Can I choose my seats or book special assistance?",
    answer:
      "Yes. Seat selection is available on most airlines — some include it in the fare, others charge for it, and we will tell you which applies. Wheelchair assistance, medical requirements, dietary needs and travelling with an infant all need to be requested with the airline in advance, so call or WhatsApp our team once you have booked and we will arrange it for you.",
  },
  {
    question: "Is a direct flight always the better choice?",
    answer:
      "Not always. Direct is faster and simpler, and on routes like London to Dubai, Delhi or New York it is widely available. On routes such as Manchester to Mumbai or Birmingham to Cape Town, a one-stop itinerary through a major hub is often the only sensible option and can also be the better-value one. Set 'Direct only' in the search above if it matters to you, or leave it open and we will show you both.",
  },
];

/* ── Structured data ─────────────────────────────────────────────────────
   One @graph, same convention as the homepage (app/page.tsx) and /visa: the
   Service node names the flight-booking service itself and points `provider`
   at the homepage's Organization @id, so the whole site resolves to one
   business entity rather than an anonymous provider per page. Nothing here
   asserts a price, an availability window or a rating that isn't already
   published elsewhere on the site. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/flights#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Flights",
          item: `${SITE_URL}/flights`,
        },
      ],
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/flights#service`,
      name: "Flight booking from the UK",
      serviceType: "Airline ticket booking",
      url: `${SITE_URL}/flights`,
      description:
        "Wicket Travel compares live airline fares and books tickets for travellers departing UK airports, with a real agent available around the clock before and after booking.",
      provider: { "@id": ORGANIZATION_ID },
      /* The country, plus the six departure airports named in UK_DEPARTURES
         and on the page itself. `serviceArea` is superseded by `areaServed`,
         so both live in one list rather than two competing properties. */
      areaServed: [
        AREA_SERVED_UK,
        ...UK_DEPARTURES.map((airport) => ({
          "@type": "Airport",
          name: airport,
        })),
      ],
      audience: {
        "@type": "Audience",
        audienceType: "Travellers departing from the United Kingdom",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${SITE_URL}/flights`,
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
      "@id": `${SITE_URL}/flights#faq`,
      mainEntity: FLIGHT_FAQ.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

/* Facts already standing elsewhere on the site — the rating feeds the
   TravelAgency JSON-LD, the airline count matches the homepage trust bar,
   and the fee and support promises are the agency's own. */
const STATS = [
  {
    value: `${BUSINESS.ratingValue}/5`,
    label: `Rated by ${BUSINESS.reviewCount.toLocaleString("en-GB")} travelers`,
  },
  { value: "60+", label: "Trusted airlines compared" },
  { value: "Zero", label: "Hidden booking fees, ever" },
  { value: "24/7", label: "Real UK agents on the phone" },
];

function CabinCell({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <>
        <Check className="mx-auto h-4 w-4 text-success" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus className="mx-auto h-4 w-4 text-neutral-400" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className="t-body-sm text-text-secondary">{value}</span>;
}

export default function FlightsPage() {
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
        {/* ── Hero ─────────────────────────────────────────────────────────
            Was a text-only PageHero banner followed by a flat bg-primary-900
            strip for the search widget — every other service page (Hotels,
            Car Rentals, Visa) has a full-bleed photo hero, so Flights read as
            noticeably plainer despite being the site's actual funnel. Now
            matches that same photo-hero pattern (see app/hotels/page.tsx):
            full-bleed image, two-pass scrim, breadcrumb, h1, lead, trust
            pills. Reuses the homepage's own hero photo — an aircraft wing —
            since it's already self-hosted and it's literally the page's
            subject.

            The widget itself is NOT overlapped on the photo the way the
            homepage does it: that overlap's negative margins are tuned to
            the homepage's specific fixed/transparent header and photo
            padding (see Hero.tsx's own comment — "measured, not guessed").
            This page's header is the normal sticky one, not fixed, so
            copying those exact pixel values would reintroduce a real
            misalignment rather than fix one. Instead the widget sits in its
            own section directly below, full width, on the same left edge as
            the hero content (`container-page`, no extra `mx-auto`). */}
        <section className="relative isolate overflow-hidden py-12 sm:py-16 lg:py-20">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/hero/cabin-window-wing.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[55%_50%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 from-20% via-primary-900/80 via-60% to-primary-900/50" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 via-transparent via-40% to-primary-900/40" />
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
                  <ChevronRight className="h-3.5 w-3.5 text-primary-300" aria-hidden="true" />
                  <span aria-current="page" className="text-text-on-dark">
                    Flights
                  </span>
                </li>
              </ol>
            </nav>

            <div className="mt-6 max-w-2xl">
              <h1 className="t-h1 text-balance text-text-on-dark">
                Flights from the UK, booked by people who answer the phone.
              </h1>
              <p className="t-body-lg mt-4 max-w-xl text-primary-100">
                Search live fares from Heathrow, Manchester, Birmingham,
                Gatwick, Luton and Edinburgh — then talk to a real agent
                before you pay if you want a second opinion.
              </p>

              <ul className="mt-6 flex flex-wrap gap-3">
                {[
                  {
                    icon: Star,
                    label: `${BUSINESS.ratingValue}/5 from ${BUSINESS.reviewCount.toLocaleString("en-GB")} reviews`,
                  },
                  { icon: ShieldCheck, label: "No hidden booking fees" },
                  { icon: Headset, label: "Real UK agents, 24/7" },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-000/10 bg-neutral-000/5 px-4 py-2 t-label-2 text-primary-100"
                  >
                    <Icon className="h-4 w-4 text-accent-400" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Search — the same real widget the homepage runs. Plain white
            section, full width, same left edge as the hero content above
            (`container-page`, no `mx-auto` on the inner wrapper — see
            Hero.tsx's own note on why centring this box independently of the
            heading reads as a misalignment). */}
        <section
          id="search"
          aria-label="Flight search"
          className="scroll-mt-24 bg-neutral-000 py-8 sm:py-10"
        >
          <div className="container-page">
            <div className="w-full lg:max-w-[1116px]">
              <FlightSearch />
            </div>
          </div>
        </section>

        {/* ── Popular routes ─────────────────────────────────────────── */}
        <section className="section bg-neutral-000">
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 className="t-h2 text-primary-800">
                Popular routes from UK airports
              </h2>
              <p className="t-body mt-4 text-text-secondary">
                Six of the routes our travelers book most, with the flight time,
                whether it runs direct, and the months the weather and the
                schedules are usually at their best.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ROUTES.map((r) => (
                <a
                  key={`${r.from}-${r.to}`}
                  href="#search"
                  className="card card-hover group flex h-full flex-col overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-0.5"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={r.img}
                      alt={`Flights from ${r.from} to ${r.to}, ${r.country}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    {/* Same three-stop scrim the airline and city cards use, so
                        the route label always has a dependable base under it. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/20 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4">
                      <p className="t-caption text-primary-100">{r.from} to</p>
                      <h3 className="t-h3 text-text-on-dark">{r.to}</h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <dl className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Clock
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
                          aria-hidden="true"
                        />
                        <dt className="sr-only">Flight time</dt>
                        <dd className="t-body-sm text-text-secondary">
                          {r.duration}
                        </dd>
                      </div>
                      <div className="flex items-start gap-3">
                        <RouteIcon
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
                          aria-hidden="true"
                        />
                        <dt className="sr-only">Stops</dt>
                        <dd className="t-body-sm text-text-secondary">
                          {r.stops}
                        </dd>
                      </div>
                      <div className="flex items-start gap-3">
                        <CalendarRange
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
                          aria-hidden="true"
                        />
                        <dt className="sr-only">Best months to fly</dt>
                        <dd className="t-body-sm text-text-secondary">
                          Best {r.season}
                        </dd>
                      </div>
                    </dl>

                    <span className="mt-6 inline-flex items-center gap-2 t-label-2 text-accent-600 transition-colors group-hover:text-accent-500">
                      Search this route
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <p className="mt-8 text-center t-body-sm text-text-secondary">
              Flying somewhere else?{" "}
              <a
                href="#search"
                className="t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
              >
                Search any route from any UK airport
              </a>
              .
            </p>
          </div>
        </section>

        {/* ── Why book flights with us ───────────────────────────────────
            A stat strip beside the argument, not a fourth grid of icon cards
            — PRODUCT.md's anti-references name identical icon-card grids
            specifically, and this page already runs a photo-card grid above
            and a comparison table below. */}
        <section className="section bg-sand-500">
          <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="t-h2 text-primary-800">
                Why book your flight with Wicket Travel
              </h2>
              <div className="t-body mt-6 space-y-4 text-text-on-sand">
                <p>
                  Flights are our craft and our sole focus. We compare live
                  pricing across the world&apos;s leading airlines, show you the
                  best fare genuinely on offer for your route, and hand you
                  straight to the airline&apos;s own booking — no reseller
                  mark-up bolted on at the end.
                </p>
                <p>
                  And when a fare needs a human — a complicated routing, a date
                  that has to move, a family travelling together — a real UK
                  agent picks up, at any hour.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#search"
                  className="btn btn-primary h-12 w-full px-8 sm:w-auto"
                >
                  Search flights
                </a>
                <a
                  {...PHONE_LINK}
                  className="btn btn-outline h-12 w-full px-8 sm:w-auto"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {BUSINESS.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-sand-600">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-sand-500 px-5 py-8 text-center sm:px-6 sm:py-10"
                >
                  <p className="t-h1 text-primary-800">{s.value}</p>
                  <p className="mt-2 t-body-sm text-text-on-sand">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cabin comparison ───────────────────────────────────────── */}
        <section className="section bg-neutral-000">
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 className="t-h2 text-primary-800">
                Economy, Premium, Business or First?
              </h2>
              <p className="t-body mt-4 text-text-secondary">
                What actually changes between the four cabins you can pick in
                the search above — compared on what you get, not on what it
                costs.
              </p>
            </div>

            <div className="card mt-12 overflow-hidden">
              {/* The table is wider than a phone; it scrolls inside this box
                  rather than pushing the page sideways. */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[46rem] border-collapse text-left">
                  <caption className="sr-only">
                    Cabin classes compared by baggage, seat, priority services
                    and flexibility
                  </caption>
                  <thead>
                    <tr className="bg-primary-800">
                      <th
                        scope="col"
                        className="px-5 py-4 t-label-2 text-text-on-dark"
                      >
                        Feature
                      </th>
                      {CABIN_COLUMNS.map((c) => (
                        <th
                          key={c}
                          scope="col"
                          className="px-5 py-4 text-center t-label-2 text-text-on-dark"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CABIN_ROWS.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={
                          i % 2 === 1
                            ? "border-t border-neutral-300 bg-primary-050/40"
                            : "border-t border-neutral-300"
                        }
                      >
                        <th
                          scope="row"
                          className="px-5 py-4 t-label-2 text-primary-800"
                        >
                          {row.feature}
                        </th>
                        {row.cells.map((cell, j) => (
                          <td
                            key={CABIN_COLUMNS[j]}
                            className="px-5 py-4 text-center align-middle"
                          >
                            <CabinCell value={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mx-auto mt-6 max-w-3xl text-center t-body-sm text-text-secondary">
              Allowances, seat pitch and change rules are set by each airline
              and by the specific fare you book, so treat this as the shape of
              the four cabins rather than a promise about one ticket. We
              confirm exactly what applies to yours before you pay.
            </p>
          </div>
        </section>

        {/* ── Flights FAQ ────────────────────────────────────────────── */}
        <section
          id="flights-faq"
          aria-labelledby="flights-faq-heading"
          className="section scroll-mt-24 bg-sand-500"
        >
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 id="flights-faq-heading" className="t-h2 text-primary-800">
                Baggage, changes, check-in — answered
              </h2>
              <p className="t-body mt-4 text-text-on-sand">
                The questions our agents get asked most often once a flight is
                booked. Anything not covered here, call or WhatsApp us — day or
                night.
              </p>
            </div>

            {/* Native <details>, same accessible zero-JS accordion as the
                homepage FAQ. */}
            <div className="mx-auto mt-12 max-w-3xl divide-y divide-neutral-300 overflow-hidden rounded-lg border border-neutral-300/80 bg-neutral-000 shadow-e1">
              {FLIGHT_FAQ.map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-6 text-left font-bold text-primary-800 transition-colors hover:bg-primary-050/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden">
                    <span className="t-body">{item.question}</span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-050 text-primary-700 transition-all duration-200 group-open:rotate-45 group-open:bg-accent-500 group-open:text-text-on-dark">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-text-secondary">
                    <p className="t-body-sm">{item.answer}</p>
                    {item.link && (
                      <Link
                        href={item.link.href}
                        className="mt-3 inline-flex items-center gap-2 t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                      >
                        {item.link.label}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </details>
              ))}
            </div>

            <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row">
              <span className="inline-flex items-center gap-2 t-body-sm text-text-on-sand">
                <Headset className="h-4 w-4 text-accent-500" aria-hidden="true" />
                Still not sure? A real agent will talk it through.
              </span>
              <Link href="/contact" className="btn btn-outline btn-sm">
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
