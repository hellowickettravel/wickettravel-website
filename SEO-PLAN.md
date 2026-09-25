# Wicket Travel — SEO, Local SEO & AEO Plan (2026-09-10)

Honest starting point: this codebase already had an unusually strong SEO
foundation before today (Organization/TravelAgency/WebSite/FAQPage JSON-LD,
per-page Service + FAQ schema, a correct sitemap and robots.txt, tight
title/description lengths, complete image alt text, self-hosted fonts,
AVIF/WebP images). This plan separates **what was fixed in code today**,
**what's already good and needs no action**, and **what only the business
owner can do** (accounts, content, off-site) — so nothing below is busywork
invented to look thorough.

## 1. Fixed in code today

- **Local-SEO geo signal**: added real `GeoCoordinates` (51.477288,
  -0.365695 — the TW3 4EW postcode centroid, geocoded via the UK's ONS-backed
  postcodes.io API) to the `TravelAgency` schema. Google and Bing use this to
  place the business on the map for local-pack results.
- **Consistent opening-hours signal**: the Contact page already stated
  "phone/WhatsApp 24/7" in both copy and schema; the homepage's `Organization`
  contact point didn't carry the same machine-readable fact. Pulled it into
  one shared `ALWAYS_OPEN_HOURS` constant (`lib/seo.ts`) and applied it to
  both the homepage `Organization`/`TravelAgency` nodes and the Contact page,
  so the fact can't drift out of sync between pages.
- **Web app manifest** (`app/manifest.ts`, new): a `manifest.webmanifest` now
  exists using the real brand name, navy/orange theme colours and existing
  icon files. This is both a genuine install/pin feature and a line item
  Lighthouse's SEO/PWA audit checks for.
- **`llms.txt` refreshed** (`public/llms.txt` — this already existed from an
  earlier pass and was already well-written; it just hadn't been updated
  since the dedicated Flights/Visa/Parents Tickets/Hotels/Car Rentals pages
  went live). It still linked AI answer engines (ChatGPT, Perplexity,
  Copilot, Claude) to homepage anchor sections (`/#deals`, `/#dubai-visa`,
  etc.) instead of those fuller standalone pages. Updated the page list to
  the real URLs, added About/Contact/the three policy pages which weren't
  listed at all, and fixed one stale social link — kept every existing fact
  and trust claim as written, since they already matched the site's own
  copy (FAQ, About) word for word.
- Confirmed `robots.txt` already allows every crawler (including AI bots —
  GPTBot, ClaudeBot, PerplexityBot, Google-Extended all fall under the open
  `*` rule) except the three JSON API routes, which is correct — no change
  needed.

## 2. Already good — verified, not touched

- Every route has a real `<h1>` (via `Hero`/`PageHero`), correct heading
  descent, and 100% image `alt` coverage — checked programmatically across
  every `<Image>`/`<img>` in the codebase, not sampled.
- Every page's title (via the `%s | Wicket Travel` template) and meta
  description sit comfortably inside Google's display limits (descriptions
  are all 117–161 characters).
- `sitemap.xml` lists all 11 real routes with sensible priorities/change
  frequencies; `robots.txt` points to it and sets a correct `host`.
- JSON-LD is already extensive: `Organization`, `TravelAgency`, `WebSite`
  (with a sitelinks `SearchAction`), `WebPage`, `BreadcrumbList` and
  `FAQPage` on the homepage; `Service` + `FAQPage` + `BreadcrumbList` on
  Flights, Car Rentals, Visa and Parents Tickets; `AboutPage` / `ContactPage`
  on those two. Hotels correctly has no `FAQPage` node because it has no FAQ
  content to mark up.
- Airline logos (`AirlineLogos.tsx`, `FeaturedAirlineFares.tsx`) are already
  **real marks**, loaded live from the `pics.avs.io` airline-logo CDN by IATA
  code, with a clean labelled fallback if a logo fails to load — this was
  already resolved in an earlier pass, not a pending item.

## 3. Left as a deliberate, flagged decision (not done today)

