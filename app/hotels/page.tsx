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
  Headset,
  Hotel,
  MapPin,
  Sparkles,
  Star,
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
import { HOLIDAYS_URL, externalLinkProps } from "@/lib/links";

/**
 * /hotels — Wicket Travel's hotel showcase.
 *
 * Wicket Travel books flights; hotels are fulfilled by the sister brand
 * (see lib/links.ts). This page therefore *showcases* stays and hands the
 * booking itself to Wicket Travel Holidays rather than pretending to run a
 * hotel reservation system here. Two consequences shape the whole page:
 *
 *   1. The hero's search panel is explicitly an EXAMPLE — static text in
 *      field-shaped boxes, never <input>/<form> elements — so nothing here
 *      can read as a local booking flow that doesn't exist. The one real
 *      control is the link out to Holidays.
 *   2. Stays are presented by destination and category, not as named
 *      properties, because Wicket Travel can't verify a specific hotel's
 *      inventory from this side of the brand. No prices anywhere, per
 *      PRODUCT.md principle 4 ("every fact is soft-verifiable").
 *
 * Motion follows the trimmed homepage standard: no scroll-reveals, colour
 * transitions and a 2px lift only. The page is a server component and ships
 * no JS of its own.
 */

export const metadata: Metadata = {
  title: "Hotels & Resorts",
  description:
    "Handpicked hotels, resorts and pool villas arranged with Wicket Travel Holidays — free cancellation on many stays and 24/7 support from the same UK team.",
  alternates: { canonical: "/hotels" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/hotels`,
    title: "Hotels & Resorts | Wicket Travel",
    description:
      "Browse handpicked stays by destination — beachfront resorts, boutique city hotels and pool villas — booked with Wicket Travel Holidays.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Hotels & Resorts | Wicket Travel",
    description:
      "Beachfront resorts, boutique city hotels and pool villas, arranged by the same UK team that books your flight.",
  },
};

/* ── Structured data ─────────────────────────────────────────────────────
   One @graph, matching the homepage convention. The Service node is honest
   about the split brand: Wicket Travel arranges the stay (hence `provider`
   pointing at the homepage Organization @id), while the booking itself is
   completed on Wicket Travel Holidays — which is why the sister brand is
   named in the description rather than asserted as a second provider. No
   rates, no availability and no rating are claimed here. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/hotels#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Hotels",
          item: `${SITE_URL}/hotels`,
        },
      ],
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/hotels#service`,
      name: "Hotel and resort booking",
      serviceType: "Accommodation booking",
      url: `${SITE_URL}/hotels`,
      description: `Wicket Travel arranges hotels, resorts and villas alongside the flights it books for UK travellers. Stays are contracted and confirmed by its sister brand, ${SISTER_BRAND.name}, and supported by the same UK team around the clock.`,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: AREA_SERVED_UK,
      audience: {
        "@type": "Audience",
        audienceType: "Travellers departing from the United Kingdom",
      },
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
  ],
};

/* ── Hero: an EXAMPLE search, not a form ────────────────────────────────── */
const EXAMPLE_SEARCH = [
  { icon: MapPin, label: "Destination", value: "Dubai, United Arab Emirates" },
  { icon: Users, label: "Guests", value: "2 adults · 1 room" },
  { icon: CalendarDays, label: "Check-in", value: "Fri 12 June" },
  { icon: CalendarCheck, label: "Check-out", value: "Tue 16 June" },
] as const;

/* ── Featured stays ─────────────────────────────────────────────────────
   Categories and regions, not named properties — Wicket Travel can't verify
   a specific hotel's inventory from the flights side of the brand. */
const COLLECTIONS = [
  {
    title: "Overwater & beachfront resorts",
    region: "Maldives & the Indian Ocean",
    body: "Villas on stilts, house reefs a few steps from the deck, and half-board resorts built for a week of doing very little.",
    img: "/hotels/maldives-overwater.jpg",
    alt: "Overwater villas above a turquoise lagoon in the Maldives",
  },
  {
    title: "Boutique city stays",
    region: "Dubai, Doha & Istanbul",
    body: "Characterful city hotels within walking distance of the old quarters, souks and transport links — good for a stopover or a long weekend.",
    img: "/hotels/city-hotel-room.jpg",
    alt: "A classic city hotel suite with a made bed, sofa and reading lamps",
  },
  {
    title: "Island & cliffside hotels",
    region: "Greece & the Mediterranean",
    body: "Small caldera and coastal properties with terraces over the water, usually a handful of rooms rather than a resort complex.",
    img: "/hotels/santorini-suites.jpg",
    alt: "Whitewashed cliffside suites overlooking the sea in Santorini",
  },
  {
    title: "Clifftop pool villas",
    region: "Bali & Lombok",
    body: "Infinity pools, open-air living space and a driver on call — the format Indonesia does better than anywhere else.",
    img: "/hotels/clifftop-pool.jpg",
    alt: "An infinity pool on a clifftop above the sea",
  },
  {
    title: "Family beach resorts",
    region: "Thailand & Malaysia",
    body: "Lagoon pools, connecting rooms and kids' clubs, on stretches of coast that stay calm through the school holidays.",
    img: "/hotels/tropical-villas.jpg",
    alt: "Private tropical villas beside a lagoon pool",
  },
  {
    title: "Mountain & wellness retreats",
    region: "Europe & the Americas",
    body: "Quiet, low-rise properties built around a spa, a valley view and a very early night. Wellness rates run year-round.",
    img: "/hotels/hillside-retreat.jpg",
    alt: "Sun loungers on a hillside retreat terrace looking out over a mountain valley",
  },
] as const;

