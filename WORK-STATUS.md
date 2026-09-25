# Wicket Travel — Work Status (2026-09-08)

Snapshot of everything done in this working session, for handoff before a
usage-limit pause. Everything below is committed to `main` in this repo.

## ✅ Done

**Five new pages, all real and functional, not mockups:**
- `/flights` — popular routes, cabin comparison, FAQ, the same real
  `FlightSearch` widget the homepage uses (hands off to the real booking
  portal). Hero rebuilt today to match the site's photo-hero pattern (was a
  flat text-only banner).
- `/hotels`, `/car-rentals` — honest "in partnership with Wicket Travel
  Holidays" showcase pages; the example search panels are clearly labeled
  as examples, with a real link out to the sister brand for the actual
  booking.
- `/visa` — the real Dubai/UAE visa enquiry form (not a copy — the same
  component `VisaBanner`'s homepage modal uses), inline on its own page
  with supporting content. Verified live against the real
  `/api/visa-enquiry` backend today (test submission returned a real
  reference number).
- `/parents-tickets` — revived the "community board" feature that had been
  quietly retired in favor of a phone-only CTA. Real dual-role (family /
  helper) form and a real live public feed, both wired to the existing
  `/api/parent-ticket` backend. **Important finding, not yet acted on:**
  the real backend publishes more than originally assumed — exact date,
  airline, and a shortened real name, not just a rough timeframe. The page
  copy now accurately describes what's actually public; whether the
  upstream anonymization itself should change is a decision for whoever
  owns that portal.

**Site-wide polish pass** (homepage, About, Contact): trimmed decorative
motion (kept the airline-logo marquee and functional transitions), removed
gradients that violated the project's own `PRODUCT.md` rules, self-hosted
40+ previously-hotlinked images, fixed a real hero/search-widget alignment
bug (confirmed by pixel measurement, not guessing).

**Navigation**: `Header.tsx` and `Footer.tsx` both fully repointed —
Flights/Hotels/Car Rental/Dubai Visa/Parents Tickets all link to their real
pages now, not homepage anchors or external redirects.

**SEO**: `Service` schema added to all 5 new pages, linked to the
homepage's `Organization` node. Fixed a real bug where every interior
page's social card (`og:image`, Twitter card) was silently broken because
Next.js merges `metadata` shallowly. Sitemap and robots.txt updated.

**Performance**: two oversized hero photos re-compressed (~50%/~28%
smaller, no visible quality loss), a wrong `sizes` attribute fixed, an
unnecessary image preload removed, a dead DNS-prefetch hint removed.

**Accessibility**: a real WCAG contrast failure fixed at the token level
(`text-on-sand`, was 3.95:1, now 4.89:1+), placeholder text contrast fixed
site-wide, one under-sized (40px) tap target corrected to 44px.

**Verified today, specifically per this handoff's request** — every
form/search widget still functions exactly as before all this work:
`FlightSearch`'s handoff to the real booking portal (code unchanged),
the real Visa enquiry form (live test: `#VQ-1079`, HTTP 201), the real
Parents Tickets live board (rendering real entries), the homepage's Visa
modal (still opens correctly with the shared form component), and the
Contact page form (present, correct field count).

Full production build passes clean (23/23 routes), zero ESLint errors.

## ⏳ Pending (known, not done)

- **Deals** has no dedicated page — nav still points to the homepage's
  `#deals` section. Not requested this round.
- **The "darker navy" preference** the client mentioned early on was never
  pinned down to a concrete shade/reference — the site still uses this
  codebase's own original navy/orange tokens, unchanged.
- **Footer placeholder links** (Travel guides, How it works, Partners,
  Careers, Press, Help center, Manage booking, FAQs) are still `#` stubs —
  no pages exist for these yet.

---

## 2026-09-10 — client call follow-up

**Done:** Trustpilot badge (hero, top-right, real rating/review data,
`components/TrustpilotBadge.tsx`), back-to-top button
(`components/BackToTop.tsx`), a Login header button wired to
`PORTAL_LOGIN_URL`. Homepage polish pass, then the same audit repeated
across `/flights`, `/hotels`, `/car-rentals`, `/visa`, `/about`,
`/contact`, `/parents-tickets`.

**Real bugs found and fixed, not a redesign:**
- `t-h3 t-body-lg` (or the reverse order) on one element was still present
  in five places — `FeaturedAirlineFares`, `PopularDestinations`,
  `TravelByCategory`, `HowItWorks`, `LegalLayout` — the exact "two
  type-scale classes silently lose to whichever globals.css defines later"
  bug this doc's original pass already found and fixed in `Contact` and
  `ContactForm`, just not swept everywhere at the time. All five now carry
  one type class, matching the fix already on record here.
- The Unsplash `remotePatterns` entry flagged below as pending was actually
  already dead: `/about`'s hero photo is `public/about/above-the-clouds.jpg`,
  a local file, not a hotlink. Removed the now-unused entry from
  `next.config.ts` rather than leave stale allowlisted surface area.
- `CallUsBand`/`ParentsBanner` duplication (previously pending, above):
  client chose "give Parents Tickets its own look" over merging the two or
  leaving them as-is. `ParentsBanner` is now a light `sand-500` card with a
  `HeartHandshake` icon medallion standing in for CallUsBand's agent photo
  (no equivalent photo exists for this service) — same copy, same phone/
  WhatsApp CTAs, no content invented. Resolved.

Full production build passes clean, zero ESLint errors.

## 2026-09-10 — legal pages, airline logos, deep SEO pass

**Legal pages (Privacy/Terms/Refunds):** read all three in full, not just the
shared `LegalLayout` component. All three are already solid — correctly
cross-linked, GDPR-honest, and each already flags the few real
business-decision placeholders (exact fee amounts, retention periods, refund
timeframes) with a visible `Placeholder` component rather than a guessed
number. No changes needed.

**Airline logos:** already resolved in an earlier pass, not a pending item —
`AirlineLogos.tsx` and `FeaturedAirlineFares.tsx` both load real marks live
from the `pics.avs.io` airline-logo CDN by IATA code, with a clean fallback
if a logo fails to load. The remaining trademark-flagged item is narrower
than "airline logos" suggested: the **car-rental partner wall**
(Hertz/Avis/Europcar/Sixt/Enterprise/Budget on `/car-rentals`) still uses
typeset wordmarks on purpose, since there's no avs.io-style licensed source
for those marks — left as a business decision, not touched.

**Deep SEO / local SEO / AEO pass:** see `SEO-PLAN.md` for the full writeup.
Summary of code changes:
- Added real `GeoCoordinates` (postcode-centroid geocoded via postcodes.io)
  to the `TravelAgency` JSON-LD — local-SEO signal that was missing.
- Added a shared `ALWAYS_OPEN_HOURS` constant (`lib/seo.ts`) so the
  homepage's `Organization` contact point states the same 24/7 fact the
  Contact page already stated, instead of the homepage silently omitting it.
- Added `app/manifest.ts` (web app manifest — real brand name/colours/icons).
- Refreshed the existing `public/llms.txt` (it predated the dedicated
  Flights/Visa/Parents Tickets/Hotels/Car Rentals pages and still pointed AI
  answer engines at homepage anchors instead of them) — real page URLs,
  added the policy pages, kept every existing fact/trust claim as written.
- Verified programmatically: every `<Image>`/`<img>` on the site has alt
  text, every route has exactly one real `<h1>`, every title/description is
  within Google's display limits, sitemap/robots are already correct and
  already allow AI crawlers.
- `SEO-PLAN.md` documents what's structural-but-flagged (no blog/content
  pages yet, dead footer stub links, no dedicated `/deals` page, the language
  switcher has no real per-locale URLs, no analytics installed) and the
  off-site account actions only Wicket Travel can do (Search Console, Bing
  Webmaster Tools, Google Business Profile, citations, backlinks).

