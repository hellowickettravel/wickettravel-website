# Product

## Register

brand

## Users

UK-based travelers (strong South Asian and Middle East diaspora audience — the site ships English, Spanish, French, Arabic and Urdu) booking airline tickets from UK airports, plus travelers needing UAE tourist/visit visas. They arrive from search or word of mouth, often on mid-range Android phones, comparing fares and looking for a trustworthy human-backed agency rather than a faceless OTA.

## Product Purpose

Wicket Travel (wickettravel.com) is a UK travel agency landing site: it wins trust fast, surfaces flight deals from trusted airlines, and converts visitors into leads — flight searches handed to the booking portal, phone/WhatsApp calls, and visa application enquiries (Dubai visa wizard). Sister brand Wicket Travel Holidays handles hotels/cars/packages. Success = qualified leads (searches, calls, form submissions).

## Brand Personality

Trustworthy, warm, expert. Navy = credibility, orange = energy/action. Human support is the differentiator (24/7 phone, WhatsApp, "expert contacts you within 2 hours"), so the tone is reassuring and concrete, never gimmicky.

## Anti-references

- Cluttered OTA aggregators (Kayak/Skyscanner density, blinking price tags, fake urgency timers).
- Visa-mill sites with red/maroon government-lookalike styling — the Dubai Visa section must stay 100% in Wicket navy/orange.
- Generic AI landing-page grammar: gradient text, glassmorphism-by-default, identical icon-card grids.

## Design Principles

1. Trust before conversion — ratings, real phone numbers, and plain-English promises appear beside every CTA.
2. One design system, no per-section drift — shared tokens (`t-*` type scale, `card`, `btn-*`, navy/accent ramps in `app/globals.css`) are the single source of truth.
3. Fast on mid-range Android — transform/opacity motion only, AVIF/WebP images, no scroll-linked repaints.
4. Every fact is soft-verifiable — no invented prices; fares stay number-free ("best available fares"), promises stay keepable.
5. RTL and multilingual are first-class — layouts must survive Arabic/Urdu direction flips.

## Accessibility & Inclusion

WCAG 2.1 AA target: 4.5:1 body contrast, visible focus rings, 44px tap targets, real labels on all form fields, `prefers-reduced-motion` renders final state everywhere (see `components/motion-primitives.tsx`), RTL support via `dir` on `<html>`.
