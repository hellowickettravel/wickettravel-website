/**
 * Client helper for /api/contact. Returns a result the forms can render:
 * - "sent": delivered to the team's inbox;
 * - "unavailable": email sending isn't configured or failed upstream, so the
 *   form should offer WhatsApp / email instead (nothing typed is lost);
 * - "error": a validation or rate-limit message to show beside the form.
 */
export type EnquiryResult =
  | { status: "sent" }
  | { status: "unavailable" }
  | { status: "error"; message: string };

export async function submitEnquiry(
  payload: Record<string, string | boolean | undefined>
): Promise<EnquiryResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, page: window.location.pathname }),
    });
    if (res.ok) return { status: "sent" };
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (res.status === 503 || res.status === 502) return { status: "unavailable" };
    return { status: "error", message: body.error || "Something went wrong. Please try again." };
  } catch {
    return { status: "unavailable" };
  }
}

/** One-line privacy notice shown under every enquiry form. */
export const FORM_PRIVACY_NOTE =
  "We use your details only to reply to you and arrange what you ask for.";
