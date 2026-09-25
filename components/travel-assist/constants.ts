import { BUSINESS } from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/links";

/** The real Trustpilot profile — already listed in BUSINESS.sameAs. */
export const TRUSTPILOT_URL =
  BUSINESS.sameAs.find((url) => url.includes("trustpilot.com")) ??
  "https://www.trustpilot.com/review/wickettravel.com";

/**
 * In-page hashes. Any link on the page can use these, including the server
 * sections, and AssistExperience (the one client island that owns the finder,
 * the board and the post-a-trip dialog) reacts to them.
 */
export const HASH = {
  findCompanion: "find-a-companion",
  offerHelp: "offer-to-help",
  postTrip: "post-your-trip",
  postOffer: "post-your-offer",
  /** The old page's form anchor — still linked from /parents-tickets/requests
   *  and /offers, so it keeps working and opens the dialog. */
  legacyPost: "post-to-the-board",
} as const;

/** WhatsApp deep link with a message already written for this service. */
export function whatsappLink(message: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}
