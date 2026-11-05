/**
 * Legal identity and the facts every legal page, the footer and the forms
 * state. One module so the Terms, Privacy Policy, footer disclosure and form
 * notices can never drift apart.
 *
 * Sources (checked 5 November 2026):
 * - Companies House, company 17001759: WICKET TRAVEL LIMITED, private limited
 *   company, England and Wales, incorporated 30 January 2026, SIC 79110
 *   (travel agency activities), two directors.
 * - The booking portal (hellowickettravel/wickettravel-portals): a booking is
 *   a request → a consultant quotes a price → the customer pays (card, bank
 *   transfer, or a deposit) → the team books and tickets → the documents are
 *   posted to the customer's portal thread. That is the model these pages
 *   describe: Wicket Travel Limited books on the customer's behalf. It is NOT
 *   the comparison/affiliate model of Wallet Flights, the company's separate
 *   comparison brand.
 *
 * Things only the business can confirm are left as empty strings and the UI
 * hides them until they are set (never shown as "to be confirmed").
 */
import { BUSINESS, SITE_URL } from "@/lib/seo";

/** The date shown on every legal page. Update it whenever a page changes. */
export const LEGAL_UPDATED = "5 November 2026";

export const COMPANY = {
  legalName: BUSINESS.legalName,
  tradingName: BUSINESS.name,
  number: BUSINESS.registration,
  jurisdiction: "England and Wales",
  /** Registered office as shown on the company's other site. Companies House
   *  lists the full address with the building number. */
  registeredOffice: "Lampton Avenue, Hounslow, England, TW3 4EW",
  incorporated: "30 January 2026",
  email: BUSINESS.email,
  phoneDisplay: BUSINESS.phoneDisplay,
  companiesHouseUrl:
    "https://find-and-update.company-information.service.gov.uk/company/17001759",
  iataTids: "96239010",
  site: SITE_URL,
} as const;

/** ICO data protection fee registration number (e.g. "ZB123456"). Shown in
 *  the Privacy Policy once set. Look it up at ico.org.uk/ESDWebPages/Search. */
export const ICO_REGISTRATION = "";

/** One line naming the company, for footers and the foot of every form. */
export const COMPANY_LINE = `${COMPANY.tradingName} is a trading name of ${COMPANY.legalName}, a private limited company registered in ${COMPANY.jurisdiction} (company number ${COMPANY.number}). Registered office: ${COMPANY.registeredOffice}.`;

/**
 * How a booking works, in the words the footer, Terms and Help centre all
 * use. Keep these consistent with Terms §3 ("How bookings work").
 */
export const BOOKING_DISCLOSURE = [
  "Wicket Travel Limited books flights on your behalf as a travel agent. When you send us a request through our booking portal, by WhatsApp or by phone, a consultant quotes you a total price and the fare rules, and we book only once you agree and pay. The airline issues your e-ticket and operates your flight under its own conditions of carriage.",
  "Changes, cancellations and refunds go through us: we ask the airline for you and pass on whatever its fare rules allow. Wicket Travel Limited does not hold an ATOL licence and does not sell package holidays; flight-only bookings are not ATOL protected.",
  "Hotels, car hire and holidays are sold by our sister company, Wicket Travel Holidays, under its own terms. Our Dubai visa service and Parent Travel Assist have their own terms.",
] as const;

/** Every legal and policy page, in footer order. */
export const LEGAL_LINKS = [
  { label: "Terms & conditions", href: "/terms" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Cookie policy", href: "/cookie-policy" },
  { label: "Refund policy", href: "/refunds" },
  { label: "Complaints", href: "/complaints" },
  { label: "Visa service terms", href: "/visa-terms" },
  { label: "Parent Travel Assist terms", href: "/parent-travel-assist-terms" },
] as const;

/** Where WhatsApp chats go, said wherever we invite one. */
export const WHATSAPP_NOTE =
  "Chats are carried by WhatsApp (Meta) under WhatsApp's own terms and privacy policy.";
