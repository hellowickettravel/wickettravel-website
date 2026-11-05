"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";
import { PORTAL_BOOKING_URL } from "@/lib/links";
import { DEST_ROUTE_SLUG, portalRouteUrl } from "@/lib/routeLinks";

/**
 * "Today's best fares" region browser. Tabs switch the region; six destination
 * cards animate in. Fares stay soft and number-free — we surface routes, not
 * prices. Landmark shots without a reliable Unsplash match are stored locally
 * in /public/cities (Wikimedia Commons).
 */
/* `code` is the airport (or city) code handed to the booking portal; `side`
   says whether the card is a UK departure ("from") or a destination ("to").
   Ajman has no airport of its own, so its card starts from Sharjah (SHJ),
   the nearest one. Destinations with a route page (lib/routes.ts) link
   there; the rest open the portal's booking request with the city filled in,
   the same hand-off the search widget makes. */
type Dest = {
  city: string;
  code: string;
  side: "from" | "to";
  country: string;
  img: string;
};

function destHref(d: Dest): string {
  if (d.side === "to") {
    const slug = DEST_ROUTE_SLUG[d.code];
    if (slug) return `/flights/${slug}`;
  }
  return portalRouteUrl(PORTAL_BOOKING_URL, { [d.side]: d.code });
}

const REGIONS: { name: string; cities: Dest[] }[] = [
  {
    name: "United Kingdom",
    cities: [
      {
        city: "Heathrow",
        code: "LHR",
        side: "from",
        country: "London, UK",
        img: "/cities/heathrow.jpg",
      },
      {
        city: "Manchester",
        code: "MAN",
        side: "from",
        country: "United Kingdom",
        img: "/cities/manchester.jpg",
      },
      {
        city: "Birmingham",
        code: "BHX",
        side: "from",
        country: "United Kingdom",
        img: "/cities/birmingham.jpg",
      },
      {
        city: "Gatwick",
        code: "LGW",
        side: "from",
        country: "London, UK",
        img: "/cities/gatwick.jpg",
      },
      {
        city: "Luton",
        code: "LTN",
        side: "from",
        country: "London, UK",
        img: "/cities/luton.jpg",
      },
      {
        city: "Edinburgh",
        code: "EDI",
        side: "from",
        country: "Scotland, UK",
        img: "/cities/edinburgh.jpg",
      },
    ],
  },
  {
    name: "United States",
    cities: [
      {
        city: "New York",
        code: "NYC",
        side: "to",
        country: "United States",
        img: "/cities/new-york.jpg",
      },
      {
        city: "Los Angeles",
        code: "LAX",
        side: "to",
        country: "United States",
        img: "/cities/los-angeles.jpg",
      },
      {
        city: "Chicago",
        code: "ORD",
        side: "to",
        country: "United States",
        img: "/cities/chicago.jpg",
      },
      {
        city: "Miami",
        code: "MIA",
        side: "to",
        country: "United States",
        img: "/cities/miami.jpg",
      },
      {
        city: "San Francisco",
        code: "SFO",
        side: "to",
        country: "United States",
        img: "/cities/san-francisco.jpg",
      },
      {
        city: "Washington DC",
        code: "IAD",
        side: "to",
        country: "United States",
        img: "/cities/washington-dc.jpg",
      },
    ],
  },
  {
    name: "United Arab Emirates",
    cities: [
      {
        city: "Dubai",
        code: "DXB",
        side: "to",
        country: "UAE",
        img: "/cities/dubai.jpg",
      },
      {
        city: "Abu Dhabi",
        code: "AUH",
        side: "to",
        country: "UAE",
        img: "/cities/abu-dhabi.jpg",
      },
      {
        city: "Sharjah",
        code: "SHJ",
        side: "to",
        country: "UAE",
        img: "/cities/sharjah.jpg",
      },
      {
        city: "Ras Al Khaimah",
        code: "RKT",
        side: "to",
        country: "UAE",
        img: "/cities/ras-al-khaimah.jpg",
      },
      {
        city: "Ajman",
        code: "SHJ",
        side: "to",
        country: "UAE",
        img: "/cities/ajman.jpg",
      },
      {
        city: "Fujairah",
        code: "FJR",
        side: "to",
        country: "UAE",
        img: "/cities/fujairah.jpg",
      },
    ],
  },
  {
    name: "Asia",
    cities: [
      {
        city: "Tokyo",
        code: "TYO",
        side: "to",
        country: "Japan",
        img: "/cities/tokyo.jpg",
      },
      {
        city: "Singapore",
        code: "SIN",
        side: "to",
        country: "Singapore",
        img: "/cities/singapore.jpg",
      },
      {
        city: "Bangkok",
        code: "BKK",
        side: "to",
        country: "Thailand",
        img: "/cities/bangkok.jpg",
      },
      {
        city: "Kuala Lumpur",
        code: "KUL",
        side: "to",
        country: "Malaysia",
        img: "/cities/kuala-lumpur.jpg",
      },
      {
        city: "Hong Kong",
        code: "HKG",
        side: "to",
        country: "Hong Kong SAR",
        img: "/cities/hong-kong.jpg",
      },
      {
        city: "Seoul",
        code: "ICN",
        side: "to",
        country: "South Korea",
        img: "/cities/seoul.jpg",
      },
    ],
  },
  {
    name: "India",
    cities: [
      {
        city: "Delhi",
        code: "DEL",
        side: "to",
        country: "India",
        img: "/cities/delhi.jpg",
      },
      {
        city: "Mumbai",
        code: "BOM",
        side: "to",
        country: "India",
        img: "/cities/mumbai.jpg",
      },
      {
        city: "Bengaluru",
        code: "BLR",
        side: "to",
        country: "India",
        img: "/cities/bangalore.jpg",
      },
      {
        city: "Hyderabad",
        code: "HYD",
        side: "to",
        country: "India",
        img: "/cities/hyderabad.jpg",
      },
      {
        city: "Chennai",
        code: "MAA",
        side: "to",
        country: "India",
        img: "/cities/chennai.jpg",
      },
      {
        city: "Kochi",
        code: "COK",
        side: "to",
        country: "India",
        img: "/cities/kochi.jpg",
      },
    ],
  },
];

