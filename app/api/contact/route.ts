/**
 * Website enquiries: the contact form, the quote form and deal-email sign-ups.
 *
 * Each submission is emailed to the team's inbox through Resend's HTTP API
 * (no SDK needed). Configure on the host:
 *   RESEND_API_KEY      — required; without it this returns 503 and the forms
 *                         fall back to WhatsApp / email links.
 *   CONTACT_TO_EMAIL    — inbox that receives enquiries (default info@wickettravel.com)
 *   CONTACT_FROM_EMAIL  — sender on a domain verified in Resend
 *                         (default "Wicket Travel website <forms@wickettravel.com>")
 *
 * Every message carries a consent record (what the visitor ticked and the
 * exact wording shown), which is what UK GDPR / PECR expects us to keep for
 * marketing sign-ups. A hidden honeypot field drops naive bots silently.
 */
import { BUSINESS } from "@/lib/seo";
import { cleanBool, cleanString, getClientIp, isEmail, json, MAX_PAYLOAD_BYTES, rateLimited } from "@/lib/relay";

type Kind = "contact" | "quote" | "newsletter";
const KINDS = new Set<Kind>(["contact", "quote", "newsletter"]);

const FIELDS: Record<string, [label: string, max: number]> = {
  name: ["Name", 120],
  email: ["Email", 254],
  phone: ["Phone / WhatsApp", 40],
  subject: ["Topic", 80],
  from: ["From", 120],
  to: ["To", 120],
  trip: ["Trip type", 20],
  depart: ["Departure date", 20],
  return: ["Return date", 20],
  travellers: ["Travellers", 120],
  cabin: ["Cabin", 40],
  flexibility: ["Date flexibility", 60],
  message: ["Message", 4000],
  consent_text: ["Consent wording shown", 600],
  page: ["Sent from page", 200],
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function POST(request: Request) {
  if (rateLimited(getClientIp(request))) {
    return json({ ok: false, error: "Too many messages — please wait a few minutes and try again." }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_PAYLOAD_BYTES) return json({ ok: false, error: "Message too large." }, 413);

  let input: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    input = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot: real visitors never see or fill this field.
  if (cleanString(input.website, 200)) return json({ ok: true }, 200);

  const kind = cleanString(input.kind, 20) as Kind | undefined;
  if (!kind || !KINDS.has(kind)) return json({ ok: false, error: "Invalid request." }, 400);

  const data: Record<string, string> = {};
  for (const [key, [, max]] of Object.entries(FIELDS)) {
    const v = cleanString(input[key], max);
    if (v) data[key] = v;
  }
  const marketing = cleanBool(input.marketing_consent) === true;

  if (!data.email || !isEmail(data.email)) {
    return json({ ok: false, error: "Please enter a valid email address." }, 422);
  }
  if (kind !== "newsletter" && !data.name) {
    return json({ ok: false, error: "Please enter your name." }, 422);
  }
  if (kind === "contact" && (!data.message || data.message.length < 10)) {
    return json({ ok: false, error: "Please add a little more detail to your message." }, 422);
  }
  if (kind === "quote" && (!data.from || !data.to || !data.depart)) {
    return json({ ok: false, error: "Please give your route and travel date." }, 422);
  }
  if (kind === "newsletter" && !marketing) {
    return json({ ok: false, error: "Please tick the box to agree to receive deal emails." }, 422);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json({ ok: false, error: "not_configured" }, 503);
  }

  const to = process.env.CONTACT_TO_EMAIL || BUSINESS.email;
  const from = process.env.CONTACT_FROM_EMAIL || "Wicket Travel website <forms@wickettravel.com>";
  const received = new Date().toISOString();
  const subject =
    kind === "quote"
      ? `Quote request: ${data.from} → ${data.to}, ${data.depart} — ${data.name}`
      : kind === "newsletter"
        ? `Deal emails sign-up: ${data.email}`
        : `${data.subject ?? "Website enquiry"} — ${data.name}`;

  const rows = Object.entries(FIELDS)
    .filter(([key]) => data[key])
    .map(([key, [label]]) => `<tr><th align="left" valign="top" style="padding:4px 12px 4px 0">${label}</th><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(data[key])}</td></tr>`);
  rows.push(`<tr><th align="left" style="padding:4px 12px 4px 0">Marketing consent</th><td>${marketing ? "Yes — opted in" : "No"}</td></tr>`);
  rows.push(`<tr><th align="left" style="padding:4px 12px 4px 0">Received</th><td>${received}</td></tr>`);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject,
        html: `<p>New ${kind} submission from wickettravel.com</p><table>${rows.join("")}</table>`,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error("contact: Resend responded", res.status, await res.text().catch(() => ""));
      return json({ ok: false, error: "send_failed" }, 502);
    }
  } catch (err) {
    console.error("contact: send failed", err);
    return json({ ok: false, error: "send_failed" }, 502);
  }

  return json({ ok: true }, 200);
}
