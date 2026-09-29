/**
 * Example board entries — the placeholder feed.
 *
 * WHY THIS EXISTS. The board's only real source is the portal relay at
 * /api/parent-ticket/public (see app/api/parent-ticket/public/route.ts), and
 * that upstream is currently returning 404 DEPLOYMENT_NOT_FOUND. Every board
 * surface therefore rendered an error panel or an empty state, which is why
 * the page read as broken: a "community board" with nothing on it teaches a
 * first-time visitor that nobody is here, and they leave.
 *
 * So when — and only when — the live feed returns nothing usable, the board
 * falls back to these worked examples so a visitor can see what the platform
 * is and how it behaves. They are NOT passed off as real people:
 *
 *   • every reference is prefixed `WT-DEMO-`, which no live reference uses;
 *   • every row carries `is_sample: true`, and the card renders an "Example"
 *     tag off it;
 *   • the board shows a banner above the results saying these are examples
 *     and the live board is quiet, with a real CTA to post;
 *   • the moment the relay returns even one real entry, none of this renders.
 *
 * Nothing here is billed, contactable or linked to a real person: the names
 * are invented in the same shortened shape the real feed publishes (first
 * name, last initial) and there are no contact details, because the live
 * payload has none either.
 *
 * Dates are built relative to "now" at call time rather than hardcoded, so
 * the examples never rot into a board full of last year's flights. The
 * function is called from inside the client effect, never at module scope,
 * so the server and client renders can't disagree on what "today" is.
 */

import type { Entry } from "@/lib/parents";

function isoInDays(days: number, hour = 9): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function isoHoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

type Seed = {
  ref: string;
  name: string;
  from: string;
  to: string;
  inDays: number;
  postedHoursAgo: number;
  airline: string;
  languages: string;
  amount: number;
  body: string;
  /** Requester-only. */
  relationship?: string;
  parentAge?: number;
  mobility?: string;
  /** Traveller-only. */
  capacity?: number;
};

const REQUESTERS: Seed[] = [
  {
    ref: "WT-DEMO-4182",
    name: "Priya S.",
    from: "London Heathrow (LHR)",
    to: "Hyderabad (HYD)",
    inDays: 0,
    postedHoursAgo: 3,
    airline: "British Airways",
    languages: "Telugu, Hindi, English",
    amount: 60,
    body: "My mother flies this evening and it is her first time changing terminals on her own. She just needs someone to walk her from check-in to the gate and stay nearby on the flight.",
    relationship: "Daughter",
    parentAge: 74,
    mobility: "Walking aid / slow on their feet",
  },
  {
    ref: "WT-DEMO-4177",
    name: "Imran K.",
    from: "Manchester (MAN)",
    to: "Dubai (DXB)",
    inDays: 2,
    postedHoursAgo: 9,
    airline: "Emirates",
    languages: "Urdu, Punjabi, English",
    amount: 50,
    body: "Dad is 79 and has a four-hour connection in Dubai. Company through the transfer would take a huge weight off our minds.",
    relationship: "Son",
    parentAge: 79,
    mobility: "Wheelchair assistance",
  },
  {
    ref: "WT-DEMO-4169",
    name: "Aisha R.",
    from: "London Gatwick (LGW)",
    to: "Delhi (DEL)",
    inDays: 5,
    postedHoursAgo: 22,
    airline: "Air India",
    languages: "Hindi, English",
    amount: 75,
    body: "Grandmother travelling to family in Delhi. She has no English beyond a few words and gets anxious at security.",
    relationship: "Grandchild",
    parentAge: 82,
    mobility: "None — just company and reassurance",
  },
  {
    ref: "WT-DEMO-4160",
    name: "Daniel O.",
    from: "Birmingham (BHX)",
    to: "Mumbai (BOM)",
    inDays: 9,
    postedHoursAgo: 30,
    airline: "Vistara",
    languages: "Marathi, Hindi, English",
    amount: 45,
    body: "My mother-in-law is visiting her sister. Happy to meet whoever helps at the airport beforehand so everyone is comfortable.",
    relationship: "Other relative",
    parentAge: 71,
    mobility: "Visual impairment",
  },
  {
    ref: "WT-DEMO-4151",
    name: "Sana M.",
    from: "London Heathrow (LHR)",
    to: "Bangalore (BLR)",
    inDays: 12,
    postedHoursAgo: 44,
    airline: "British Airways",
    languages: "Kannada, Hindi, English",
    amount: 80,
    body: "Both parents flying together, but neither has travelled since 2019 and the terminal has changed. Mostly reassurance and help with the machines.",
    relationship: "Daughter",
    parentAge: 77,
    mobility: "None — just company and reassurance",
  },
  {
    ref: "WT-DEMO-4143",
    name: "Yusuf A.",
    from: "Edinburgh (EDI)",
    to: "Abu Dhabi (AUH)",
    inDays: 16,
    postedHoursAgo: 61,
    airline: "Etihad Airways",
    languages: "Arabic, English",
    amount: 55,
    body: "My father is hard of hearing and misses gate announcements. Someone to keep an eye on the boards with him is all we need.",
    relationship: "Son",
    parentAge: 80,
    mobility: "Hearing impairment",
  },
  {
    ref: "WT-DEMO-4138",
    name: "Meera P.",
    from: "London Luton (LTN)",
    to: "Kochi (COK)",
    inDays: 21,
    postedHoursAgo: 80,
    airline: "Air India Express",
    languages: "Malayalam, English",
    amount: 40,
    body: "Aunt returning home after a long stay. Two heavy cases and she cannot manage both at the transfer.",
    relationship: "Niece / Nephew",
    parentAge: 68,
    mobility: "Walking aid / slow on their feet",
  },
  {
    ref: "WT-DEMO-4129",
    name: "Harjit S.",
    from: "Manchester (MAN)",
    to: "Delhi (DEL)",
    inDays: 28,
    postedHoursAgo: 96,
    airline: "Virgin Atlantic",
    languages: "Punjabi, Hindi, English",
    amount: 70,
    body: "Mum is flying out for a wedding and will be on her own both ways. Return leg is three weeks later if anyone is on that route too.",
    relationship: "Son",
    parentAge: 73,
    mobility: "None — just company and reassurance",
  },
];

