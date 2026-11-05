"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Plane } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PORTAL_BOOKING_URL } from "@/lib/links";
import { portalRouteUrl } from "@/lib/routeLinks";

/**
 * Featured airlines grid. Each card pairs an aspirational aviation photo with
 * the airline's REAL logo (avs.io by IATA code). If a logo fails to load we
 * fall back to a clean labeled chip — we never fabricate or distort a logo.
 * Routes use soft, number-free fare language (we don't handle pricing here).
 */
type Airline = {
  code: string;
  name: string;
  title: string;
  routes: string[];
  img: string;
  /** Where the card goes: the route page for the airline's first route when
   *  one exists (lib/routes.ts), otherwise the booking portal with that
   *  destination filled in, as the search widget does. */
  href: string;
};

const portalTo = (to: string) => portalRouteUrl(PORTAL_BOOKING_URL, { to });

const AIRLINES: Airline[] = [
  {
    code:"EK",
    href: "/flights/london-to-dubai",
    name:"Emirates",
    title:"Fly with Emirates",
    routes: ["Dubai — best available fares","Bangkok — starting from low fares"],
    img:"/airlines/emirates.jpg",
  },
  {
    code:"QR",
    href: portalTo("DOH"),
    name:"Qatar Airways",
    title:"Discover with Qatar Airways",
    routes: ["Doha — best available fares","Maldives — starting from low fares"],
    img:"/airlines/qatar-airways.jpg",
  },
  {
    code:"BA",
    href: portalTo("NYC"),
    name:"British Airways",
    title:"Travel with British Airways",
    routes: ["New York — best available fares","Cape Town — starting from low fares"],
    img:"/airlines/british-airways.jpg",
  },
  {
    code:"AI",
    href: "/flights/london-to-delhi",
    name:"Air India",
    title:"Journey with Air India",
    routes: ["Delhi — best available fares","Mumbai — starting from low fares"],
    img:"/airlines/air-india.jpg",
  },
  {
    code:"VS",
    href: portalTo("MCO"),
    name:"Virgin Atlantic",
    title:"Soar with Virgin Atlantic",
    routes: ["Orlando — best available fares","Las Vegas — starting from low fares"],
    img:"/airlines/virgin-atlantic.jpg",
  },
  {
    code:"EY",
    href: "/flights/london-to-abu-dhabi",
    name:"Etihad Airways",
    title:"Explore with Etihad",
    routes: ["Abu Dhabi — best available fares","Sydney — starting from low fares"],
    img:"/airlines/etihad.jpg",
  },
  {
    code:"GF",
    href: portalTo("BAH"),
    name:"Gulf Air",
    title:"Connect with Gulf Air",
    routes: ["Bahrain — best available fares","Manila — starting from low fares"],
    img:"/airlines/gulf-air.jpg",
  },
  {
    code:"LH",
    href: portalTo("FRA"),
    name:"Lufthansa",
    title:"Fly with Lufthansa",
    routes: ["Frankfurt — best available fares","Munich — starting from low fares"],
    img:"/airlines/lufthansa.jpg",
  },
];

function AirlineLogo({ code, name }: { code: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className="inline-grid h-12 min-w-[3.5rem] place-items-center rounded-md bg-neutral-000 px-3 shadow-e2 ring-1 ring-primary-900/5"
      title={name}
    >
      {failed ? (
        <span className="t-label-3  text-primary-800">{name}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://pics.avs.io/200/80/${code}.png`}
          alt={`${name} logo`}
          width={88}
          height={32}
          loading="lazy"
          className="h-8 w-auto max-w-[5.5rem] object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

function FareCard({ a }: { a: Airline }) {
  const { t } = useI18n();
  return (
    /* Hover feedback is a 2px CSS lift, not a framer spring. The card is a link,
       so it should acknowledge the pointer — but a 6px spring overshoot on eight
       cards at once reads as a toy. Transform-only, so it stays cheap on mid-range
       Android, and the global reduced-motion rule flattens the duration to ~0. */
    <a
      href={a.href}
      className="card card-hover group flex h-full flex-col overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={a.img}
          alt={`Flights with ${a.name} from the UK at the best available fares`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        {/* Scrim, not decoration: the airline logo chip sits on this photo and
            needs a dependable dark base under it. Shared recipe — see the same
            three stops on the category, resort and destination cards. */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/20 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <AirlineLogo code={a.code} name={a.name} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Was `t-h3 t-body-lg` — two type-scale classes on one element, so
            the later globals.css definition (t-body-lg) silently won and
            this rendered at body weight/size instead of h3. One class. */}
        <h3 className="t-h3 text-primary-800">{a.title}</h3>
        <ul className="mt-3 space-y-2">
          {a.routes.map((r) => (
            <li key={r} className="flex items-center gap-2 t-body-sm text-text-secondary">
              <Plane className="h-3.5 w-3.5 shrink-0 -rotate-45 text-accent-500" aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>
        <span className="mt-6 inline-flex items-center gap-2 t-label-2 text-accent-600 transition-colors group-hover:text-accent-500">
          {t("fares.cta")}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </a>
  );
}

export default function FeaturedAirlineFares() {
  const { t } = useI18n();
  return (
    <section id="deals" className="section scroll-mt-16 bg-neutral-000">
      <div className="container-page">
        <div className="section-lead text-center">
          <h2 className="t-h2 text-primary-800">{t("fares.title")}</h2>
          <p className="t-body mt-4 text-text-secondary">{t("fares.lead")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AIRLINES.map((a) => (
            <div key={a.code} className="h-full">
              <FareCard a={a} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
