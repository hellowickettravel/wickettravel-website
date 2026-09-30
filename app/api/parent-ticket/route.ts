/**
 * Same-origin relay for the Parents Tickets lead form. The portal's public API
 * only allows a fixed list of browser origins (CORS), so the client posts here
 * and we forward server-side — works from any domain the site is served on.
 * No secrets involved: the portal endpoint is public and validates server-side.
 *
 * This relay does not blindly proxy: it rate-limits per IP, validates and
 * sanitises every field against a strict allowlist, and rebuilds a clean JSON
 * body before forwarding — never passing the raw client body upstream. The
 * destination is a hardcoded constant (no user-controlled URL → no SSRF).
 */

import {
  cleanBool,
  cleanNumber,
  cleanString,
  forwardedIpHeaders,
  getClientIp,
  isEmail,
  json,
  MAX_PAYLOAD_BYTES,
  rateLimited,
} from "@/lib/relay";
import { PORTAL_ORIGIN } from "@/lib/links";

const PORTAL_ENDPOINT = `${PORTAL_ORIGIN}/api/parent-ticket`;

type Clean = Record<string, string | number | boolean>;

/**
 * The form and this relay's validation speak the website's field names; the
 * portal stores three of them under different names and silently ignores
 * keys it doesn't know. So they are renamed on the way out, and any field
 * errors the portal sends back are renamed on the way in, so a 422 still
 * lands on the right input.
 */
const TO_PORTAL: Record<string, string> = {
  languages_spoken: "languages",
  parents_capacity: "parents_can_help",
  assistance_fee: "fee_amount",
};
const FROM_PORTAL: Record<string, string> = Object.fromEntries(
  Object.entries(TO_PORTAL).map(([site, portal]) => [portal, site])
);

function renameKeys<T>(
  value: Record<string, T>,
  map: Record<string, string>
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [map[k] ?? k, v])
  );
}
type BuildResult =
  | { ok: true; value: Clean }
  | { ok: false; fields: Record<string, string> };

/**
 * Validate + sanitise against the portal's parent-ticket contract, dropping any
 * key not in the allowlist. Numbers are range-checked; optional fields are only
 * included when present. Mirrors the client's buildPayload so valid submissions
 * pass unchanged.
 */
function build(input: Record<string, unknown>): BuildResult {
  const fields: Record<string, string> = {};
  const out: Clean = {};

  const enquiry = cleanString(input.enquiry_type, 20);
  if (enquiry !== "traveller" && enquiry !== "requester") {
    fields.enquiry_type = "Please choose an enquiry type.";
  } else {
    out.enquiry_type = enquiry;
  }

  const required: [string, number, string][] = [
    ["full_name", 120, "Please enter your full name."],
    ["phone", 40, "Please enter your phone number."],
    ["from_location", 120, "Please enter the departure city or airport."],
    ["to_location", 120, "Please enter the destination city or airport."],
  ];
  for (const [key, max, msg] of required) {
    const v = cleanString(input[key], max);
    if (!v) fields[key] = msg;
    else out[key] = v;
  }

  const email = cleanString(input.email, 254);
  if (!email || !isEmail(email)) fields.email = "Enter a valid email address.";
  else out.email = email;

  // Consent to be shown on the public community feed. Only forwarded when the
  // visitor explicitly ticked it — nothing can ever be published without it.
  const consent = cleanBool(input.consent_public);
  if (consent !== undefined) out.consent_public = consent;

  // Optional shared fields.
  const optional: [string, number][] = [
    ["travel_date", 20],
    ["airline", 120],
    ["languages_spoken", 200],
    ["notes", 4000],
  ];
  for (const [key, max] of optional) {
    const v = cleanString(input[key], max);
    if (v) out[key] = v;
  }

  const num = (key: string, min: number, max: number, msg: string) => {
    const raw = input[key];
    if (raw === undefined || raw === null || raw === "") return;
    const n = cleanNumber(raw, { min, max });
    if (n === undefined) fields[key] = msg;
    else out[key] = n;
  };

  if (enquiry === "traveller") {
    const a = cleanString(input.assistance_offered, 4000);
    if (a) out.assistance_offered = a;
    // The portal caps parents_can_help at 20.
    num("parents_capacity", 1, 20, "Enter how many people you could accompany (1–20).");
    num("assistance_fee", 0, 100, "Enter an amount between 0 and 100.");
  } else if (enquiry === "requester") {
    const pn = cleanString(input.parent_name, 120);
    if (pn) out.parent_name = pn;
    num("parent_age", 1, 120, "Enter a valid age.");
    const rel = cleanString(input.relationship, 60);
    if (rel) out.relationship = rel;
    const an = cleanString(input.assistance_needed, 4000);
    if (an) out.assistance_needed = an;
    const mn = cleanString(input.mobility_needs, 120);
    if (mn) out.mobility_needs = mn;
    num("offer_amount", 0, 100, "Enter an amount between 0 and 100.");
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return { ok: true, value: out };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (rateLimited(ip)) {
    return json(
      {
        ok: false,
        error: "Too many submissions — please wait a few minutes and try again.",
      },
      429
    );
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  if (raw.length > MAX_PAYLOAD_BYTES) {
    return json({ ok: false, error: "Request too large." }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const result = build(parsed as Record<string, unknown>);
  if (!result.ok) {
    return json(
      {
        ok: false,
        error: "Please check the highlighted fields and try again.",
        fields: result.fields,
      },
      422
    );
  }

  try {
    const upstream = await fetch(PORTAL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...forwardedIpHeaders(request),
      },
      body: JSON.stringify(renameKeys(result.value, TO_PORTAL)),
      signal: AbortSignal.timeout(55_000),
    });
    const text = await upstream.text();

    if (upstream.status === 422) {
      try {
        const body = JSON.parse(text) as Record<string, unknown>;
        if (body.fields && typeof body.fields === "object") {
          body.fields = renameKeys(
            body.fields as Record<string, unknown>,
            FROM_PORTAL
          );
        }
        return json(body, 422);
      } catch {
        // Not JSON: pass it through untouched below.
      }
    }

    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return json(
      { ok: false, error: "Could not reach the Parents Tickets service." },
      502
    );
  }
}
