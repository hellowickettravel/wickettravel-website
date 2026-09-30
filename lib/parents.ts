/**
 * Shared, server-safe constants for the Parents Tickets flow.
 *
 * Kept in a plain module (not inside the "use client" form) for the same reason
 * lib/visa.ts exists: importing plain data out of a client-boundary file into a
 * Server Component turns it into an opaque client reference during RSC
 * prerendering instead of the real array, and `.map()` then fails at build time.
 *
 * Option lists are deliberately open-ended at the end ("Other …") so nobody is
 * forced to misdescribe a real situation to fit a dropdown.
 */

/** Who the requester is to the person travelling. Sent as `relationship`. */
export const RELATIONSHIPS = [
  "Son",
  "Daughter",
  "Grandchild",
  "Niece / Nephew",
  "Other relative",
  "Friend / Carer",
] as const;

/** Sent as `mobility_needs`. Plain language, not clinical. */
export const MOBILITY_NEEDS = [
  "None — just company and reassurance",
  "Wheelchair assistance",
  "Walking aid / slow on their feet",
  "Visual impairment",
  "Hearing impairment",
  "Other (described in the notes)",
] as const;

/** The two sides of the board. `key` is the exact `enquiry_type` the API takes. */
export const ROLES = [
  {
    key: "requester",
    label: "I need help for a relative",
    blurb:
      "Someone in your family is flying alone and you would rather they were not.",
  },
  {
    key: "traveller",
    label: "I want to help someone",
    blurb:
      "You are already flying that route and are happy to keep someone company.",
  },
] as const;

export type EnquiryType = (typeof ROLES)[number]["key"];

/**
 * Shared board-entry parsing, so the board (components/AssistFamilyBoard.tsx),
 * the two full list pages and the detail page all read the same live
 * `/api/parent-ticket/public` payload the same defensive way instead of
 * three copies of the same field-picking logic drifting apart. The upstream
 * shape is not contractually frozen beyond `{ ok, count, entries }`, so every
 * field is read defensively — a missing, null or renamed key drops quietly
 * rather than breaking a card.
 */
export type Entry = Record<string, unknown>;

function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t : undefined;
}

function num(v: unknown): number | undefined {
  const n =
    typeof v === "number"
      ? v
      : typeof v === "string" && v.trim() !== ""
        ? Number(v)
        : NaN;
  return Number.isFinite(n) ? n : undefined;
}

function pick(entry: Entry, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = str(entry[k]);
    if (v) return v;
  }
  return undefined;
}

function pickNum(entry: Entry, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const v = num(entry[k]);
    if (v !== undefined) return v;
  }
  return undefined;
}

/** Render a date if it parses; otherwise show whatever the feed sent. */
export function formatEntryDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export type ParsedEntry = {
  raw: Entry;
  type: EnquiryType | undefined;
  isTraveller: boolean;
  /** True only for the worked examples in lib/parentsSample.ts. */
  isSample: boolean;
  reference: string | undefined;
  name: string | undefined;
  from: string | undefined;
  to: string | undefined;
  /** Human-formatted travel date, e.g. "4 Oct 2026". */
  date: string | undefined;
  /** The same date, unformatted, so the board can sort and bucket on it. */
  dateISO: string | undefined;
  /** When the entry was posted, unformatted — drives the "2h ago" stamp. */
  postedISO: string | undefined;
  airline: string | undefined;
  languages: string | undefined;
  body: string | undefined;
  relationship: string | undefined;
  mobility: string | undefined;
  parentAge: number | undefined;
  capacity: number | undefined;
  amount: number | undefined;
};

/** Parse one raw feed row into every field any surface (carousel, list,
 *  detail page) needs, once — so they can't disagree on how a field is read. */
