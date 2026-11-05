"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { PHONE_LINK } from "@/lib/links";
import { BUSINESS } from "@/lib/seo";
import { FORM_PRIVACY_NOTE, submitEnquiry } from "@/lib/submitEnquiry";
import { cn } from "@/lib/cn";

/**
 * "Get a quote": a real request to the team, not a login wall. Posts to
 * /api/contact (kind "quote"); a consultant replies with flights, the total
 * price and the fare rules. Nothing is booked or charged from this form.
 */

type Q = {
  trip: string;
  from: string;
  to: string;
  depart: string;
  return: string;
  adults: string;
  children: string;
  infants: string;
  cabin: string;
  flexibility: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY: Q = {
  trip: "Return",
  from: "",
  to: "",
  depart: "",
  return: "",
  adults: "1",
  children: "0",
  infants: "0",
  cabin: "Economy",
  flexibility: "Exact dates",
  name: "",
  email: "",
  phone: "",
  message: "",
};

const input =
  "h-12 w-full rounded-sm border border-neutral-300 bg-neutral-000 px-4 t-body text-primary-800 placeholder:text-text-secondary focus-visible:border-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700";

function Field({ id, label, required, children, hint }: { id: string; label: string; required?: boolean; children: ReactNode; hint?: string }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block t-overline text-primary-800">
        {label}
        {required ? <span className="text-error" aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="mt-1 t-caption text-text-secondary">{hint}</p> : null}
    </div>
  );
}

