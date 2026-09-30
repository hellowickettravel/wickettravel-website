/**
 * Same-origin read relay for the public "Parents Tickets" community listings.
 * The homepage fetches approved, anonymised entries from here and we forward
 * server-side to the portal's public endpoint — same reason as the write relays
 * (the portal's CORS allowlist doesn't cover every domain this site runs on).
 *
 * This is read-only and returns no contact details (the upstream payload never
 * contains any). It sanitises the query allowlist, forwards the real client IP
 * so the upstream per-IP limit tracks the visitor, and normalises failures into
 * the two shapes the client knows how to render gracefully:
 *   429 → { ok: false, error: "rate_limited" }
 *   any other failure → { ok: false, error: "Could not load listings." }
 * The destination is a hardcoded constant (no user-controlled URL → no SSRF).
 */

import { forwardedIpHeaders, json } from "@/lib/relay";
import { PORTAL_ORIGIN } from "@/lib/links";

const PORTAL_PUBLIC_ENDPOINT = `${PORTAL_ORIGIN}/api/parent-ticket/public`;

// Short shared cache so a burst of visitors doesn't hammer the upstream, while
// keeping the feed feeling live. Kept low (30s) so newly-approved entries show
// up quickly; stale-while-revalidate serves instantly while a fresh copy is
// fetched in the background.
const CACHE_CONTROL = "public, s-maxage=30, stale-while-revalidate=120";

const LOAD_ERROR = { ok: false, error: "Could not load listings." } as const;

/** Build a clean upstream query from only the allowlisted, validated params. */
function buildQuery(params: URLSearchParams): string {
  const out = new URLSearchParams();

  const type = params.get("type");
  if (type === "traveller" || type === "requester") out.set("type", type);

  const airport = params.get("airport")?.trim();
  if (airport) out.set("airport", airport.slice(0, 80));

  const date = params.get("date");
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) out.set("date", date);

  const limit = Number(params.get("limit"));
  if (Number.isFinite(limit) && limit >= 1 && limit <= 50) {
    out.set("limit", String(Math.floor(limit)));
  }

  const qs = out.toString();
  return qs ? `?${qs}` : "";
}

export async function GET(request: Request) {
  const query = buildQuery(new URL(request.url).searchParams);

  let upstream: Response;
  try {
    upstream = await fetch(`${PORTAL_PUBLIC_ENDPOINT}${query}`, {
      headers: { Accept: "application/json", ...forwardedIpHeaders(request) },
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return json(LOAD_ERROR, 502);
  }

  if (upstream.status === 429) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }
  if (!upstream.ok) {
    return json(LOAD_ERROR, 502);
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    return json(LOAD_ERROR, 502);
  }

  // Only trust a well-formed success payload; anything else is an error to us.
  if (
    !data ||
    typeof data !== "object" ||
    (data as { ok?: unknown }).ok !== true ||
    !Array.isArray((data as { entries?: unknown }).entries)
  ) {
    return json(LOAD_ERROR, 502);
  }

  const entries = (data as { entries: unknown[] }).entries;
  return Response.json(
    { ok: true, count: entries.length, entries },
    { status: 200, headers: { "Cache-Control": CACHE_CONTROL } }
  );
}