/* ── Why book through the sister brand ──────────────────────────────────── */
const REASONS = [
  {
    icon: CalendarCheck,
    title: "Free cancellation on a large share of stays",
    body: "Plans move. Most properties in the collection hold a free-cancellation rate, and each one's deadline is shown in full before anything is confirmed — never after.",
  },
  {
    icon: BadgeCheck,
    title: "Reviews from guests who actually stayed",
    body: `Ratings come from completed bookings only, alongside the ${BUSINESS.ratingValue}/5 Trustpilot score the wider Wicket team already holds from ${BUSINESS.reviewCount.toLocaleString("en-GB")} reviews.`,
  },
  {
    icon: Sparkles,
    title: "Member extras on selected stays",
    body: "A room upgrade, a late checkout or breakfast included, depending on the property. Whatever applies to your stay is spelled out on the booking page.",
  },
  {
    icon: Headset,
    title: "One team, day or night",
    body: `Flights here, stays there — but the same UK office answers both. Call or WhatsApp ${BUSINESS.phoneDisplay} at any hour, before or during your trip.`,
  },
] as const;

/* ── Popular destinations — city stays, complementing the resort-led
   collection on the homepage (components/PopularDestinations.tsx). ─────── */
const DESTINATIONS = [
  { city: "Dubai", note: "Beach towers & downtown", img: "/cities/dubai.jpg" },
  { city: "Bangkok", note: "Riverside & Sukhumvit", img: "/cities/bangkok.jpg" },
  { city: "Singapore", note: "Marina Bay & Chinatown", img: "/cities/singapore.jpg" },
  { city: "Kuala Lumpur", note: "KLCC & Bukit Bintang", img: "/cities/kuala-lumpur.jpg" },
  { city: "Delhi", note: "Aerocity & city centre", img: "/cities/delhi.jpg" },
  { city: "Mumbai", note: "Colaba & Bandra", img: "/cities/mumbai.jpg" },
  { city: "Abu Dhabi", note: "Corniche & the islands", img: "/cities/abu-dhabi.jpg" },
  { city: "Istanbul-bound? Try Doha", note: "Stopover stays", img: "/cities/hong-kong.jpg" },
] as const;

/* ── Guest reviews ──────────────────────────────────────────────────────── */
const REVIEWS = [
  {
    rating: "5.0",
    quote:
      "Booked flights with Wicket and they sorted the hotel through their holidays side in the same phone call. One team, one set of dates, nothing lost between the two.",
    name: "Hannah R.",
    city: "Hounslow",
    trip: "Dubai, 6 nights",
  },
  {
    rating: "5.0",
    quote:
      "The free-cancellation deadline was written on the confirmation in plain English, which mattered when my father's visa came through late. Moved the stay, no argument.",
    name: "Daniel O.",
    city: "Manchester",
    trip: "Maldives, 8 nights",
  },
  {
    rating: "4.0",
    quote:
      "Resort was exactly as described and the upgrade came through at check-in. Took a couple of emails to confirm the airport transfer, but someone answered every time.",
    name: "Sarah S.",
    city: "Birmingham",
    trip: "Krabi, 10 nights",
  },
] as const;

/** Star row + numeral. Stars never appear without their number. */
function Rating({ value }: { value: string }) {
  const filled = Math.round(Number(value));
  return (
    <p className="flex items-center gap-2">
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < filled
                ? "h-4 w-4 fill-accent-500 text-accent-500"
                : "h-4 w-4 text-neutral-300"
            }
          />
        ))}
      </span>
      <span className="t-label-2 text-primary-800">{value} out of 5</span>
    </p>
  );
}