export default function QuoteForm() {
  const [q, setQ] = useState<Q>(EMPTY);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "unavailable">("idle");
  const [error, setError] = useState("");
  const set = (k: keyof Q) => (e: { target: { value: string } }) => setQ((d) => ({ ...d, [k]: e.target.value }));
  const today = new Date().toISOString().slice(0, 10);

  const summary = () =>
    [
      `Trip: ${q.trip}`,
      `Route: ${q.from} → ${q.to}`,
      `Dates: ${q.depart}${q.trip === "Return" && q.return ? ` – ${q.return}` : ""} (${q.flexibility})`,
      `Travellers: ${q.adults} adult(s), ${q.children} child(ren), ${q.infants} infant(s)`,
      `Cabin: ${q.cabin}`,
      `Name: ${q.name}`,
      `Phone: ${q.phone || "—"}`,
      q.message ? `\n${q.message}` : "",
    ].join("\n");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!q.from.trim() || !q.to.trim() || !q.depart || !q.name.trim() || !/^\S+@\S+\.\S+$/.test(q.email.trim())) {
      setError("Please fill in the route, departure date, your name and a valid email address.");
      return;
    }
    if (q.trip === "Return" && q.return && q.return < q.depart) {
      setError("Your return date is before your departure date.");
      return;
    }
    setState("sending");
    const result = await submitEnquiry({
      kind: "quote",
      website,
      trip: q.trip,
      from: q.from,
      to: q.to,
      depart: q.depart,
      return: q.trip === "Return" ? q.return : "",
      travellers: `${q.adults} adult(s), ${q.children} child(ren), ${q.infants} infant(s)`,
      cabin: q.cabin,
      flexibility: q.flexibility,
      name: q.name,
      email: q.email,
      phone: q.phone,
      message: q.message,
    });
    if (result.status === "sent") setState("sent");
    else if (result.status === "unavailable") setState("unavailable");
    else {
      setState("idle");
      setError(result.message);
    }
  };

  if (state === "sent") {
    return (
      <div role="status" className="py-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-surface">
          <CheckCircle2 className="h-9 w-9 text-success" aria-hidden="true" />
        </span>
        <h2 className="t-h3 mt-6 text-primary-800">Thanks — your quote request is with us</h2>
        <p className="t-body-sm mx-auto mt-3 max-w-md text-text-secondary">
          A consultant will send flights, the total price and the fare rules to{" "}
          {q.email}. Nothing is booked or charged until you agree. Want it faster?
          WhatsApp us on{" "}
          <a {...PHONE_LINK} className="font-bold text-primary-800 underline underline-offset-2">
            {BUSINESS.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  if (state === "unavailable") {
    const mail = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(`Quote request: ${q.from} → ${q.to}`)}&body=${encodeURIComponent(summary())}`;
    const wa = `${PHONE_LINK.href}?text=${encodeURIComponent(`Hi Wicket Travel, please quote:\n${summary()}`)}`;
    return (
      <div role="status" className="py-8 text-center">
        <h2 className="t-h3 text-primary-800">We couldn&apos;t send that just now</h2>
        <p className="t-body-sm mx-auto mt-3 max-w-md text-text-secondary">
          Your details are still here. Send them to us on WhatsApp or by email
          and we&apos;ll quote just the same.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-secondary h-12 px-6">
            Send on WhatsApp
          </a>
          <a href={mail} className="btn btn-outline h-12 px-6">
            Send by email
          </a>
        </div>
        <button type="button" onClick={() => setState("idle")} className="mt-6 t-label-2 text-primary-800 underline underline-offset-2">
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-8">
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="quote-website">Website</label>
        <input id="quote-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <fieldset className="space-y-6">
        <legend className="t-h4 text-primary-800">Your trip</legend>
        <div role="radiogroup" aria-label="Trip type" className="flex flex-wrap gap-2">
          {["Return", "One way", "Multi-city"].map((t) => (
            <label
              key={t}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 t-label-2 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-700",
                q.trip === t ? "border-primary-800 bg-primary-800 text-text-on-dark" : "border-neutral-300 text-primary-800 hover:bg-primary-050"
              )}
            >
              <input type="radio" name="trip" value={t} checked={q.trip === t} onChange={set("trip")} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field id="quote-from" label="From" required>
            <input id="quote-from" className={input} value={q.from} onChange={set("from")} placeholder="e.g. London Heathrow" autoComplete="off" />
          </Field>
          <Field id="quote-to" label="To" required>
            <input id="quote-to" className={input} value={q.to} onChange={set("to")} placeholder="e.g. Delhi" autoComplete="off" />
          </Field>
          <Field id="quote-depart" label="Departure date" required>
            <input id="quote-depart" type="date" min={today} className={input} value={q.depart} onChange={set("depart")} />
          </Field>
          {q.trip === "Return" ? (
            <Field id="quote-return" label="Return date">
              <input id="quote-return" type="date" min={q.depart || today} className={input} value={q.return} onChange={set("return")} />
            </Field>
          ) : (
            <Field id="quote-flex" label="Date flexibility">
              <select id="quote-flex" className={input} value={q.flexibility} onChange={set("flexibility")}>
                {["Exact dates", "± 3 days", "± 7 days"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          )}
        </div>
        {q.trip === "Multi-city" ? (
          <p className="t-body-sm text-text-secondary">Add the other legs and dates in the message box below.</p>
        ) : null}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Field id="quote-adults" label="Adults">
            <select id="quote-adults" className={input} value={q.adults} onChange={set("adults")}>
              {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((n) => <option key={n}>{n}</option>)}
            </select>
          </Field>
          <Field id="quote-children" label="Children 2–11">
            <select id="quote-children" className={input} value={q.children} onChange={set("children")}>
              {Array.from({ length: 9 }, (_, i) => String(i)).map((n) => <option key={n}>{n}</option>)}
            </select>
          </Field>
          <Field id="quote-infants" label="Infants under 2">
            <select id="quote-infants" className={input} value={q.infants} onChange={set("infants")}>
              {Array.from({ length: 5 }, (_, i) => String(i)).map((n) => <option key={n}>{n}</option>)}
            </select>
          </Field>
          <Field id="quote-cabin" label="Cabin">
            <select id="quote-cabin" className={input} value={q.cabin} onChange={set("cabin")}>
              {["Economy", "Premium economy", "Business", "First"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
        </div>
        {q.trip === "Return" ? (
          <Field id="quote-flex2" label="Date flexibility">
            <select id="quote-flex2" className={cn(input, "sm:max-w-xs")} value={q.flexibility} onChange={set("flexibility")}>
              {["Exact dates", "± 3 days", "± 7 days"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
        ) : null}
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="t-h4 text-primary-800">Your details</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field id="quote-name" label="Full name" required>
            <input id="quote-name" className={input} value={q.name} onChange={set("name")} autoComplete="name" />
          </Field>
          <Field id="quote-email" label="Email address" required>
            <input id="quote-email" type="email" className={input} value={q.email} onChange={set("email")} autoComplete="email" />
          </Field>
          <Field id="quote-phone" label="Phone / WhatsApp" hint="Optional — if you'd like us to message you the quote.">
            <input id="quote-phone" type="tel" className={input} value={q.phone} onChange={set("phone")} autoComplete="tel" />
          </Field>
        </div>
        <Field id="quote-message" label="Anything else?" hint="Preferred airline, baggage, special assistance, or other legs of a multi-city trip.">
          <textarea id="quote-message" rows={4} className={cn(input, "h-auto py-3")} value={q.message} onChange={set("message")} maxLength={4000} />
        </Field>
      </fieldset>

      {error ? (
        <p role="alert" className="flex items-start gap-2 t-body-sm text-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <div className="space-y-3">
        <button type="submit" disabled={state === "sending"} className="btn btn-primary h-12 w-full px-8 sm:w-auto">
          {state === "sending" ? "Sending…" : "Request my quote"}
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="t-caption text-text-secondary">
          Free, with no obligation: nothing is booked or charged until you accept
          a quote. {FORM_PRIVACY_NOTE} See our{" "}
          <Link href="/privacy" className="font-bold text-primary-800 underline underline-offset-2">Privacy Policy</Link>{" "}
          and{" "}
          <Link href="/terms" className="font-bold text-primary-800 underline underline-offset-2">Terms</Link>.
        </p>
      </div>
    </form>
  );
}
