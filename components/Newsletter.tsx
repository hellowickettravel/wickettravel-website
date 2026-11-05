"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { submitEnquiry } from "@/lib/submitEnquiry";

/** The exact opt-in wording, stored with every sign-up as the consent record. */
const CONSENT_TEXT =
  "Yes, email me flight deals and travel offers from Wicket Travel. I can unsubscribe at any time.";

/**
 * Deal-email sign-up. PECR/UK GDPR: the opt-in box starts unticked, signing up
 * requires ticking it, the Privacy Policy is a real link, and the wording the
 * visitor agreed to is sent with the sign-up (see /api/contact).
 */
export default function Newsletter() {
  const { t } = useI18n();
  const consentId = useId();
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!agreed) {
      setError("Please tick the box to agree to receive deal emails.");
      return;
    }
    setState("sending");
    const result = await submitEnquiry({
      kind: "newsletter",
      email,
      website,
      marketing_consent: true,
      consent_text: CONSENT_TEXT,
    });
    if (result.status === "sent") setState("sent");
    else {
      setState("idle");
      setError(
        result.status === "error"
          ? result.message
          : "Sign-up isn't available right now. Please try again later, or message us on WhatsApp."
      );
    }
  };

  return (
    <section id="newsletter" className="section scroll-mt-16 bg-sand-500">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-lg bg-primary-800 px-6 py-12 shadow-e3 sm:px-12 sm:py-16">
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="t-h2 text-text-on-dark">{t("news.title")}</h2>
            <p className="t-body-lg mx-auto mt-4 max-w-xl text-primary-100">
              {t("news.lead")}
            </p>

            {state === "sent" ? (
              <p role="status" className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 t-body text-text-on-dark">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-400" aria-hidden="true" />
                Thanks — you&apos;re signed up. Every email has an unsubscribe link.
              </p>
            ) : (
              <form noValidate className="mx-auto mt-8 max-w-md" onSubmit={onSubmit}>
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="newsletter-website">Website</label>
                  <input id="newsletter-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("news.placeholder")}
                    className="h-12 w-full rounded-full border border-neutral-000/20 bg-neutral-000 px-6 t-label-2 text-primary-800 placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-400"
                  />
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="btn btn-primary h-12 shrink-0 px-6 focus-visible:ring-offset-primary-800"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {state === "sending" ? "Sending…" : t("news.button")}
                  </button>
                </div>
                <label htmlFor={consentId} className="mt-4 flex cursor-pointer items-start gap-3 text-left t-body-sm text-primary-100">
                  <input
                    id={consentId}
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-accent-500"
                  />
                  <span>{CONSENT_TEXT}</span>
                </label>
                {error ? (
                  <p role="alert" className="mt-3 flex items-start gap-2 text-left t-body-sm text-accent-200">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {error}
                  </p>
                ) : null}
              </form>
            )}
            <p className="mt-4 t-caption text-primary-100">
              We use your email only to send these emails, and never share or sell it. See our{" "}
              <Link href="/privacy#marketing" className="font-bold text-text-on-dark underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
