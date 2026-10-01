/**
 * Wicket Travel is a flights-focused experience. Hotels (and any non-flight
 * holiday product) are handled on the sister site, so every hotel touchpoint
 * routes here and opens in a new tab.
 */
export const HOLIDAYS_URL = "https://www.wickettravelholidays.com/";

/** Standard props for any anchor that should open the holidays site safely. */
export const externalLinkProps = {
  href: HOLIDAYS_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/** Sign in / sign up and quote requests go to the booking portal on its
 *  branded custom domain (opens in the same tab). */
export const PORTAL_LOGIN_URL = "https://www.portal.wickettravel.com/login";

/** New-member registration on the booking portal (same tab). Submitting a
 *  Parents Tickets enquiry funnels here — an account keeps every match private. */
export const PORTAL_SIGNUP_URL = "https://www.portal.wickettravel.com/signup";

/** Flight searches hand off to the portal's booking wizard (same tab); the
 *  widget appends the traveler's entries as query params to pre-fill it. */
export const PORTAL_BOOKING_URL =
  "https://www.portal.wickettravel.com/customer/book";

/** WhatsApp deep link — +44 7417 564704 (opens in a new tab). */
export const WHATSAPP_URL = "https://wa.me/447417564704";

/**
 * Every visible phone number and "call us" button on the site opens a
 * WhatsApp chat with the same number, not a tel: link (client request,
 * 2026-10-01): on a desktop, tel: hands off to Skype or FaceTime, which
 * most visitors don't use. Spread onto an <a>: `<a {...PHONE_LINK}>`.
 * JSON-LD still publishes the number itself (lib/seo.ts BUSINESS.phone).
 */
export const PHONE_LINK = {
  href: WHATSAPP_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/**
 * Where the three server-side relays (/api/parent-ticket,
 * /api/parent-ticket/public, /api/visa-enquiry) forward to. The portal's
 * apex domain; `www.` only redirects to it.
 *
 * Never a Vercel deployment URL: the old value, wicket-travel-portal.vercel.app,
 * stopped resolving and silently took down every Parent Travel Assist post, every
 * visa lead and the whole public board. Override server-side with the
 * `PORTAL_ORIGIN` env var (locally, http://localhost:3200).
 */
export const PORTAL_ORIGIN = (
  process.env.PORTAL_ORIGIN || "https://portal.wickettravel.com"
).replace(/\/+$/, "");