- **Car-rental partner logos** (Hertz, Avis, Europcar, Sixt, Enterprise,
  Budget on `/car-rentals`) are still typeset names, on purpose — there's no
  equivalent to the avs.io licensing arrangement for rental-brand marks, and
  reproducing those logos without a licence is a real trademark exposure, not
  a design choice. This needs a business decision (get permission, license
  logo packs, or keep the honest wordmark treatment) rather than an
  engineering fix, so I left it as the prior session flagged it.

## 4. Structural things worth knowing about (not fixed — need a decision)

- **No content/blog pages exist yet.** Every page on the site is a
  transactional/service page. That's fine for people already searching
  "Wicket Travel" or "book flights UK", but it's the main reason organic
  *discovery* traffic (people who don't know the brand yet) will stay low —
  there's nothing here to rank for the long-tail, informational searches
  that bring in new visitors ("best time to book flights to Dubai from
  Heathrow", "Dubai visa processing time UK", "flying with an elderly parent
  alone"). This is the single biggest lever for the "start having traffic"
  part of the ask, and it's a content project, not a code change — happy to
  scope it once you've decided on topics/cadence.
- **Footer stub links** (Travel guides, How it works, Partners, Careers,
  Press, Help center, Manage booking, FAQs) still go to `#`. Dead links hurt
  both UX and crawl signals. Either build the pages or remove the links until
  they exist — leaving them as silent no-ops is the one option that actively
  costs you.
- **No dedicated `/deals` page** — still a homepage anchor only, so it can't
  independently rank or be shared as a URL.
- **Language switcher is client-side only.** The `en/es/fr/ar/ur` toggle
  changes UI strings in the browser but there's no `/es/`, `/fr/`, `/ar/`
  etc. URL — so it earns zero non-English search visibility. If Spanish/
  Arabic/Urdu organic traffic matters to you, that's a real localisation
  project (separate URLs, translated metadata, hreflang tags), not a flag to
  flip.
- **No analytics installed.** I found no GA4/GTM/other tracking snippet
  anywhere in the codebase. Without it, there's no way to see whether any of
  this — today's changes or anything after — actually moves traffic. This is
  the first thing I'd wire up once you give the go-ahead and a property ID.

## 5. Off-site actions only you can do (accounts I can't access)

These are the highest-leverage items for "fully index-ready" and are
account-gated, not code:

1. **Google Search Console** — verify `wickettravel.com`, submit
   `https://www.wickettravel.com/sitemap.xml`, use URL Inspection to request
   indexing on the 11 live pages, and watch the Coverage/Core Web Vitals
   reports weekly for the first month.
2. **Bing Webmaster Tools** — same steps; Bing's index also feeds Copilot
   and other assistants, so this matters for AEO too, not just Bing search.
3. **Google Business Profile** — claim/verify a listing for the Hounslow
   registered address (or set it up as a service-area business if there's no
   walk-in office), category "Travel agency", 24/7 hours, and start
   collecting Google reviews specifically — Google weights its own reviews
   far more heavily than Trustpilot for local-pack ranking, even though the
   Trustpilot number (4.8, 12,480 reviews) is a strong trust signal to keep.
4. **NAP-consistent citations** — Yell, Bing Places, Apple Maps Business
   Connect, and any UK travel-trade directories, all using the exact name/
   address/phone in `lib/seo.ts` (Wicket Travel Limited, Lampton Avenue,
   Hounslow, London, TW3 4EW, +44 7417 564704) — inconsistent NAP across the
   web is one of the most common reasons a legitimate local business
   under-ranks.
5. **Backlinks** — press mentions, partner links (if any airline/rental
   partner will link back), and genuine UK travel/London-business directory
   listings. No shortcuts here that don't also carry spam risk.
6. **Validate after deploy** — run the live site through Google's Rich
   Results Test and the Schema.org validator once these changes are on
   production; I've verified the JSON-LD is well-formed here, but only a
   live URL can be checked by those tools.

## Priority order if you want a single checklist

1. Deploy today's changes.
2. Install analytics (tell me the GA4 ID/property and I'll wire it up).
3. Verify Search Console + Bing Webmaster Tools, submit the sitemap.
4. Claim Google Business Profile.
5. Fix or remove the dead footer links.
6. Decide on the car-rental logo question.
7. Scope a content/guides plan once the above is live and you're ready for
   the bigger lift.