Full production build passes clean (24/24 routes incl. the new manifest),
zero ESLint errors.

## 2026-09-10 — footer stub links

`Footer.tsx` had 8 nav links; only 3 went anywhere real. Fixed rather than
left as-is, per `SEO-PLAN.md`'s own recommendation:
- **"How it works" and "FAQs"** now point at the real homepage sections that
  already existed (`#how-it-works`, `#faq`) — they just weren't linked from
  the footer before.
- **"Manage booking"** now points at the same customer portal login Header's
  "Login" button already uses (`PORTAL_LOGIN_URL`) — a real destination that
  wasn't wired here.
- **"Travel guides", "Partners", "Careers", "Press", "Help center"** were
  removed — no content exists anywhere for any of them, and a dead `#` link
  is worse than no link. Add them back once each page is real.

Verified with a screenshot after the change: footer still reads balanced at
4/2/4 links per column, nothing looks empty or broken.

Full production build passes clean, zero ESLint errors.

## 2026-09-10 — "Assist Family" rename + live-board redesign (carousels, list & detail pages)

Client call follow-up, five numbered requests plus a rename. All addressed:

**Rename:** "Parents Tickets" → "Assist Family" everywhere it's a visible
label — nav (`lib/i18n.tsx`, all 5 languages), the page's own title/hero/
breadcrumbs, `ParentsBanner`'s aria-label, and the two mentions in
Privacy/Terms. **Deliberately not renamed:** the URL (`/parents-tickets`),
component/file names, and the `/api/parent-ticket` backend contract — all
three already have real indexing history or are wired to the live portal;
renaming them would need a 301 and touch a live integration for a
display-copy change. Documented inline in `app/parents-tickets/page.tsx`.

