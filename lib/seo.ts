/**
 * Single source of truth for SEO + NAP (Name, Address, Phone) signals.
 * Consumed by the Metadata API (app/layout.tsx), JSON-LD structured data
 * (app/page.tsx), the sitemap, robots and the OG/icon image routes so the
 * business identity stays consistent everywhere Google and AI engines read it.
 */

/** Production URL — canonical origin for metadata, JSON-LD, sitemap & robots. */
export const SITE_URL = "https://www.wickettravel.com";

export const BUSINESS = {
  name: "Wicket Travel",
  legalName: "Wicket Travel Limited",
  registration: "17001759",
  /** E.164 for tel: links + JSON-LD; keep in sync with lib/links WHATSAPP_URL. */
  phone: "+447417564704",
  phoneDisplay: "+44 7417 564704",
  email: "info@wickettravel.com",
  streetAddress: "Lampton Avenue",
  addressLocality: "Hounslow",
  addressRegion: "London",
  addressCountry: "GB",
  postalCode: "TW3 4EW",
  /** Trustpilot score, as approved by the client. There is deliberately no
   *  review count anywhere on the site (and so no aggregateRating JSON-LD,
   *  which requires one) — the client asked us not to claim a number of
   *  reviews. Link to the live profile (sameAs below) for the detail. */
  ratingValue: 4.5,
  sameAs: [
    "https://x.com/WicketTravel",
    "https://www.instagram.com/wickettravel/",
    "https://www.facebook.com/profile.php?id=61581927811628&sk=followers",
    "https://www.trustpilot.com/review/wickettravel.com",
  ],
  /** Postcode centroid for TW3 4EW, geocoded via the ONS-backed postcodes.io
   *  API — for the TravelAgency schema's GeoCoordinates (local-SEO signal).
   *  Not the exact building; that's all a postcode centroid ever gives you. */
  geo: { latitude: 51.477288, longitude: -0.365695 },
} as const;

/** Trustpilot-green star box background for star `i` (0-based) of a 5-star
 *  rating: solid green when fully earned, half green / half grey for a
 *  fractional star (4.5 => the fifth box is half filled), grey otherwise. */
export function starBackground(i: number, rating: number): string {
  const green = "#00b67a";
  const grey = "#d8d8d4"; // --color-neutral-300
  if (i + 1 <= rating) return green;
  if (i < rating) {
    const pct = Math.round((rating - i) * 100);
    return `linear-gradient(to right, ${green} ${pct}%, ${grey} ${pct}%)`;
  }
  return grey;
}

/**
 * Phone/WhatsApp support is staffed 24/7 — the same fact the Contact page
 * already states in copy and schema. Shared here so every JSON-LD node that
 * needs it (Organization, TravelAgency, ContactPage) states it identically
 * instead of drifting out of sync.
 */
export const ALWAYS_OPEN_HOURS = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  opens: "00:00",
  closes: "23:59",
} as const;

/** Sister brand — flights live here, hotels/cars/packages live there. */
export const SISTER_BRAND = {
  name: "Wicket Travel Holidays",
  url: "https://www.wickettravelholidays.com/",
} as const;

/**
 * Alt text for the generated social card (app/opengraph-image.tsx, re-exported
 * by app/twitter-image.tsx). Kept here so OG_BASE/TWITTER_BASE below can name
 * it without importing the image route (which would drag `next/og` into every
 * page bundle) — keep the two in sync if the card's wording changes.
 */
export const SOCIAL_IMAGE_ALT =
  "Wicket Travel — book cheap flights from the UK at the best airline ticket fares";

/* Declared outside the `as const` objects below on purpose: `as const` would
   make these arrays `readonly`, and Next's `OGImage[]` / `TwitterImage[]`
   types are mutable, so spreading them into a page's metadata would not
   type-check. */
const OG_IMAGES = [
  {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: SOCIAL_IMAGE_ALT,
  },
];

const TWITTER_IMAGES = [{ url: "/twitter-image", alt: SOCIAL_IMAGE_ALT }];

/**
 * Open Graph fields that are NOT inherited by pages.
 *
 * Next.js merges `metadata` shallowly: a page that exports its own `openGraph`
 * object replaces the layout's wholesale. That silently dropped `siteName`,
 * `locale` AND the generated `opengraph-image` from every route except `/` —
 * every interior page was sharing with no card image at all. Spread this into
 * each page's `openGraph` and add `url`, `title` and `description` on top.
 */
export const OG_BASE = {
  type: "website",
  siteName: BUSINESS.name,
  locale: "en_GB",
  images: OG_IMAGES,
} as const;

/**
 * Same story for `twitter`: a page-level object replaces the layout's, so the
 * card type, the account handles and the card image all have to travel with
 * every override. Spread this and add `title` / `description`.
 */
export const TWITTER_BASE = {
  card: "summary_large_image",
  site: "@WicketTravel",
  creator: "@WicketTravel",
  images: TWITTER_IMAGES,
} as const;

/**
 * The Organization node published by the homepage `@graph` (app/page.tsx).
 * Service nodes on the individual service pages point `provider` here so every
 * page's structured data resolves back to one business entity rather than
 * describing an anonymous provider per page.
 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Reusable `areaServed` values for Service JSON-LD. */
export const AREA_SERVED_UK = {
  "@type": "Country",
  name: "United Kingdom",
} as const;

export const AREA_SERVED_UAE = {
  "@type": "Country",
  name: "United Arab Emirates",
} as const;

/** UK departure airports we surface — reused in copy, FAQ and structured data. */
export const UK_DEPARTURES = [
  "London Heathrow",
  "Manchester",
  "Birmingham",
  "London Gatwick",
  "London Luton",
  "Edinburgh",
] as const;
