"use client";

import Image from "next/image";
import { ArrowRight, Car, Hotel, Luggage, Plane } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { HOLIDAYS_URL } from "@/lib/links";

/**
 * The four category photos were re-shot (re-sourced) in this pass. Previously
 * this was the least convincing imagery on the page: "Flights" reused the exact
 * aircraft-wing photograph already carrying the hero, the Emirates fare card and
 * the Luton city card — its fourth appearance on one page — while "Hotels" was a
 * stone cottage that read as a rural B&B against copy promising 5-star resorts,
 * and "Car Rental" and "Packages" were dark, near-unreadable crops of an
 * ambiguous subject. Every other photo section on this page shows plainly what
 * its label says; this one did not.
 *
 * The replacements were chosen against three rules, and each was reviewed at
 * card size before being committed rather than picked off a filename:
 *   1. the subject must be legible at 3/4 portrait under the section's scrim;
 *   2. no photo may repeat a subject used elsewhere on the page — so hotels is
 *      an interior suite rather than another resort pool, which would have
 *      pre-echoed the resort grid two sections below;
 *   3. one register across the four — real places and objects, mid-saturation.
 * Sources are stored portrait (800×1067) to match the frame instead of being
 * cropped down from a landscape plate.
 */
type Category = {
  icon: typeof Plane;
  titleKey: string;
  title: string;
  copy: string;
  cta: string;
  href: string;
  external?: boolean;
  img: string;
};

const CATEGORIES: Category[] = [
  {
    icon: Plane,
    titleKey:"nav.flights",
    title:"Flights",
    copy:"Tell us your route and dates: our team quotes one total price and books your airline tickets once you agree.",
    cta:"Explore flights",
    href:"/flights",
    img:"/categories/flights.jpg",
  },
  {
    icon: Hotel,
    titleKey:"nav.hotels",
    title:"Hotels",
    copy:"From boutique stays to resorts — booked with our sister company on its holidays site.",
    cta:"Find hotels",
    href: HOLIDAYS_URL,
    external: true,
    img:"/categories/hotels.jpg",
  },
  {
    icon: Car,
    titleKey:"nav.cars",
    title:"Car Rentals",
    copy:"Pick up a car when you land — arranged by our sister company on its holidays site.",
    cta:"Rent a car",
    href: HOLIDAYS_URL,
    external: true,
    img:"/categories/car-rentals.jpg",
  },
  {
    icon: Luggage,
    titleKey:"cat.packages",
    title:"Packages",
    copy:"Flight, stay and car together, from our sister company on its holidays site.",
    cta:"Build a package",
    href: HOLIDAYS_URL,
    external: true,
    img:"/categories/packages.jpg",
  },
];

function CategoryCard({ c }: { c: Category }) {
  const { t } = useI18n();
  const Icon = c.icon;
  return (
    /* 2px CSS lift instead of a framer spring — see FeaturedAirlineFares. */
    <a
      href={c.href}
      {...(c.external ? { target:"_blank", rel:"noopener noreferrer" } : {})}
      className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-lg shadow-e1 ring-1 ring-primary-900/5 transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      <Image
        src={c.img}
        alt={`${c.title} — explore travel options`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover"
      />
      {/* Scrim: a full heading, paragraph and CTA sit on this photo. Shared
          three-stop recipe, with the base stop pushed to /85 because this card
          carries the most text of any photo card on the page. */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/45 to-primary-900/10" />

      <div className="relative p-6">
        <span className="inline-grid h-11 w-11 place-items-center rounded-md bg-neutral-000/15 text-text-on-dark backdrop-blur-sm transition-colors duration-300 group-hover:bg-accent-500">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {/* Was `t-h3 mt-4 t-body-lg` — two type-scale classes on one element,
            so the later globals.css definition silently won and this
            rendered at body weight/size instead of h3. One class. */}
        <h3 className="t-h3 mt-4 text-text-on-dark">{t(c.titleKey)}</h3>
        <p className="t-body-sm mt-2 text-primary-100">{c.copy}</p>
        <span className="mt-4 inline-flex items-center gap-2 t-label-2 text-accent-200 transition-colors group-hover:text-accent-200">
          {c.cta}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </a>
  );
}

export default function TravelByCategory() {
  const { t } = useI18n();
  return (
    <section className="section bg-sand-500">
      <div className="container-page">
        <div className="section-lead text-center">
          <h2 className="t-h2 text-primary-800">{t("cat.title")}</h2>
          <p className="t-body mt-4 text-text-on-sand">{t("cat.lead")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.title} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
