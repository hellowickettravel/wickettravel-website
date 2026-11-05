import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarRange,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe2,
  MessageCircle,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Route as RouteIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PHONE_LINK, PORTAL_BOOKING_URL } from "@/lib/links";
import { BOOKING_DISCLOSURE } from "@/lib/legal";
import { OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";
import { portalRouteUrl } from "@/lib/routeLinks";
import {
  getRoute,
  ROUTES,
  ROUTES_REVIEWED,
  type FlightRoute,
} from "@/lib/routes";

type Props = { params: Promise<{ route: string }> };

/* Every route page is built at build time from lib/routes.ts; an unknown slug
   is a 404 rather than an on-demand page with nothing in it. */
export const dynamicParams = false;

export function generateStaticParams() {
  return ROUTES.map((r) => ({ route: r.slug }));
}

function titleFor(r: FlightRoute) {
  return `Flights from ${r.fromCity} to ${r.toCity}`;
}

function descriptionFor(r: FlightRoute) {
  const nonstop = r.nonstopAirlines.length
    ? `non-stop with ${r.nonstopAirlines.join(", ")}`
    : "usually with one stop";
  return `${r.fromCity} to ${r.toCity} (${r.toAirport.code}): ${r.flightTime.toLowerCase()}, ${nonstop}. Best time to fly, entry rules and a quote from our team.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { route } = await params;
  const r = getRoute(route);
  if (!r) return {};
  const title = titleFor(r);
  const description = descriptionFor(r);
  const url = `${SITE_URL}/flights/${r.slug}`;
  return {
    title,
    description,
    alternates: { canonical: `/flights/${r.slug}` },
    openGraph: { ...OG_BASE, url, title: `${title} | Wicket Travel`, description },
    twitter: { ...TWITTER_BASE, title: `${title} | Wicket Travel`, description },
  };
}

export default async function RoutePage({ params }: Props) {
  const { route } = await params;
  const r = getRoute(route);
  if (!r) notFound();

  const url = `${SITE_URL}/flights/${r.slug}`;
  const quoteUrl = portalRouteUrl(PORTAL_BOOKING_URL, {
    from: r.fromAirports[0].code,
    to: r.toAirport.code,
  });
  const others = ROUTES.filter((o) => o.slug !== r.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Flights", item: `${SITE_URL}/flights` },
          { "@type": "ListItem", position: 3, name: titleFor(r), item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: r.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  const glance = [
    {
      icon: PlaneTakeoff,
      label: "From",
      value: r.fromAirports.map((a) => `${a.name} (${a.code})`).join(", "),
    },
    { icon: PlaneLanding, label: "To", value: `${r.toAirport.name} (${r.toAirport.code})` },
    { icon: Clock, label: "Flight time", value: r.flightTime },
    {
      icon: RouteIcon,
      label: "Non-stop airlines",
      value: r.nonstopAirlines.length ? r.nonstopAirlines.join(", ") : "None we can promise year-round",
    },
    { icon: Globe2, label: "Time difference", value: r.timeDifference },
    { icon: CalendarRange, label: "Best months", value: r.bestMonths },
  ];

  const linkClass =
    "font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main className="flex-1">
        {/* Hero — same full-bleed photo + two-pass scrim pattern as /flights. */}
        <section className="relative isolate overflow-hidden py-12 sm:py-16 lg:py-20">
          <div className="absolute inset-0 -z-10">
            <Image src={r.img} alt="" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 from-20% via-primary-900/80 via-60% to-primary-900/50" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 via-transparent via-40% to-primary-900/40" />
          </div>
          <div className="container-page relative">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 t-label-3 text-primary-200">
                <li>
                  <Link href="/" className="rounded-xs transition-colors hover:text-text-on-dark">
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-primary-300" aria-hidden="true" />
                  <Link href="/flights" className="rounded-xs transition-colors hover:text-text-on-dark">
                    Flights
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-primary-300" aria-hidden="true" />
                  <span aria-current="page" className="text-text-on-dark">
                    {r.fromCity} to {r.toCity}
                  </span>
                </li>
              </ol>
            </nav>
            <div className="mt-6 max-w-2xl">
              <h1 className="t-h1 text-balance text-text-on-dark">{titleFor(r)}</h1>
              <p className="t-body-lg mt-4 max-w-xl text-primary-100">{r.intro[0]}</p>
              <ul className="mt-6 flex flex-wrap gap-3">
                {[r.flightTime, r.stopsLabel, `${r.fromAirports[0].code} → ${r.toAirport.code}`].map(
                  (label) => (
                    <li
                      key={label}
                      className="inline-flex items-center rounded-full border border-neutral-000/10 bg-neutral-000/5 px-4 py-2 t-label-2 text-primary-100"
                    >
                      {label}
                    </li>
                  )
                )}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={quoteUrl} className="btn btn-primary h-12 px-8">
                  Get a quote for this route
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  {...PHONE_LINK}
                  className="btn h-12 border border-neutral-000/30 px-8 text-text-on-dark hover:bg-neutral-000/10"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* At a glance + the route story */}
        <section className="section bg-neutral-000">
          <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
            <div className="min-w-0 space-y-10">
              <div>
                <h2 className="t-h2 text-primary-800">About this route</h2>
                <p className="t-body mt-4 text-text-secondary">{r.intro[1]}</p>
              </div>
              <div>
                <h3 className="t-h3 text-primary-800">Non-stop or one stop?</h3>
                <p className="t-body mt-3 text-text-secondary">{r.nonstopNote}</p>
                <p className="t-body mt-3 text-text-secondary">{r.oneStop}</p>
              </div>
              <div>
                <h3 className="t-h3 text-primary-800">When to fly</h3>
                <p className="t-body mt-3 text-text-secondary">{r.bestTime}</p>
              </div>
              <div>
                <h3 className="t-h3 text-primary-800">Good to know</h3>
                <ul className="t-body mt-3 list-disc space-y-2 pl-6 text-text-secondary marker:text-accent-500">
                  {r.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="t-h3 text-primary-800">Passports and visas</h3>
                <p className="t-body mt-3 text-text-secondary">{r.entry.text}</p>
                <p className="t-body-sm mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  <a href={r.entry.govUkUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    GOV.UK entry requirements for {r.toCountry}
                    <ExternalLink className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  {r.entry.visaLink && (
                    <Link href="/visa" className={linkClass}>
                      Our UAE visa service
                    </Link>
                  )}
                </p>
              </div>
            </div>

            <aside className="min-w-0">
              <div className="card p-6 lg:sticky lg:top-24">
                <h2 className="t-h4 text-primary-800">At a glance</h2>
                <dl className="mt-4 space-y-4">
                  {glance.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                      <div className="min-w-0">
                        <dt className="t-label-3 uppercase text-text-secondary">{label}</dt>
                        <dd className="t-body-sm text-primary-800">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 border-t border-neutral-300 pt-4 t-caption text-text-secondary">
                  No fare is shown because fares change every day. Ask us for
                  today&apos;s fare: we quote the total price before you pay.
                </p>
                <a href={quoteUrl} className="btn btn-primary mt-4 h-12 w-full">
                  Get a quote
                </a>
              </div>
            </aside>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="route-faq" className="section bg-sand-500">
          <div className="container-page">
            <h2 id="route-faq" className="t-h2 text-center text-primary-800">
              {r.fromCity} to {r.toCity}: your questions
            </h2>
            <div className="mx-auto mt-10 max-w-3xl divide-y divide-neutral-300 overflow-hidden rounded-lg border border-neutral-300/80 bg-neutral-000 shadow-e1">
              {r.faq.map((f) => (
                <details key={f.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-6 text-left font-bold text-primary-800 transition-colors hover:bg-primary-050/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden">
                    <span className="t-body">{f.question}</span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-050 text-primary-700 transition-all duration-200 group-open:rotate-45 group-open:bg-accent-500 group-open:text-text-on-dark">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="px-6 pb-6 t-body-sm text-text-secondary">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* How booking works + other routes */}
        <section className="section bg-neutral-000">
          <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <h2 className="t-h3 text-primary-800">How booking with us works</h2>
              <p className="t-body-sm mt-3 text-text-secondary">{BOOKING_DISCLOSURE[0]}</p>
              <p className="t-body-sm mt-3 text-text-secondary">
                The full details are in our{" "}
                <Link href="/terms" className={linkClass}>
                  terms and conditions
                </Link>
                .
              </p>
              <p className="mt-6 t-caption text-text-secondary">
                Last reviewed {ROUTES_REVIEWED}. Airline schedules change, so
                we confirm the airlines and times on your dates when we quote.
              </p>
            </div>
            <div className="min-w-0">
              <h2 className="t-h3 text-primary-800">More routes</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/flights/${o.slug}`}
                      className="group flex items-center justify-between gap-2 rounded-sm px-3 py-2 t-body-sm text-primary-800 transition-colors hover:bg-primary-050"
                    >
                      {o.fromCity} to {o.toCity}
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-accent-500 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
