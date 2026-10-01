/**
 * Sharing a Parent Travel Assist post into WhatsApp.
 *
 * WHY. The families this is for already run the service by hand, in WhatsApp
 * groups: "Mum is flying LHR→HYD on Thursday, anyone on that flight?". So
 * once someone has posted with us, the most useful next step is to take the
 * post back into those groups, with a link that lands on our page instead of
 * a phone number.
 *
 * WHAT THE LINK CARRIES. A new post isn't on the public board until a
 * coordinator approves it, and may never be if the poster didn't tick the
 * board box, so a bare `/listing/<ref>` link would open on "no longer
 * available" for the first few hours, exactly when it's being shared most.
 * The link therefore carries the route, date and airline itself, and the
 * listing page renders those when the reference isn't on the board yet.
 *
 * Only those structured fields ever go in the URL: never a name, phone,
 * email or free-text note. Anyone can hand-edit a URL, so everything read
 * back out is length-capped and pattern-checked (see readSharedDetails),
 * and it's rendered as plain text, which React escapes.
 */

import type { EnquiryType } from "@/lib/parents";

export type SharedDetails = {
  type: EnquiryType;
  from: string;
  to: string;
  /** ISO calendar date, `YYYY-MM-DD`. */
  date?: string;
  airline?: string;
};

/** The listing route's segment when the portal didn't return a reference. */
export const NO_REFERENCE_SEGMENT = "shared";

const MAX_PLACE = 80;
const MAX_AIRLINE = 60;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function clip(value: string | null | undefined, max: number): string | undefined {
  if (!value) return undefined;
  // Collapse whitespace and drop control characters. What's left is shown
  // as text, never as markup.
  const t = Array.from(value, (ch) => {
    const c = ch.codePointAt(0)!;
    return c < 32 || c === 127 ? " " : ch;
  })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  return t ? t.slice(0, max) : undefined;
}

/** The listing page's URL for a post, with its details attached. */
export function buildShareUrl(
  origin: string,
  reference: string | null,
  details: SharedDetails
): string {
  const segment = encodeURIComponent(reference ?? NO_REFERENCE_SEGMENT);
  const qs = new URLSearchParams();
  qs.set("t", details.type === "traveller" ? "o" : "r");
  qs.set("from", details.from);
  qs.set("to", details.to);
  if (details.date) qs.set("date", details.date);
  if (details.airline) qs.set("airline", details.airline);
  return `${origin}/parents-tickets/listing/${segment}?${qs.toString()}`;
}

/** Read the details back off a shared link. Anything malformed is dropped. */
export function readSharedDetails(
  params: URLSearchParams
): SharedDetails | undefined {
  const from = clip(params.get("from"), MAX_PLACE);
  const to = clip(params.get("to"), MAX_PLACE);
  if (!from || !to) return undefined;

  const rawDate = params.get("date");
  const date = rawDate && ISO_DATE.test(rawDate) ? rawDate : undefined;

  return {
    type: params.get("t") === "o" ? "traveller" : "requester",
    from,
    to,
    date,
    airline: clip(params.get("airline"), MAX_AIRLINE),
  };
}

/**
 * Any date the feed or a form sends → `YYYY-MM-DD` on the local calendar.
 * The feed sends full timestamps; the form sends bare dates.
 */
export function toIsoDay(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (ISO_DATE.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * "2026-10-08" → "Thursday 8 October 2026", read as a calendar date so it
 * can't slip a day in a timezone west of UTC. Spelled out by hand rather
 * than with toLocaleDateString: Node and Chrome ship different ICU data
 * ("Thursday, 8 October" vs "Thursday 8 October"), and this renders on both
 * sides of hydration.
 */
export function formatShareDate(iso: string | undefined): string | undefined {
  if (!iso || !ISO_DATE.test(iso)) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(date.getTime()) || date.getUTCDate() !== d) return undefined;
  return `${WEEKDAYS[date.getUTCDay()]} ${d} ${MONTHS[m - 1]} ${y}`;
}

/**
 * Who is flying, in the words a family would use in the group. The form's
 * `relationship` is the poster's relation to the traveller, so "Son" means
 * the person flying is a parent. The poster can edit the message before it
 * goes, so "my parent" is only a starting point for "my mum".
 */
function whoIsFlying(relationship: string | undefined): string {
  switch (relationship) {
    case "Son":
    case "Daughter":
      return "My parent is";
    case "Grandchild":
      return "My grandparent is";
    default:
      return "A family member of mine is";
  }
}

/**
 * The WhatsApp message. `poster` is written as the person who posted it (the
 * form's success screen); `board` is written about them, for anyone passing
 * a listing on from its page.
 */
export function buildShareMessage({
  details,
  reference,
  relationship,
  url,
  voice = "poster",
}: {
  details: SharedDetails;
  reference: string | null;
  relationship?: string;
  url: string;
  voice?: "poster" | "board";
}): string {
  const when = formatShareDate(details.date);
  const flight = [
    `${details.from} → ${details.to}`,
    when ? `on ${when}` : undefined,
    details.airline ? `with ${details.airline}` : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  const ref = reference ? ` (ref ${reference})` : "";

  if (voice === "board") {
    return details.type === "traveller"
      ? [
          "Hi everyone 👋",
          `Someone flying ${flight} is offering to keep an elderly traveller company. It's listed on Wicket Travel's Parent Travel Assist portal${ref}.`,
          "If your parents or grandparents are on this flight, you can request an introduction here:",
          url,
        ].join("\n\n")
      : [
          "Hi everyone 👋",
          `A family on Wicket Travel's Parent Travel Assist portal is looking for someone flying ${flight} to keep their elderly relative company${ref}.`,
          "If you or anyone you know is on this flight, please offer your help here:",
          url,
          "Thank you 🙏",
        ].join("\n\n");
  }

  if (details.type === "traveller") {
    return [
      "Hi everyone 👋",
      `I'm flying ${flight} and I'm happy to keep an elderly traveller company on the way.`,
      `I've listed it on Wicket Travel's Parent Travel Assist portal${ref}.`,
      "If your parents or grandparents are on this flight, you can request an introduction here:",
      url,
    ].join("\n\n");
  }

  return [
    "Hi everyone 👋",
    `${whoIsFlying(relationship)} flying ${flight} and would really appreciate some company and a helping hand on the journey.`,
    `I've submitted all the details on Wicket Travel's Parent Travel Assist portal${ref}.`,
    "If you or anyone you know is travelling on this flight, please offer your help using this link:",
    url,
    "Thank you 🙏",
  ].join("\n\n");
}

/** A WhatsApp link that opens the share sheet with the text filled in. */
export function whatsappShareHref(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * "I'm on this flight, I can help": the form on /parents-tickets, opened on
 * the helper side with the flight filled in (see ParentsEnquiryForm).
 */
export function buildHelpHref(
  details: SharedDetails,
  reference: string | null
): string {
  const qs = new URLSearchParams();
  qs.set("role", "traveller");
  qs.set("from", details.from);
  qs.set("to", details.to);
  if (details.date) qs.set("date", details.date);
  if (details.airline) qs.set("airline", details.airline);
  if (reference) qs.set("ref", reference);
  return `/parents-tickets?${qs.toString()}#post-to-the-board`;
}
