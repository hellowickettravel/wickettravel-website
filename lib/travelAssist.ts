/**
 * Parents Travel Assist — data for the /parents-tickets page.
 *
 * Plain, server-safe module (no "use client") for the same reason
 * lib/parents.ts and lib/visa.ts exist: a Server Component can import these
 * arrays directly without them becoming opaque client references.
 *
 * ── The board is SAMPLE content ─────────────────────────────────────────────
 * `SAMPLE_REQUESTS` and `SAMPLE_OFFERS` are illustrative listings, written to
 * show visitors what the matching service looks like while the board is being
 * set up. The page labels them as examples (see AssistBoard). To go live, swap
 * these two arrays for the real feed — `useParentBoard()` in
 * lib/useParentBoard.ts already reads /api/parent-ticket/public, and its
 * `ParsedEntry` carries the same route/date/airline/language fields — and drop
 * the "sample" note in the board header.
 *
 * Dates are stored as offsets from today (not fixed calendar dates) so the
 * samples never show a journey that has already flown. Sample photos are
 * licensed stock (Pexels licence) standing in for real members — replace them
 * with members' own photos (or initials) when the live feed goes in.
 */

export type AirportOption = { code: string; city: string; name: string };

/** Where parents fly from. Ordered by how often families ask for them. */
export const INDIA_AIRPORTS: AirportOption[] = [
  { code: "DEL", city: "Delhi", name: "Indira Gandhi Intl" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Intl" },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel Intl" },
  { code: "ATQ", city: "Amritsar", name: "Sri Guru Ram Dass Jee Intl" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi Intl" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda Intl" },
  { code: "MAA", city: "Chennai", name: "Chennai Intl" },
  { code: "COK", city: "Kochi", name: "Cochin Intl" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose Intl" },
  { code: "GOI", city: "Goa", name: "Dabolim / Mopa" },
];

/** Where they land. */
export const UK_AIRPORTS: AirportOption[] = [
  { code: "LHR", city: "London", name: "Heathrow" },
  { code: "LGW", city: "London", name: "Gatwick" },
  { code: "MAN", city: "Manchester", name: "Manchester" },
  { code: "BHX", city: "Birmingham", name: "Birmingham" },
  { code: "EDI", city: "Edinburgh", name: "Edinburgh" },
  { code: "GLA", city: "Glasgow", name: "Glasgow" },
];

const ALL_AIRPORTS = [...INDIA_AIRPORTS, ...UK_AIRPORTS];

/** "DEL" -> "Delhi". Falls back to the code itself for anything unlisted. */
export function cityOf(code: string): string {
  return ALL_AIRPORTS.find((a) => a.code === code)?.city ?? code;
}

/** "London Heathrow (LHR)", "Manchester (MAN)", "Delhi (DEL)" — unambiguous
 *  where a city has more than one listed airport, short everywhere else. */
export function placeLabel(code: string): string {
  const uk = UK_AIRPORTS.find((a) => a.code === code);
  const name = uk && uk.name !== uk.city ? `${uk.city} ${uk.name}` : cityOf(code);
  return `${name} (${code})`;
}

/** Kinds of help — what a family asks for, and what a traveller offers. */
export const HELP_TYPES = [
  { key: "wheelchair", label: "Wheelchair" },
  { key: "transit", label: "Transit connection" },
  { key: "language", label: "Language & forms" },
  { key: "first", label: "First flight abroad" },
  { key: "mobility", label: "Walking support" },
] as const;

export type HelpKey = (typeof HELP_TYPES)[number]["key"];

export function helpLabel(key: HelpKey): string {
  return HELP_TYPES.find((h) => h.key === key)?.label ?? key;
}

/** Languages the board can filter on — the ones families ask for most. */
export const LANGUAGES = [
  "Hindi",
  "Punjabi",
  "Gujarati",
  "Urdu",
  "Bengali",
  "Marathi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
] as const;

type BaseListing = {
  id: string;
  /** Public display name — first name + last initial only, never a full name. */
  name: string;
  /** Photo under /public. Sample listings use licensed stock photography. */
  photo: string;
  from: string;
  to: string;
  /** Days from today. */
  dayOffset: number;
  airline: string;
  languages: string[];
  /** One line, in the poster's own voice. */
  line: string;
};

/** A family asking for someone to travel with their parent(s). */
export type RequestListing = BaseListing & {
  kind: "request";
  /** Who is flying, e.g. "Her parents, 68 & 72". */
  who: string;
  /** How many parents are flying. */
  travellers: number;
  needs: HelpKey[];
};

/** A traveller already booked on a route, offering to help. */
export type OfferListing = BaseListing & {
  kind: "offer";
  /** "Student, flying back to London" … */
  about: string;
  /** How many passengers they're happy to accompany. */
  capacity: number;
  helpsWith: HelpKey[];
};

export type Listing = RequestListing | OfferListing;

const PEOPLE = "/parents-travel-assist/people";

export const SAMPLE_REQUESTS: RequestListing[] = [
  {
    kind: "request",
    id: "r1",
    name: "Priya S.",
    photo: `${PEOPLE}/priya-parents.jpg`,
    who: "Her parents, 68 & 72",
    from: "DEL",
    to: "LHR",
    dayOffset: 5,
    travellers: 2,
    airline: "Air India",
    languages: ["Hindi", "English"],
    needs: ["first", "language"],
    line: "Mum and Dad’s first flight to London — hoping for a kind face on board.",
  },
  {
    kind: "request",
    id: "r2",
    name: "Harjit K.",
    photo: `${PEOPLE}/harjit-mother.jpg`,
    who: "His mother, 74",
    from: "ATQ",
    to: "BHX",
    dayOffset: 9,
    travellers: 1,
    airline: "Qatar Airways",
    languages: ["Punjabi"],
    needs: ["transit", "wheelchair"],
    line: "Mum only speaks Punjabi and changes in Doha. Need someone to walk her through.",
  },
  {
    kind: "request",
    id: "r3",
    name: "Ramesh P.",
    photo: `${PEOPLE}/ramesh-parents.jpg`,
    who: "His parents, 65 & 70",
    from: "AMD",
    to: "LHR",
    dayOffset: 13,
    travellers: 2,
    airline: "Air India",
    languages: ["Gujarati", "Hindi"],
    needs: ["language"],
    line: "Coming for the baby’s arrival. Help with the landing forms would mean everything.",
  },
  {
    kind: "request",
    id: "r4",
    name: "Lakshmi V.",
    photo: `${PEOPLE}/lakshmi-father.jpg`,
    who: "Her father, 78",
    from: "HYD",
    to: "LHR",
    dayOffset: 3,
    travellers: 1,
    airline: "British Airways",
    languages: ["Telugu", "English"],
    needs: ["mobility"],
    line: "Dad is slow on his feet. Company from check-in to arrivals, please.",
  },
  {
    kind: "request",
    id: "r5",
    name: "Sunita M.",
    photo: `${PEOPLE}/sunita-mother.jpg`,
    who: "Her mother, 71",
    from: "BOM",
    to: "MAN",
    dayOffset: 7,
    travellers: 1,
    airline: "Emirates",
    languages: ["Marathi", "Hindi"],
    needs: ["wheelchair", "transit"],
    line: "Mum uses a wheelchair at airports. Just need someone to stay close.",
  },
  {
    kind: "request",
    id: "r6",
    name: "Anand N.",
    photo: `${PEOPLE}/anand-parents.jpg`,
    who: "His parents, 69 & 75",
    from: "DEL",
    to: "LHR",
    dayOffset: 16,
    travellers: 2,
    airline: "Air India",
    languages: ["Hindi"],
    needs: ["first", "mobility"],
    line: "First time out of India. Someone patient on the same flight would be perfect.",
  },
  {
    kind: "request",
    id: "r7",
    name: "Vikram R.",
    photo: `${PEOPLE}/vikram-father.jpg`,
    who: "His father, 76",
    from: "DEL",
    to: "MAN",
    dayOffset: 11,
    travellers: 1,
    airline: "IndiGo",
    languages: ["Hindi", "Punjabi"],
    needs: ["first", "language"],
    line: "Flying in for my graduation — his first trip outside India.",
  },
  {
    kind: "request",
    id: "r8",
    name: "Farah A.",
    photo: `${PEOPLE}/farah-grandmother.jpg`,
    who: "Her grandmother, 80",
    from: "BLR",
    to: "LHR",
    dayOffset: 18,
    travellers: 1,
    airline: "British Airways",
    languages: ["Kannada", "Urdu"],
    needs: ["language", "mobility"],
    line: "Nani is hard of hearing. Someone to catch the announcements would be a huge help.",
  },
];

export const SAMPLE_OFFERS: OfferListing[] = [
  {
    kind: "offer",
    id: "o1",
    name: "Arjun M.",
    photo: `${PEOPLE}/arjun.jpg`,
    about: "Student, flying back to London",
    from: "DEL",
    to: "LHR",
    dayOffset: 5,
    capacity: 2,
    airline: "Air India",
    languages: ["Hindi", "Punjabi", "English"],
    helpsWith: ["language", "first", "mobility"],
    line: "Happy to help with bags, forms and the long walk at Heathrow.",
  },
  {
    kind: "offer",
    id: "o2",
    name: "Neha R.",
    photo: `${PEOPLE}/neha.jpg`,
    about: "Returning to London after a visit",
    from: "DEL",
    to: "LHR",
    dayOffset: 6,
    capacity: 2,
    airline: "British Airways",
    languages: ["Hindi", "English"],
    helpsWith: ["first", "language"],
    line: "Flown this route 20+ times. Glad to sit with an elderly couple.",
  },
  {
    kind: "offer",
    id: "o3",
    name: "Gurpreet S.",
    photo: `${PEOPLE}/gurpreet.jpg`,
    about: "Nurse, NHS Birmingham",
    from: "ATQ",
    to: "BHX",
    dayOffset: 9,
    capacity: 1,
    airline: "Qatar Airways",
    languages: ["Punjabi", "Hindi"],
    helpsWith: ["wheelchair", "transit", "mobility"],
    line: "Comfortable with wheelchair assistance and the Doha connection.",
  },
  {
    kind: "offer",
    id: "o4",
    name: "Kavya R.",
    photo: `${PEOPLE}/kavya.jpg`,
    about: "Engineer, travelling solo",
    from: "HYD",
    to: "LHR",
    dayOffset: 3,
    capacity: 1,
    airline: "British Airways",
    languages: ["Telugu", "Hindi", "English"],
    helpsWith: ["mobility", "language"],
    line: "Travelling alone and would honestly love the company.",
  },
  {
    kind: "offer",
    id: "o5",
    name: "Imran Q.",
    photo: `${PEOPLE}/imran.jpg`,
    about: "Frequent flyer via Dubai",
    from: "BOM",
    to: "MAN",
    dayOffset: 8,
    capacity: 1,
    airline: "Emirates",
    languages: ["Hindi", "Urdu", "Marathi"],
    helpsWith: ["transit", "wheelchair"],
    line: "Through Dubai most months — I can guide the transit.",
  },
  {
    kind: "offer",
    id: "o6",
    name: "Deepa J.",
    photo: `${PEOPLE}/deepa.jpg`,
    about: "Travelling with her family",
    from: "AMD",
    to: "LHR",
    dayOffset: 13,
    capacity: 2,
    airline: "Air India",
    languages: ["Gujarati", "Hindi"],
    helpsWith: ["language", "first"],
    line: "Two more at our row is no trouble — happy to help with forms.",
  },
  {
    kind: "offer",
    id: "o7",
    name: "Joseph T.",
    photo: `${PEOPLE}/joseph.jpg`,
    about: "Returning after a holiday",
    from: "DEL",
    to: "LHR",
    dayOffset: 16,
    capacity: 2,
    airline: "Air India",
    languages: ["Hindi", "Malayalam", "English"],
    helpsWith: ["first", "mobility"],
    line: "Patient and unhurried — happy to stay together start to finish.",
  },
  {
    kind: "offer",
    id: "o8",
    name: "Sana K.",
    photo: `${PEOPLE}/sana.jpg`,
    about: "Postgraduate student",
    from: "BLR",
    to: "LHR",
    dayOffset: 19,
    capacity: 1,
    airline: "British Airways",
    languages: ["Kannada", "Urdu", "English"],
    helpsWith: ["language", "mobility"],
    line: "Happy to help with announcements, forms and the walk to arrivals.",
  },
];

/** How close two journeys' dates must be to count as a possible match. */
export const MATCH_WINDOW_DAYS = 3;

/** How many days the availability strip shows. */
export const STRIP_DAYS = 21;

/**
 * Listings a request could be paired with (and vice versa): same route, dates
 * within MATCH_WINDOW_DAYS, and — for an offer — room for every parent flying.
 */
export function possibleMatches(listing: Listing, pool: Listing[]): Listing[] {
  return pool.filter((other) => {
    if (other.kind === listing.kind) return false;
    if (other.from !== listing.from || other.to !== listing.to) return false;
    if (Math.abs(other.dayOffset - listing.dayOffset) > MATCH_WINDOW_DAYS) return false;
    const request = listing.kind === "request" ? listing : (other as RequestListing);
    const offer = listing.kind === "offer" ? listing : (other as OfferListing);
    return offer.capacity >= request.travellers;
  });
}

/**
 * Real, public Trustpilot reviews of Wicket Travel Limited, quoted verbatim
 * from https://www.trustpilot.com/review/wickettravel.com (checked 25 Sep
 * 2026). Reviewer names are shortened to first name + initial;
 * text is quoted exactly, never trimmed or reworded. Never add a
 * review here that isn't on that page — invented or edited reviews are
 * unlawful in the UK (DMCC Act 2024) and would undo the page's whole point.
 */
export const TRUSTPILOT_REVIEWS: {
  name: string;
  date: string;
  text: string;
}[] = [
  {
    name: "Nidhi T.",
    date: "Aug 2026",
    text: "They are very helpful, they helped me in getting desired seats for my parents. Thank u",
  },
  {
    name: "Uma R.",
    date: "Jul 2026",
    text: "I would especially like to thank Mr. Nagaraju for helping us today and protecting us from what could have been a fraudulent transaction.",
  },
  {
    name: "HariKrishna S.",
    date: "Aug 2026",
    text: "Wicket Travel provided the best service for my recent trip. Their customer service, pricing, and due diligence are top-notch.",
  },
  {
    name: "Hari L.",
    date: "Jul 2026",
    text: "My daughter and I had to book a last-minute trip to India, and WicketTravel made the process much easier.",
  },
  {
    name: "Kumar P.",
    date: "Jul 2026",
    text: "This is my third booking with them in the last 3 months, and every time they've offered the cheapest price I couldn't find anywhere else.",
  },
  {
    name: "Venu",
    date: "Jun 2026",
    text: "Best experience! I received accurate and clear information about available flights and ticket prices, which made the process simple and hassle-free.",
  },
];
