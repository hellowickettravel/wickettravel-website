/**
 * Same-origin relay for the Dubai Visa form. The portal's public API only
 * allows a fixed list of browser origins (CORS), so the client posts here and
 * we forward server-side — works from any domain the site is served on.
 * No secrets involved: the portal endpoint is public and validates server-side.
 *
 * This relay does not blindly proxy the multipart body. It rate-limits per IP,
 * validates + sanitises the `payload` JSON against a strict allowlist, enforces
 * file rules (PDF/JPG/PNG, ≤10MB each, capped count), and rebuilds a clean
 * multipart body before forwarding. The destination is a hardcoded constant
 * (no user-controlled URL → no SSRF).
 */

import {
  ALLOWED_FILE_EXT,
  cleanBool,
  cleanString,
  forwardedIpHeaders,
  getClientIp,
  isEmail,
  json,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_PAYLOAD_BYTES,
  rateLimited,
} from "@/lib/relay";
import { PORTAL_ORIGIN } from "@/lib/links";

const PORTAL_ENDPOINT = `${PORTAL_ORIGIN}/api/visa-enquiry`;

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);
const CONTACT_ENUM = new Set(["phone", "whatsapp", "email"]);

// Allowlist of the portal's visa_enquiries string keys → max length. Anything
// outside this list (and the booleans/enum below) is dropped, never forwarded.
const STRING_FIELDS: Record<string, number> = {
  visa_type: 120,
  purpose_of_visit: 60,
  arrival_date: 20,
  departure_date: 20,
  planned_activities: 4000,
  first_name: 80,
  last_name: 80,
  other_names: 120,
  date_of_birth: 20,
  place_of_birth: 120,
  nationality: 80,
  gender: 40,
  marital_status: 40,
  email: 254,
  phone: 40,
  uk_address: 300,
  passport_type: 60,
  passport_number: 40,
  passport_issue_date: 20,
  passport_expiry_date: 20,
  issuing_country: 80,
  uk_visa_brp_ref: 60,
  uk_visa_start_date: 20,
  uk_visa_expiry_date: 20,
  previous_uae_visa_number: 60,
  occupation: 60,
  employer_name: 160,
  job_title: 120,
  employer_address: 300,
  who_covers_costs: 60,
  additional_notes: 4000,
};
const BOOL_FIELDS = [
  "more_than_one_person",
  "previously_visited_uae",
  "refused_entry_uae",
  "criminal_conviction",
] as const;

function buildPayload(input: Record<string, unknown>): {
  out: Record<string, unknown>;
  errors: string[];
} {
  const out: Record<string, unknown> = {};
  for (const [key, max] of Object.entries(STRING_FIELDS)) {
    const v = cleanString(input[key], max);
    if (v) out[key] = v;
  }
  for (const key of BOOL_FIELDS) {
    const v = cleanBool(input[key]);
    if (v !== undefined) out[key] = v;
  }
  const contact = cleanString(input.preferred_contact_method, 20);
  if (contact && CONTACT_ENUM.has(contact)) {
    out.preferred_contact_method = contact;
  }

  // Minimal required sanity so we don't forward obviously-empty junk. Kept in
  // step with (not stricter than) the client's required fields, so the portal
  // remains the source of truth for its full validation.
  const errors: string[] = [];
  if (!out.visa_type) errors.push("visa_type");
  if (!out.first_name) errors.push("first_name");
  if (!out.last_name) errors.push("last_name");
  if (typeof out.email !== "string" || !isEmail(out.email)) errors.push("email");
  if (!out.phone) errors.push("phone");
  return { out, errors };
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

  let form: FormData;
  try {
    // Expects multipart/form-data: a `payload` JSON string plus optional
    // `documents` file parts — the exact shape the portal accepts.
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const payloadRaw = form.get("payload");
  if (typeof payloadRaw !== "string") {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }
  if (payloadRaw.length > MAX_PAYLOAD_BYTES) {
    return json({ ok: false, error: "Request too large." }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(payloadRaw);
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const { out, errors } = buildPayload(parsed as Record<string, unknown>);
  if (errors.length > 0) {
    return json(
      {
        ok: false,
        error: "Please complete the required visa details and try again.",
      },
      422
    );
  }

  // Validate uploaded documents before accepting any of them.
  const files = form
    .getAll("documents")
    .filter((f): f is File => f instanceof File);
  if (files.length > MAX_FILES) {
    return json(
      { ok: false, error: `Please attach no more than ${MAX_FILES} files.` },
      422
    );
  }
  for (const f of files) {
    if (!ALLOWED_FILE_EXT.test(f.name) || (f.type && !ALLOWED_MIME.has(f.type))) {
      return json(
        { ok: false, error: "Only PDF, JPG and PNG files are accepted." },
        422
      );
    }
    if (f.size > MAX_FILE_BYTES) {
      return json(
        { ok: false, error: "Each file must be under 10MB." },
        422
      );
    }
  }

  // Rebuild a clean multipart body — never forward the raw, untrusted form.
  const clean = new FormData();
  clean.append("payload", JSON.stringify(out));
  for (const f of files) clean.append("documents", f, f.name);

  try {
    const upstream = await fetch(PORTAL_ENDPOINT, {
      method: "POST",
      // No Content-Type here: fetch sets the multipart boundary automatically.
      headers: { ...forwardedIpHeaders(request) },
      body: clean,
      signal: AbortSignal.timeout(55_000),
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return json(
      { ok: false, error: "Could not reach the visa enquiry service." },
      502
    );
  }
}
