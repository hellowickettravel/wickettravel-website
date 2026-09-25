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
 * samples never show a journey that has already flown.
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

/** One-tap shortcuts under the search widget — the busiest family corridors. */
export const POPULAR_CORRIDORS: { from: string; to: string }[] = [
  { from: "DEL", to: "LHR" },
  { from: "BOM", to: "LHR" },
  { from: "AMD", to: "LHR" },
  { from: "ATQ", to: "BHX" },
  { from: "HYD", to: "LHR" },
  { from: "COK", to: "LHR" },
];

type BaseListing = {
  id: string;
  /** Public display name — first name + last initial only, never a full name. */
  name: string;
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
  /** "for her parents", "for his mother" … */
  forWhom: string;
  /** How many parents are flying. */
  travellers: number;
  /** Short needs tags, shown as chips. */
  needs: string[];
};

/** A traveller already booked on a route, offering to help. */
export type OfferListing = BaseListing & {
  kind: "offer";
  /** "Student, flying home" … */
  about: string;
  /** How many passengers they're happy to accompany. */
  capacity: number;
};

export type Listing = RequestListing | OfferListing;

export const SAMPLE_REQUESTS: RequestListing[] = [
  {
    kind: "request",
    id: "r1",
    name: "Priya S.",
    forWhom: "for her parents",
    from: "DEL",
    to: "LHR",
    dayOffset: 12,
    travellers: 2,
    airline: "Air India",
    languages: ["Hindi", "English"],
    needs: ["First long-haul"],
    line: "Mum and Dad's first flight to London — hoping for a kind face on board.",
  },
  {
    kind: "request",
    id: "r2",
    name: "Harjit K.",
    forWhom: "for his mother",
    from: "ATQ",
    to: "BHX",
    dayOffset: 19,
    travellers: 1,
    airline: "Qatar Airways",
    languages: ["Punjabi"],
    needs: ["Transit in Doha", "Wheelchair"],
    line: "Mum only speaks Punjabi and changes in Doha. Need someone to walk her through.",
  },
  {
    kind: "request",
    id: "r3",
    name: "Ramesh P.",
    forWhom: "for his parents",
    from: "AMD",
    to: "LHR",
    dayOffset: 26,
    travellers: 2,
    airline: "Air India",
    languages: ["Gujarati", "Hindi"],
    needs: ["Landing forms"],
    line: "Coming for the baby's arrival. Help with forms and immigration would mean everything.",
  },
  {
    kind: "request",
    id: "r4",
    name: "Lakshmi V.",
    forWhom: "for her father",
    from: "HYD",
    to: "LHR",
    dayOffset: 9,
    travellers: 1,
    airline: "British Airways",
    languages: ["Telugu", "English"],
    needs: ["Walking aid"],
    line: "Dad is 78 and slow on his feet. Company from check-in to arrivals, please.",
  },
  {
    kind: "request",
    id: "r5",
    name: "Sunita M.",
    forWhom: "for her mother",
    from: "BOM",
    to: "MAN",
    dayOffset: 15,
    travellers: 1,
    airline: "Emirates",
    languages: ["Marathi", "Hindi"],
    needs: ["Wheelchair", "Transit in Dubai"],
    line: "Mum uses a wheelchair at airports. Just need someone to stay close.",
  },
  {
    kind: "request",
    id: "r6",
    name: "Anand N.",
    forWhom: "for his parents",
    from: "COK",
    to: "LHR",
    dayOffset: 33,
    travellers: 2,
    airline: "Emirates",
    languages: ["Malayalam"],
    needs: ["Transit in Dubai"],
    line: "First time connecting in Dubai. Someone on both flights would be perfect.",
  },
  {
    kind: "request",
    id: "r7",
    name: "Vikram R.",
    forWhom: "for his parents",
    from: "DEL",
    to: "MAN",
    dayOffset: 22,
    travellers: 2,
    airline: "IndiGo",
    languages: ["Hindi"],
    needs: ["First time abroad"],
    line: "Flying in for my graduation — their first trip outside India.",
  },
  {
    kind: "request",
    id: "r8",
    name: "Farah A.",
    forWhom: "for her grandmother",
    from: "BLR",
    to: "LHR",
    dayOffset: 40,
    travellers: 1,
    airline: "British Airways",
    languages: ["Kannada", "Urdu"],
    needs: ["Hard of hearing"],
    line: "Nani is hard of hearing. Someone to catch the announcements would be a huge help.",
  },
];

