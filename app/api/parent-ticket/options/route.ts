/**
 * Same-origin read relay for the Parent Travel Assist board options — the
 * airports, airlines, languages and "help needed" lists an admin keeps in
 * the portal (/admin/parents-options). Forwards server-side to the portal's
 * public GET /api/parent-ticket/options, same reason as the other relays
 * (the portal's CORS allowlist doesn't cover every domain this site runs on).
 *
 * Never fails loudly: anything other than a well-formed answer becomes
 * `{ ok: true, options: null }`, and the board falls back to its built-in
 * lists (lib/boardOptions.ts). A visitor should never see a broken filter
 * because the portal is slow or the migration hasn't been run.
 */

import { PORTAL_ORIGIN } from "@/lib/links";
import { sanitizeBoardOptions } from "@/lib/boardOptions";

const PORTAL_OPTIONS_ENDPOINT = `${PORTAL_ORIGIN}/api/parent-ticket/options`;

// Matches the portal's own edge cache: admin edits show within minutes.
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=3600";

const FALLBACK = Response.json(
  { ok: true, options: null },
  { status: 200, headers: { "Cache-Control": "public, s-maxage=60" } }
);

export async function GET() {
  let upstream: Response;
  try {
    upstream = await fetch(PORTAL_OPTIONS_ENDPOINT, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    return FALLBACK.clone();
  }
  if (!upstream.ok) return FALLBACK.clone();

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    return FALLBACK.clone();
  }

  const raw = (data as { ok?: unknown; options?: unknown } | null) ?? {};
  const options = raw.ok === true ? sanitizeBoardOptions(raw.options) : null;
  return Response.json(
    { ok: true, options },
    { status: 200, headers: { "Cache-Control": CACHE_CONTROL } }
  );
}