const TRAVELLERS: Seed[] = [
  {
    ref: "WT-DEMO-4185",
    name: "Nadia H.",
    from: "London Heathrow (LHR)",
    to: "Dubai (DXB)",
    inDays: 0,
    postedHoursAgo: 1,
    airline: "Emirates",
    languages: "Arabic, Urdu, English",
    amount: 0,
    body: "Flying out tonight and happy to look after someone the whole way through — check-in, security and handover at arrivals. No charge, I do this route monthly.",
    capacity: 2,
  },
  {
    ref: "WT-DEMO-4180",
    name: "Rahul V.",
    from: "London Heathrow (LHR)",
    to: "Hyderabad (HYD)",
    inDays: 1,
    postedHoursAgo: 5,
    airline: "British Airways",
    languages: "Telugu, Hindi, English",
    amount: 25,
    body: "Already booked, aisle seat, travelling light. Glad to sit with an older passenger and get them to the family at the other end.",
    capacity: 1,
  },
  {
    ref: "WT-DEMO-4174",
    name: "Fatima B.",
    from: "Manchester (MAN)",
    to: "Islamabad (ISB)",
    inDays: 4,
    postedHoursAgo: 14,
    airline: "Qatar Airways",
    languages: "Urdu, Punjabi, English",
    amount: 30,
    body: "I travel with my own children so I am used to a slow pace and long transfers. Can help with wheelchair assistance requests at both ends.",
    capacity: 2,
  },
  {
    ref: "WT-DEMO-4166",
    name: "James T.",
    from: "London Gatwick (LGW)",
    to: "Delhi (DEL)",
    inDays: 6,
    postedHoursAgo: 26,
    airline: "Air India",
    languages: "English, basic Hindi",
    amount: 0,
    body: "Work trip, same flight every quarter. Happy to be the person who knows where the gate is — no payment wanted.",
    capacity: 1,
  },
  {
    ref: "WT-DEMO-4158",
    name: "Anjali D.",
    from: "Birmingham (BHX)",
    to: "Mumbai (BOM)",
    inDays: 10,
    postedHoursAgo: 38,
    airline: "Vistara",
    languages: "Marathi, Gujarati, Hindi, English",
    amount: 35,
    body: "Nurse, so I am comfortable with medication timings and mobility needs. Can meet the family at departures an hour early.",
    capacity: 1,
  },
  {
    ref: "WT-DEMO-4149",
    name: "Omar S.",
    from: "London Heathrow (LHR)",
    to: "Abu Dhabi (AUH)",
    inDays: 14,
    postedHoursAgo: 52,
    airline: "Etihad Airways",
    languages: "Arabic, English",
    amount: 20,
    body: "Regular on this route. Can handle the Abu Dhabi transfer, which is where most people get lost.",
    capacity: 3,
  },
  {
    ref: "WT-DEMO-4141",
    name: "Grace N.",
    from: "Edinburgh (EDI)",
    to: "London Heathrow (LHR)",
    inDays: 18,
    postedHoursAgo: 70,
    airline: "British Airways",
    languages: "English",
    amount: 0,
    body: "Short domestic hop, but it is the leg families worry about most. Happy to hand someone over to their long-haul assistance at Heathrow.",
    capacity: 2,
  },
  {
    ref: "WT-DEMO-4132",
    name: "Bilal Q.",
    from: "Manchester (MAN)",
    to: "Lahore (LHE)",
    inDays: 25,
    postedHoursAgo: 88,
    airline: "Qatar Airways",
    languages: "Urdu, Punjabi, English",
    amount: 40,
    body: "Travelling with my brother so there are two of us. We can take an elderly couple rather than just one person.",
    capacity: 4,
  },
];

function toEntry(seed: Seed, type: "requester" | "traveller"): Entry {
  const base: Entry = {
    is_sample: true,
    enquiry_type: type,
    reference: seed.ref,
    display_name: seed.name,
    from_location: seed.from,
    to_location: seed.to,
    travel_date: isoInDays(seed.inDays),
    created_at: isoHoursAgo(seed.postedHoursAgo),
    airline: seed.airline,
    languages: seed.languages,
  };

  if (type === "traveller") {
    base.assistance_offered = seed.body;
    base.assistance_fee = seed.amount;
    base.parents_capacity = seed.capacity;
  } else {
    base.assistance_needed = seed.body;
    base.offer_amount = seed.amount;
    base.relationship = seed.relationship;
    base.parent_age = seed.parentAge;
    base.mobility_needs = seed.mobility;
  }

  return base;
}

/** Built fresh on each call so "today" is always actually today. */
export function buildSampleEntries(): Entry[] {
  return [
    ...REQUESTERS.map((s) => toEntry(s, "requester")),
    ...TRAVELLERS.map((s) => toEntry(s, "traveller")),
  ].sort(
    (a, b) =>
      new Date(String(a.travel_date)).getTime() -
      new Date(String(b.travel_date)).getTime()
  );
}