export const SAMPLE_OFFERS: OfferListing[] = [
  {
    kind: "offer",
    id: "o1",
    name: "Arjun M.",
    about: "Student, flying back to London",
    from: "DEL",
    to: "LHR",
    dayOffset: 12,
    capacity: 2,
    airline: "Air India",
    languages: ["Hindi", "Punjabi", "English"],
    line: "Happy to help with bags, forms and the long walk at Heathrow.",
  },
  {
    kind: "offer",
    id: "o2",
    name: "Neha & Rohit",
    about: "Couple returning home",
    from: "DEL",
    to: "LHR",
    dayOffset: 14,
    capacity: 2,
    airline: "British Airways",
    languages: ["Hindi", "English"],
    line: "Flown this route 20+ times. Glad to sit with an elderly couple.",
  },
  {
    kind: "offer",
    id: "o3",
    name: "Gurpreet S.",
    about: "Nurse, NHS Birmingham",
    from: "ATQ",
    to: "BHX",
    dayOffset: 18,
    capacity: 1,
    airline: "Qatar Airways",
    languages: ["Punjabi", "Hindi"],
    line: "Comfortable with wheelchair assistance and the Doha connection.",
  },
  {
    kind: "offer",
    id: "o4",
    name: "Kavya R.",
    about: "Engineer, travelling solo",
    from: "HYD",
    to: "LHR",
    dayOffset: 9,
    capacity: 1,
    airline: "British Airways",
    languages: ["Telugu", "Hindi", "English"],
    line: "Travelling alone and would honestly love the company.",
  },
  {
    kind: "offer",
    id: "o5",
    name: "Imran Q.",
    about: "Frequent flyer",
    from: "BOM",
    to: "MAN",
    dayOffset: 16,
    capacity: 1,
    airline: "Emirates",
    languages: ["Hindi", "Urdu", "Marathi"],
    line: "Through Dubai most months — I can guide the transit.",
  },
  {
    kind: "offer",
    id: "o6",
    name: "Deepa J.",
    about: "Family of three",
    from: "AMD",
    to: "LHR",
    dayOffset: 27,
    capacity: 2,
    airline: "Air India",
    languages: ["Gujarati", "Hindi"],
    line: "Travelling with our kids — two more at our row is no trouble.",
  },
  {
    kind: "offer",
    id: "o7",
    name: "Joseph T.",
    about: "Returning after holiday",
    from: "COK",
    to: "LHR",
    dayOffset: 33,
    capacity: 2,
    airline: "Emirates",
    languages: ["Malayalam", "English"],
    line: "Know Dubai airport well — happy to stay together on both legs.",
  },
  {
    kind: "offer",
    id: "o8",
    name: "Sana K.",
    about: "Postgraduate student",
    from: "BLR",
    to: "LHR",
    dayOffset: 38,
    capacity: 1,
    airline: "British Airways",
    languages: ["Kannada", "Urdu", "English"],
    line: "Patient, and happy to help with announcements and forms.",
  },
];

/** How close two journeys' dates must be to count as a possible match. */
export const MATCH_WINDOW_DAYS = 3;

/** How far either side of a searched date the board still shows a listing. */
export const SEARCH_WINDOW_DAYS = 7;

/**
 * Offers a request could be paired with (and vice versa): same route, dates
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