export function parseEntry(entry: Entry): ParsedEntry {
  const type = pick(entry, "enquiry_type") as EnquiryType | undefined;
  const isTraveller = type === "traveller";
  return {
    raw: entry,
    type,
    isTraveller,
    isSample: entry.is_sample === true,
    reference: pick(entry, "reference", "ref", "id"),
    name: pick(entry, "display_name", "name"),
    from: pick(entry, "from_location", "from", "origin"),
    to: pick(entry, "to_location", "to", "destination"),
    date: formatEntryDate(pick(entry, "travel_date", "date")),
    dateISO: pick(entry, "travel_date", "date"),
    postedISO: pick(entry, "created_at", "createdAt", "posted_at"),
    airline: pick(entry, "airline"),
    languages: pick(entry, "languages", "languages_spoken"),
    body: pick(
      entry,
      isTraveller ? "assistance_offered" : "assistance_needed",
      "assistance_offered",
      "assistance_needed",
      "notes"
    ),
    relationship: pick(entry, "relationship"),
    mobility: pick(entry, "mobility_needs"),
    parentAge: pickNum(entry, "parent_age"),
    capacity: pickNum(entry, "parents_capacity"),
    amount: pickNum(
      entry,
      isTraveller ? "assistance_fee" : "offer_amount",
      "assistance_fee",
      "offer_amount"
    ),
  };
}

/**
 * Background art for a carousel/detail card, matched from whichever real
 * place name the poster typed into `from`/`to` — not tied to enquiry type,
 * since a family's journey and a traveller's route both come from the same
 * two free-text fields. Falls back to the hero photograph (tinted, like every
 * other unmatched-location card on the site) rather than inventing a stock
 * photo for a place nobody actually typed.
 *
 * Images: public/cities/{delhi,mumbai,bangalore,hyderabad,heathrow,
 * manchester,edinburgh}.jpg — every one of these already exists and is
 * already live elsewhere on the site (components/BestFaresByCity.tsx,
 * app/flights/page.tsx, app/hotels/page.tsx), so this reuses that same
 * photography rather than introducing a second, different picture of the
 * same city under the same path.
 *
 * Matches both the full place name and its IATA airport code, since the
 * live feed's `from_location`/`to_location` fields turn out to hold codes
 * ("HYD", "LHR") rather than names in practice — every code is anchored with
 * `\b` so it only matches as a whole word, never as a substring of something
 * else typed free-text.
 */
const PLACE_IMAGES: { match: RegExp; src: string }[] = [
  { match: /delhi|new delhi|\bdel\b/i, src: "/cities/delhi.jpg" },
  { match: /mumbai|bombay|\bbom\b/i, src: "/cities/mumbai.jpg" },
  { match: /bangalore|bengaluru|\bblr\b/i, src: "/cities/bangalore.jpg" },
  { match: /hyderabad|\bhyd\b/i, src: "/cities/hyderabad.jpg" },
  { match: /dubai|\bdxb\b/i, src: "/cities/dubai.jpg" },
  {
    match: /heathrow|\blhr\b|\blondon\b|\blgw\b|\bltn\b|\blon\b/i,
    src: "/cities/heathrow.jpg",
  },
  { match: /manchester|\bman\b/i, src: "/cities/manchester.jpg" },
  {
    match: /edinburgh|scotland|glasgow|\bedi\b|\bgla\b/i,
    src: "/cities/edinburgh.jpg",
  },
];

const FALLBACK_IMAGE = "/hero/cabin-window-wing.jpg";

export function destinationImage(...locations: (string | undefined)[]): string {
  for (const loc of locations) {
    if (!loc) continue;
    const hit = PLACE_IMAGES.find((p) => p.match.test(loc));
    if (hit) return hit.src;
  }
  return FALLBACK_IMAGE;
}

/* ═══════════════════════════════════════════════════════════════════════
   BOARD PRESENTATION HELPERS
   Shared by the board, the "departing soon" strip and the detail page so
   an avatar, a relative day or a "posted 3h ago" stamp is derived exactly
   once and can't disagree between two surfaces.
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * Avatars are drawn, never photographed. The feed is anonymised down to a
 * first name and a last initial, so there is no real face to show and a
 * stock portrait would imply we had one — these are initials on a tinted
 * disc, picked deterministically from the name so the same poster always
 * gets the same colour on every surface.
 *
 * All six pairs are brand ramps (Primary / Accent / Sand / semantic
 * surfaces). Every pair is measured against its own surface and clears the
 * 4.5:1 floor — the ratio is noted beside each. The two warm tones used to
 * set Accent 700 on Accent 100 / Warning Surface, which measured 3.89:1 and
 * 4.24:1 at the 14px the initials render at; the discs keep their colour and
 * the letters went to Primary 800.
 */
