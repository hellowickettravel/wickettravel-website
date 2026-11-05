/**
 * Shared, server-safe constants for the Dubai/UAE visa enquiry flow.
 *
 * These used to live inside components/VisaEnquiryForm.tsx, but that file is
 * "use client" — importing a plain data export from a client-boundary file
 * into a Server Component (app/visa/page.tsx) turns it into an opaque client
 * reference during RSC prerendering rather than the real array, which broke
 * `PERKS.map()` at build time. Plain data with no client-only behavior
 * belongs in a plain module so both server and client code can import the
 * real value.
 */

export const VISA_TYPES = [
  "Tourist Visa — 30 days",
  "Tourist Visa — 60 days",
  "Visit Visa",
  "Not sure yet",
];

/** Trust promises shown beside the form on both surfaces. */
export const PERKS = [
  "Eligibility checked before you pay",
  "Documents checked by our visa team before submission",
  "We aim to call you back the same day",
];

/** Shown wherever the visa service is offered (website audit, 5 Nov 2026):
 *  we are a private company, not the UAE government, and can't promise an
 *  outcome. Full terms live at /visa-terms. */
export const VISA_DISCLAIMER =
  "Wicket Travel is a private company, not the UAE government or an official visa website. We help you apply; the UAE authorities decide every application and we can't guarantee approval.";

export const VISA_FEE_NOTE =
  "Our service fee and the UAE government fee are quoted to you in writing before you pay.";
