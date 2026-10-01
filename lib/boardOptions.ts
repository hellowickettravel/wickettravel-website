/**
 * Parent Travel Assist board options: the airports, airlines, languages and
 * "help needed" choices behind the board's search, filters and post form.
 *
 * SOURCE. An admin keeps these in the portal (/admin/parents-options,
 * migration 0027_parent_assist_options.sql), served via this site's relay
 * at /api/parent-ticket/options. Until that's live, or whenever it can't be
 * reached, the board uses DEFAULT_BOARD_OPTIONS below, the same lists the
 * migration seeds, so switching over changes nothing a visitor can see
 * until an admin edits something.
 *
 * Contract: keep in sync with wickettravel-portals
 * lib/parent-assist-options.ts (`PublicBoardOptions`).
 */

export type AirportRegion = "uk" | "destination";

export type BoardOptions = {
  airports: { code: string; name: string; region: AirportRegion }[];
  airlines: string[];
  languages: string[];
  /** `value` is the wording stored on a post; `label` is the short chip text. */
  supports: { value: string; label: string }[];
};

export const DEFAULT_BOARD_OPTIONS: BoardOptions = {
  airports: [
    { code: "LHR", name: "London Heathrow", region: "uk" },
    { code: "LGW", name: "London Gatwick", region: "uk" },
    { code: "MAN", name: "Manchester", region: "uk" },
    { code: "BHX", name: "Birmingham", region: "uk" },
    { code: "STN", name: "London Stansted", region: "uk" },
    { code: "EDI", name: "Edinburgh", region: "uk" },
    { code: "GLA", name: "Glasgow", region: "uk" },
    { code: "LTN", name: "London Luton", region: "uk" },
    { code: "DXB", name: "Dubai", region: "destination" },
    { code: "DEL", name: "Delhi", region: "destination" },
    { code: "BOM", name: "Mumbai", region: "destination" },
    { code: "HYD", name: "Hyderabad", region: "destination" },
    { code: "BLR", name: "Bengaluru", region: "destination" },
    { code: "ISB", name: "Islamabad", region: "destination" },
    { code: "LHE", name: "Lahore", region: "destination" },
    { code: "KHI", name: "Karachi", region: "destination" },
    { code: "AUH", name: "Abu Dhabi", region: "destination" },
    { code: "DOH", name: "Doha", region: "destination" },
    { code: "COK", name: "Kochi", region: "destination" },
    { code: "AMD", name: "Ahmedabad", region: "destination" },
    { code: "ATQ", name: "Amritsar", region: "destination" },
    { code: "DAC", name: "Dhaka", region: "destination" },
    { code: "CMB", name: "Colombo", region: "destination" },
    { code: "JED", name: "Jeddah", region: "destination" },
  ],
  airlines: [
    "Air India",
    "British Airways",
    "Emirates",
    "Etihad Airways",
    "Gulf Air",
    "Kuwait Airways",
    "Oman Air",
    "Pakistan International Airlines",
    "Qatar Airways",
    "Saudia",
    "SriLankan Airlines",
    "Turkish Airlines",
    "Virgin Atlantic",
  ],
  languages: [
    "Arabic",
    "Bengali",
    "English",
    "Gujarati",
    "Hindi",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Pashto",
    "Punjabi",
    "Sinhala",
    "Tamil",
    "Telugu",
    "Urdu",
  ],
  supports: [
    { value: "None — just company and reassurance", label: "Company only" },
    { value: "Wheelchair assistance", label: "Wheelchair help" },
    { value: "Walking aid / slow on their feet", label: "Walking aid" },
    { value: "Visual impairment", label: "Visual support" },
    { value: "Hearing impairment", label: "Hearing support" },
    { value: "Other (described in the notes)", label: "Other support" },
  ],
};

const MAX_ITEMS = 300;
const MAX_TEXT = 80;

function text(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  let out = "";
  for (const ch of v) {
    const c = ch.codePointAt(0)!;
    out += c < 32 || c === 127 ? " " : ch;
  }
  out = out.replace(/\s+/g, " ").trim().slice(0, MAX_TEXT);
  return out || undefined;
}

function list<T>(v: unknown, read: (x: unknown) => T | undefined): T[] {
  if (!Array.isArray(v)) return [];
  const out: T[] = [];
  for (const x of v.slice(0, MAX_ITEMS)) {
    const r = read(x);
    if (r !== undefined) out.push(r);
  }
  return out;
}

/**
 * Validate whatever the portal sent into BoardOptions, or null if it isn't
 * usable. A list the admin has emptied entirely falls back to the default
 * for that list, so the board never ends up with a filter that offers
 * nothing.
 */
export function sanitizeBoardOptions(raw: unknown): BoardOptions | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const airports = list(r.airports, (x) => {
    const o = (x ?? {}) as Record<string, unknown>;
    const code = text(o.code)?.toUpperCase();
    if (!code || !/^[A-Z]{3}$/.test(code)) return undefined;
    const region: AirportRegion = o.region === "uk" ? "uk" : "destination";
    return { code, name: text(o.name) ?? code, region };
  });
  const airlines = list(r.airlines, text);
  const languages = list(r.languages, text);
  const supports = list(r.supports, (x) => {
    const o = (x ?? {}) as Record<string, unknown>;
    const value = text(o.value);
    return value ? { value, label: text(o.label) ?? value } : undefined;
  });

  if (!airports.length && !airlines.length && !languages.length && !supports.length) return null;
  return {
    airports: airports.length ? airports : DEFAULT_BOARD_OPTIONS.airports,
    airlines: airlines.length ? airlines : DEFAULT_BOARD_OPTIONS.airlines,
    languages: languages.length ? languages : DEFAULT_BOARD_OPTIONS.languages,
    supports: supports.length ? supports : DEFAULT_BOARD_OPTIONS.supports,
  };
}