const AVATAR_TONES = [
  "bg-primary-050 text-primary-700 ring-primary-100", // 12.5:1
  "bg-accent-100 text-primary-800 ring-accent-200", //   14.0:1
  "bg-success-surface text-success ring-success/20", //  4.6:1
  "bg-info-surface text-info ring-info/20", //           5.7:1
  "bg-sand-500 text-primary-800 ring-sand-600", //      15.6:1
  "bg-warning-surface text-primary-800 ring-warning/25", // 15.3:1
] as const;

/** Stable, non-cryptographic hash — only ever used to choose a colour. */
function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function avatarTone(seed: string | undefined): string {
  return AVATAR_TONES[hashString(seed ?? "anon") % AVATAR_TONES.length];
}

/** "Priya S." → "PS"; a single word → its first two letters; nothing → "··". */
export function initialsOf(name: string | undefined): string {
  if (!name) return "··";
  const parts = name
    .replace(/[^\p{L}\p{N}\s.'-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Midnight-anchored day difference, so "today" means the calendar day. */
export function daysUntil(iso: string | undefined, now = new Date()): number | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  const a = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((a - b) / 86_400_000);
}

/** The urgency word a WhatsApp group would actually use. */
export function departureLabel(
  iso: string | undefined,
  now = new Date()
): { text: string; tone: "today" | "soon" | "later" | "past" } | undefined {
  const diff = daysUntil(iso, now);
  if (diff === undefined) return undefined;
  if (diff < 0) return { text: "Departed", tone: "past" };
  if (diff === 0) return { text: "Flying today", tone: "today" };
  if (diff === 1) return { text: "Tomorrow", tone: "today" };
  if (diff <= 7) return { text: `In ${diff} days`, tone: "soon" };
  return { text: `In ${diff} days`, tone: "later" };
}

/** "3h ago" / "2d ago" — the stamp that makes a feed feel alive. */
export function postedAgo(iso: string | undefined, now = new Date()): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  const mins = Math.max(0, Math.round((now.getTime() - d.getTime()) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.round(days / 30)}mo ago`;
}

/**
 * Everything on a card that a visitor might plausibly type into the search
 * box, flattened into one lowercased haystack. Deliberately includes the
 * reference so someone can paste the code they were given and land on their
 * own entry.
 */
export function searchHaystack(e: ParsedEntry): string {
  return [
    e.name,
    e.from,
    e.to,
    e.airline,
    e.languages,
    e.body,
    e.relationship,
    e.mobility,
    e.reference,
    e.date,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Split a free-text place into a code and a name. Posters and the live feed
 * disagree about this field: the portal stores bare IATA codes ("HYD"),
 * while the form lets someone type "London Heathrow (LHR)". Both have to
 * render as the same big-code / small-name pair on a card, so:
 *
 *   "London Heathrow (LHR)" → { code: "LHR", name: "London Heathrow" }
 *   "HYD"                   → { code: "HYD", name: undefined }
 *   "Kochi"                 → { code: undefined, name: "Kochi" }
 *
 * Nothing is invented: a place with no code in it simply doesn't get one,
 * and the card falls back to showing the name at code size.
 */
export function splitPlace(value: string | undefined): {
  code: string | undefined;
  name: string | undefined;
} {
  if (!value) return { code: undefined, name: undefined };
  const trimmed = value.trim();

  const bracketed = trimmed.match(/^(.*?)\s*\(([A-Za-z]{3})\)\s*$/);
  if (bracketed) {
    return {
      code: bracketed[2].toUpperCase(),
      name: bracketed[1].trim() || undefined,
    };
  }

  if (/^[A-Za-z]{3}$/.test(trimmed)) {
    return { code: trimmed.toUpperCase(), name: undefined };
  }

  return { code: undefined, name: trimmed };
}

/** The label a filter dropdown should show for a place: code if there is one. */
export function placeKey(value: string | undefined): string | undefined {
  const { code, name } = splitPlace(value);
  return code ?? name;
}