**Live board redesign:** the old text-heavy two-column grid
(`components/ParentsBoard.tsx`) is no longer what the main page shows.
Replaced with two horizontal, auto-scrolling card carousels — "Families
asking for a companion" and "Travellers offering to help"
(`components/AssistFamilyCarousels.tsx`) — reusing the same seamless-loop
marquee CSS the airline-logo strip already used. Each card is a photo, a
route, a date and a price, not a paragraph. New navigation this adds:
- Tap any card → its own detail page, `/parents-tickets/listing/[reference]`
  (`components/ListingDetail.tsx`), showing the entry in full. No per-listing
  API exists, so this reads the same public feed and matches by reference;
  an entry that's since been matched/expired renders a real "no longer
  available" state, not an error. `noindex, follow` — ephemeral, thin pages,
  not worth indexing individually.
- "More" on either carousel → a full list page for that side,
  `/parents-tickets/requests` and `/parents-tickets/offers`, both evergreen
  and indexable, added to `app/sitemap.ts`. Both render the existing board
  component (`ParentsBoard.tsx`, now given a `lockFilter` prop) rather than
  duplicating its fetch/filter logic.
- Shared parsing (`lib/parents.ts`: `parseEntry`/`ParsedEntry`) and fetching
  (`lib/useParentBoard.ts`, new) extracted so the carousels, both list pages
  and the detail page all read the one live feed identically — previously
  the board had its own private copy of this logic.

**Client's four background-image suggestions (Bangalore/Hyderabad/Delhi for
requests, Heathrow/Manchester/Scotland for offers):** implemented as
`destinationImage()` in `lib/parents.ts`, matched from whatever the poster
typed into the route fields. **Real finding along the way:** the live feed's
route fields hold IATA codes ("HYD", "LHR"), not city names — the matcher
was extended to catch both, or every card would have silently fallen back to
the generic hero photo. **No new images were added or needed:**
`/cities/{bangalore,hyderabad,delhi,heathrow,manchester,edinburgh}.jpg`
already exist and are already live elsewhere on the site
(`BestFaresByCity.tsx`, `/flights`, `/hotels`) — reused as-is rather than
introducing a second, different photo of the same city under a new name.

**Other four client requests from the same call:**
- Header phone number: was `xl:inline-flex`, a real breakpoint gap where the
  nav appeared (`lg:`) but the number didn't (`xl:`). Now matches the nav's
  own breakpoint.
- Trustpilot badge: moved off its own independently-floating block near the
  header and onto the search widget itself — anchored to the widget's own
  (narrower) wrapper, overlapping its top-right corner like a hung tag,
  matching the area the client circled on the homepage screenshot.
- Airline marquee: added LOT Polish Airlines and KLM (`components/
  AirlineLogos.tsx`) — same avs.io-by-IATA-code pattern as the other 9, same
  graceful text-fallback if a logo fails to load.

Full production build passes clean (26/26 routes incl. the two new list
pages and the new dynamic listing route), zero ESLint errors/warnings.
Verified visually: carousels render real live entries with the correct
background per route, both list pages, and the detail page in both its
"found" and "no longer available" states.

## 💡 Recommended next

1. **Review everything live** — this is the natural next step before more
   work piles up unreviewed.
2. **Decide the Deals page** — dedicated page (matching the other 5) or
   leave as a homepage section.
3. **Real rental-brand logo marks** — airline logos are resolved (real marks
   via avs.io). The car-rental partner wall still uses typeset names, since
   no licensed marks have been supplied for those brands. Genuine
   trademark-risk blocker, not a design choice.
4. **Resolve the Parents Tickets privacy finding** above — worth a decision
   from whoever owns the upstream portal.
5. **`CallUsBand`/`ParentsBanner` differentiation** — needs a content
   decision, not a design guess.
6. A deeper performance pass exists as a lever if wanted later:
   `framer-motion` is pulled into every page via the shared motion
   primitives — a deliberate architectural choice, not a bug, but the
   single biggest shared JS cost on the site if it's ever worth revisiting.