function DestCard({ d }: { d: Dest }) {
  const { t } = useI18n();
  return (
    /* 2px CSS lift instead of a framer spring — see FeaturedAirlineFares. */
    <a
      href={destHref(d)}
      className="card card-hover group flex items-center gap-4 overflow-hidden p-3 transition-transform duration-200 ease-out hover:-translate-y-0.5"
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md">
        <Image
          src={d.img}
          alt={d.side === "from" ? `Flights from ${d.city}, ${d.country}` : `Flights to ${d.city}, ${d.country}`}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="t-h3 truncate text-primary-800">{d.city}</h3>
        <p className="t-caption text-text-secondary">{d.country}</p>
        <p className="mt-1 t-label-2 text-primary-800">
          {t("city.soft")}
        </p>
      </div>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-050 text-accent-600 transition-colors group-hover:bg-accent-500 group-hover:text-text-on-dark">
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </span>
    </a>
  );
}

export default function BestFaresByCity() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(REGIONS[0].name);
  const region = REGIONS.find((r) => r.name === active) ?? REGIONS[0];

  return (
    <section className="section bg-sand-500">
      <div className="container-page">
        <div className="section-lead text-center">
          <h2 className="t-h2 text-primary-800">{t("city.title")}</h2>
          <p className="t-body mt-4 text-text-on-sand">{t("city.lead")}</p>
        </div>

        {/* Region tabs — active tab is a filled navy pill (white text), hover a
            clearly visible navy tint. The animated pill sits UNDER the label
            (label wrapped in relative z-10), never behind the section bg. */}
        <div
          role="tablist"
          aria-label="Region"
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {REGIONS.map(({ name }) => {
            const selected = name === active;
            return (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(name)}
                className={cn(
                  "relative rounded-full px-4 py-2 t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
                  selected
                    ? "text-text-on-dark"
                    : "bg-neutral-000 text-primary-800 shadow-e1 ring-1 ring-primary-100 hover:bg-primary-100 hover:text-primary-800"
                )}
              >
                {/* The one piece of framer motion kept in this section. The
                    sliding pill is not decoration — it carries the selection
                    from the old tab to the new one, so the eye follows the
                    state change instead of hunting for it. Softened from a
                    spring (which overshot past the pill's resting edge) to a
                    180ms tween: same information, no bounce. */}
                {selected && (
                  <motion.span
                    layoutId="region-tab"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-primary-800 shadow-e2"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                )}
                <span className="relative z-10">{name}</span>
              </button>
            );
          })}
        </div>

        {/* Destination cards for the active region.

            These used to swap through an AnimatePresence crossfade in
            `mode="wait"` — 300ms out, then 300ms in, so a tab click cost 600ms
            before the new cities were readable. Tab content should be there the
            instant it is asked for; the sliding pill above already confirms the
            click landed. Swapped for a plain grid. */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {region.cities.map((d) => (
            <DestCard key={d.city} d={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
