/**
 * Shared server-side hardening for the two public lead-form relays
 * (app/api/visa-enquiry and app/api/parent-ticket). Both routes forward
 * submissions to the Wicket Travel portal; everything here runs BEFORE anything
 * is forwarded.
 *
 * The portal endpoints are public and validate server-side; the optional
 * WICKET_RELAY_SECRET only proves to the portal that a forwarded client IP is
 * ours (see forwardedIpHeaders). These relays exist only to work around the portal's
 * CORS allowlist (it doesn't cover every domain this site is served on), so the
 * client posts same-origin and we forward. The job of this module is therefore
 * defence-in-depth: rate-limit the relay, forward the real client IP, and give
 * each route the primitives to validate + sanitise input instead of blindly
 * proxying an arbitrary body.
 */

export const MAX_FILES = 20;
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB per file, matching the portal
export const ALLOWED_FILE_EXT = /\.(pdf|jpe?g|png)$/i;
export const MAX_PAYLOAD_BYTES = 64 * 1024; // a lead form's JSON is tiny; block abuse

/**
 * Extract the originating client IP from the platform's forwarding headers.
 *
 * Netlify sets `x-nf-client-connection-ip` itself from the TCP connection, so
 * a visitor cannot spoof it — prefer it. `x-forwarded-for` can carry values
 * the client sent, so it is only the fallback (other hosts, local dev).
 */
export function getClientIp(request: Request): string {
  const nf = request.headers.get("x-nf-client-connection-ip")?.trim();
  if (nf) return nf;
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/* ── Per-IP rate limit (defence-in-depth) ──────────────────────────────
 * In-memory fixed window. On serverless this is per-instance and resets on a
 * cold start, so it is NOT the primary control — the portal enforces the real
 * per-IP limit. It exists to stop a single client hammering the relay directly.
 */
const WINDOW_MS = 10 * 60_000;
const MAX_HITS = 6;
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic cleanup so the map can't grow unbounded.
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_HITS;
}

/**
 * Forward the real client IP so the portal's per-IP rate limit applies to the
 * actual visitor rather than this relay's single egress IP (otherwise one
 * abuser would exhaust a shared bucket and lock out everyone).
 */
export function forwardedIpHeaders(request: Request): Record<string, string> {
  const ip = getClientIp(request);
  if (ip === "unknown") return {};
  // Lead with the IP we trust so the portal's first-hop parse gets the real
  // visitor, not a value a client injected into its own x-forwarded-for.
  const headers: Record<string, string> = { "x-forwarded-for": ip, "x-real-ip": ip };
  // The host overwrites x-forwarded-for on the way into the portal, so the
  // portal only honours a forwarded IP that arrives with the shared secret
  // (portal: app/api/parent-ticket + app/api/visa-enquiry, resolveClientIp).
  // Without it, every website visitor shares the relay's rate-limit bucket.
  const secret = process.env.WICKET_RELAY_SECRET;
  if (secret) {
    headers["x-wicket-relay-secret"] = secret;
    headers["x-wicket-client-ip"] = ip;
  }
  return headers;
}

/* ── Input sanitisation helpers ────────────────────────────────────────── */

/** Trim, drop empties, strip control chars (keeping tab/newline/return), cap length. */
export function cleanString(v: unknown, max = 2000): string | undefined {
  if (typeof v !== "string") return undefined;
  let t = "";
  for (const ch of v) {
    const c = ch.codePointAt(0)!;
    // Drop C0/C1 control characters and DEL, but keep tab (9), LF (10), CR (13).
    if ((c < 32 && c !== 9 && c !== 10 && c !== 13) || c === 127) continue;
    t += ch;
  }
  t = t.trim();
  if (!t) return undefined;
  return t.slice(0, max);
}

export function cleanBool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

export function cleanNumber(
  v: unknown,
  { min, max }: { min: number; max: number }
): number | undefined {
  const n =
    typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n) || n < min || n > max) return undefined;
  return n;
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;
export function isEmail(v: string): boolean {
  return v.length <= 254 && EMAIL_RE.test(v);
}

export function json(body: unknown, status: number): Response {
  return Response.json(body, { status });
}