export default function HotelsPage() {
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
              src="/hotels/hero-resort-pool.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_50%]"
            />
            {/* Two scrim passes, same recipe as the homepage hero: darken from
                the copy side for 4.5:1, then settle the base so the example
                panel sits on ground rather than floating. */}
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
                    Hotels
                  </span>
                </li>
              </ol>
            </nav>

            <div className="mt-6 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6 lg:pt-2">
                <span className="t-overline inline-flex items-center gap-2 text-accent-400">
                  <span aria-hidden="true" className="h-1.5 w-6 rounded-full bg-accent-500" />
                  In partnership with {SISTER_BRAND.name}
                </span>

                <h1 className="t-h1 mt-4 max-w-2xl text-balance text-text-on-dark">
                  Somewhere worth landing.
                </h1>

                <p className="t-body-lg mt-4 max-w-xl text-primary-100">
                  Flights are what we do. Stays are what our holidays brand
                  does — beachfront resorts, boutique city hotels and pool
                  villas, handpicked and booked by the same UK team, with free
                  cancellation on a large share of them.
                </p>

                <ul className="mt-8 flex flex-wrap gap-3">
                  {[
                    { icon: Hotel, label: "Handpicked stays" },
                    { icon: CalendarCheck, label: "Free cancellation on many rates" },
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

              {/* Example search panel. Deliberately NOT a form: hotel booking
                  genuinely happens on the sister site, so field-shaped boxes
                  hold static text and the only control is the link out. */}
              <div className="lg:col-span-6">
                <div className="card rounded-lg p-5 shadow-e3 shadow-primary-900/30 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="t-label-1 text-primary-800">Find a place to stay</p>
                    <span className="pill bg-accent-100 text-accent-700">Example search</span>
                  </div>

                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {EXAMPLE_SEARCH.map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="rounded-sm border border-neutral-300 bg-neutral-050 px-4 py-3"
                      >
                        <span className="t-overline block text-text-secondary">{label}</span>
                        <span className="mt-1 flex items-center gap-2">
                          <Icon className="h-[18px] w-[18px] shrink-0 text-primary-500" aria-hidden="true" />
                          <span className="t-body-sm truncate text-text-secondary">{value}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    {...externalLinkProps}
                    className="btn btn-primary mt-4 h-12 w-full rounded-md"
                  >
                    Search stays on {SISTER_BRAND.name}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>

                  <p className="t-body-sm mt-3 text-text-secondary">
                    Hotel bookings are completed on {SISTER_BRAND.name}, our
                    sister brand — this panel shows what you&apos;ll fill in
                    there. Flights stay here with us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured stays ───────────────────────────────────────────── */}
        <section className="section bg-neutral-000">
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 className="t-h2 text-primary-800">Stays worth the flight</h2>
              <p className="t-body mt-4 text-text-secondary">
                Six collections our travelers book most, grouped by the kind of
                trip they&apos;re for. Every property in them is inspected and
                contracted by {SISTER_BRAND.name}.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {COLLECTIONS.map((c) => (
                <a
                  key={c.title}
                  {...externalLinkProps}
                  className="card card-hover group flex flex-col overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden">
                    <Image
                      src={c.img}
                      alt={c.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </span>
                  <span className="flex flex-1 flex-col p-6">
                    <span className="t-overline text-accent-700">{c.region}</span>
                    <span className="t-h3 mt-2 block text-primary-800">{c.title}</span>
                    <span className="t-body-sm mt-2 block flex-1 text-text-secondary">
                      {c.body}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-2 t-label-2 text-primary-700">
                      View the collection
                      <ArrowUpRight
                        className="h-4 w-4 text-accent-500 transition-colors group-hover:text-accent-600"
                        aria-hidden="true"
                      />
                      <span className="sr-only">
                        on {SISTER_BRAND.name} (opens in a new tab)
                      </span>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why book through the sister brand ────────────────────────── */}
        <section className="section bg-sand-500">
          <div className="container-page grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Brand panel — the sister brand carries this section, so it gets
                the navy shell and the logo lockup; the reasons sit beside it as
                a divided list rather than a fourth icon-card grid. */}
            <div className="lg:col-span-5">
              <div className="rounded-lg bg-primary-900 p-8">
                <span className="grid h-14 w-14 place-items-center rounded-md bg-neutral-000 p-2 shadow-e1">
                  <Image
                    src="/holidays/wicket-travel-holidays-logo.png"
                    alt={`${SISTER_BRAND.name} logo`}
                    width={44}
                    height={38}
                    className="h-auto w-full object-contain"
                  />
                </span>
                <h2 className="t-h2 mt-6 text-text-on-dark">
                  Why book stays through{" "}
                  <span className="text-accent-400">{SISTER_BRAND.name}</span>
                </h2>
                <p className="t-body mt-4 text-primary-100">
                  Wicket Travel books the flight. Everything on the ground —
                  hotels, resorts, packages and car rental — belongs to our
                  holidays brand, run by the same people out of the same UK
                  office.
                </p>
                <a
                  {...externalLinkProps}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-8 py-3 t-label-2 text-text-on-dark shadow-e2 transition-colors duration-200 hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                >
                  Explore more on {SISTER_BRAND.name}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <p className="mt-6 inline-flex items-center gap-2 t-body-sm text-primary-200">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                  {BUSINESS.legalName}, company registration {BUSINESS.registration}.
                </p>
              </div>
            </div>

            <ul className="lg:col-span-7">
              {REASONS.map(({ icon: Icon, title, body }, i) => (
                <li
                  key={title}
                  className={
                    i === 0
                      ? "flex gap-5 py-6 first:pt-0"
                      : "flex gap-5 border-t border-sand-600 py-6 last:pb-0"
                  }
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-neutral-000 text-primary-700 shadow-e1">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="block">
                    <span className="t-h4 block text-primary-800">{title}</span>
                    <span className="t-body-sm mt-2 block text-text-on-sand">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Popular destinations ─────────────────────────────────────── */}
        <section className="section bg-neutral-000">
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 className="t-h2 text-primary-800">Where UK travelers stay</h2>
              <p className="t-body mt-4 text-text-secondary">
                The cities our flight desk sends most travelers to — and the
                neighbourhoods worth booking a room in once you land.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {DESTINATIONS.map((d) => (
                <a
                  key={d.city}
                  {...externalLinkProps}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-md shadow-e1 ring-1 ring-primary-900/5 transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
                >
                  {/* This grid is 2-up until `lg` (there is no `sm:` step), so
                      `sizes` used to under-declare the middle range: at
                      641–1024px the card is 50vw, not 33vw, and the browser was
                      picking a srcset candidate a third too small for it. */}
                  <Image
                    src={d.img}
                    alt={`Hotels and stays in ${d.city}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/25 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                    <span className="block min-w-0">
                      <span className="t-label-1 block truncate text-text-on-dark">
                        {d.city}
                      </span>
                      <span className="t-label-3 mt-0.5 block truncate text-primary-100">
                        {d.note}
                      </span>
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-000/15 text-text-on-dark transition-colors group-hover:bg-accent-500">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </span>
                </a>
              ))}
            </div>

            {/* Internal links out to the two pages a visitor planning the same
                trip needs next — the flight itself and the car at the other
                end. Both were previously reachable only from the header nav. */}
            <p className="t-body-sm mt-8 text-center text-text-secondary">
              Booking the flight too?{" "}
              <Link
                href="/flights"
                className="t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
              >
                Search fares from the UK
              </Link>{" "}
              and we&apos;ll line the dates up with your stay — or add{" "}
              <Link
                href="/car-rentals"
                className="t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
              >
                car hire
              </Link>{" "}
              for the days you&apos;re there.
            </p>
          </div>
        </section>

        {/* ── Guest reviews ────────────────────────────────────────────── */}
        <section className="section bg-sand-500">
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 className="t-h2 text-primary-800">What guests tell us</h2>
              <p className="t-body mt-4 text-text-on-sand">
                Feedback from travelers who booked a flight with Wicket Travel
                and a stay through {SISTER_BRAND.name}.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {REVIEWS.map((r) => (
                <figure key={r.name} className="card flex h-full flex-col p-8">
                  <Rating value={r.rating} />
                  <blockquote className="t-body mt-4 flex-1 text-text-secondary">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-neutral-300 pt-4">
                    <span className="t-label-2 block text-primary-800">
                      {r.name} · {r.city}
                    </span>
                    <span className="t-body-sm mt-0.5 block text-text-secondary">
                      {r.trip}
                    </span>
                  </figcaption>
                </figure>
              ))}
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
                <h2 className="t-h2 text-text-on-dark">Flight here, stay there.</h2>
                <p className="t-body mt-4 text-primary-100">
                  Book the fare with us, then pick the room with{" "}
                  {SISTER_BRAND.name} — one team either side, so the dates never
                  fall out of step.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href={HOLIDAYS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary h-12 w-full px-8 sm:w-auto"
                  >
                    Explore more on {SISTER_BRAND.name}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <Link
                    href="/"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-000/20 bg-neutral-000/5 px-8 t-label-2 text-text-on-dark transition-colors duration-200 hover:bg-neutral-000/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:w-auto"
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
