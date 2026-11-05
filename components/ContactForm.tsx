"use client";

import Link from "next/link";
import { PHONE_LINK } from "@/lib/links";
import { FORM_PRIVACY_NOTE, submitEnquiry } from "@/lib/submitEnquiry";
import { useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronDown, Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { BUSINESS } from "@/lib/seo";

const EASE = [0.22, 1, 0.36, 1] as const;

const SUBJECTS = [
  "General enquiry",
  "Flight quote",
  "A booking I made",
  "Change or cancellation",
  "Refund request",
  "Visa enquiry",
  "Parent Travel Assist",
  "Complaint",
  "Feedback on the site",
  "Other",
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

type Field = keyof FormData;
type Errors = Partial<Record<Field, string>>;

function fieldError(field: Field, data: FormData): string | undefined {
  const v = data[field].trim();
  switch (field) {
    case "name":
      return v ? undefined : "Please enter your name.";
    case "email":
      if (!v) return "Please enter your email address.";
      if (!/^\S+@\S+\.\S+$/.test(v)) return "Enter a valid email address.";
      return undefined;
    case "message":
      if (!v) return "Please enter a message.";
      if (v.length < 10) return "Please add a little more detail (10+ characters).";
      return undefined;
    default:
      return undefined;
  }
}

const inputBase =
  "h-12 w-full rounded-sm border bg-neutral-000 px-4 t-body text-primary-800 placeholder:text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2";
const inputTone =
  "border-neutral-300 focus-visible:border-primary-700 focus-visible:ring-primary-700";
const inputErrorTone =
  "border-error focus-visible:border-error focus-visible:ring-error";

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block t-overline text-primary-800">
      {children}
      {required && (
        <span className="text-error" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-1 t-label-3 text-error">
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

/**
 * Contact form. Posts to /api/contact, which emails the team's inbox. If
 * sending isn't available, the visitor gets WhatsApp and a pre-filled email
 * link instead, so nothing they typed is lost.
 */
export default function ContactForm() {
  const reduce = useReducedMotion();
  const [data, setData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [formError, setFormError] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const set = (field: Field) => (value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const blurCheck = (field: Field) => () => {
    const msg = fieldError(field, data);
    if (msg) setErrors((e) => ({ ...e, [field]: msg }));
  };

  const mailtoHref = () => {
    const subjectLine = data.subject
      ? `${data.subject} — message from ${data.name}`
      : `Website enquiry from ${data.name}`;
    const body = [`Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone || "—"}`, "", data.message].join("\n");
    return `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fields: Field[] = ["name", "email", "message"];
    const next: Errors = {};
    for (const f of fields) {
      const msg = fieldError(f, data);
      if (msg) next[f] = msg;
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      const first = fields.find((f) => next[f]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    setSending(true);
    setFormError("");
    const result = await submitEnquiry({ kind: "contact", ...data, website });
    setSending(false);
    if (result.status === "sent") setSubmitted(true);
    else if (result.status === "unavailable") setUnavailable(true);
    else setFormError(result.message);
  };

  const startOver = () => {
    setData(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
    setUnavailable(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="py-8 text-center"
        role="status"
      >
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-surface">
          <CheckCircle2 className="h-9 w-9 text-success" aria-hidden="true" />
        </span>
        {/* Was `t-h3 … t-body-lg` — two type-scale classes on one element, so
            whichever globals.css defines later silently won. One class. */}
        <h3 className="t-h3 mt-6 text-primary-800">Thanks, {data.name.split(" ")[0] || "traveller"} — message sent</h3>
        <p className="t-body-sm mx-auto mt-3 max-w-sm text-text-secondary">
          We&apos;ve received your message and will reply to {data.email} within
          one business day. Need us sooner? WhatsApp us on{" "}
          <a
            {...PHONE_LINK}
            className="font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
          >
            {BUSINESS.phoneDisplay}
          </a>
          .
        </p>
        <button type="button" onClick={startOver} className="btn btn-outline mt-8 h-12 px-6">
          Send another message
        </button>
      </motion.div>
    );
  }

  if (unavailable) {
    return (
      <div className="py-8 text-center" role="status">
        <h3 className="t-h3 text-primary-800">We couldn&apos;t send that just now</h3>
        <p className="t-body-sm mx-auto mt-3 max-w-sm text-text-secondary">
          Our form isn&apos;t able to send messages at the moment. Your message
          is still here — send it by email, or message us on WhatsApp.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={mailtoHref()} className="btn btn-secondary h-12 px-6">
            Send by email
          </a>
          <a {...PHONE_LINK} className="btn btn-outline h-12 px-6">
            WhatsApp {BUSINESS.phoneDisplay}
          </a>
        </div>
        <button type="button" onClick={() => setUnavailable(false)} className="mt-6 t-label-2 text-primary-800 underline underline-offset-2">
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      {/* Honeypot — hidden from people and screen readers; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name" required>
            Full name
          </Label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={data.name}
            onChange={(e) => set("name")(e.target.value)}
            onBlur={blurCheck("name")}
            aria-required="true"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={cn(inputBase, errors.name ? inputErrorTone : inputTone)}
            placeholder="Jane Doe"
          />
          {errors.name && <ErrorText id="contact-name-error">{errors.name}</ErrorText>}
        </div>

        <div>
          <Label htmlFor="contact-email" required>
            Email address
          </Label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => set("email")(e.target.value)}
            onBlur={blurCheck("email")}
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={cn(inputBase, errors.email ? inputErrorTone : inputTone)}
            placeholder="you@example.com"
          />
          {errors.email && <ErrorText id="contact-email-error">{errors.email}</ErrorText>}
        </div>

        <div>
          <Label htmlFor="contact-phone">Phone / WhatsApp</Label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            value={data.phone}
            onChange={(e) => set("phone")(e.target.value)}
            className={cn(inputBase, inputTone)}
            placeholder="+44 ..."
          />
        </div>

        <div>
          <Label htmlFor="contact-subject">Subject</Label>
          <div className="relative">
            <select
              id="contact-subject"
              value={data.subject}
              onChange={(e) => set("subject")(e.target.value)}
              className={cn(inputBase, inputTone, "appearance-none pr-10", data.subject ? "text-primary-800" : "text-text-tertiary")}
            >
              <option value="">Select a subject…</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s} className="text-primary-800">
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="contact-message" required>
          Message
        </Label>
        <textarea
          id="contact-message"
          rows={5}
          value={data.message}
          onChange={(e) => set("message")(e.target.value)}
          onBlur={blurCheck("message")}
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={cn(inputBase, "h-auto min-h-[140px] py-3", errors.message ? inputErrorTone : inputTone)}
          placeholder="Tell us how we can help — flight route, dates, an existing booking reference, or anything else."
        />
        {errors.message && <ErrorText id="contact-message-error">{errors.message}</ErrorText>}
      </div>

      {formError ? (
        <p role="alert" className="flex items-start gap-2 t-body-sm text-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {formError}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" disabled={sending} className="btn btn-primary h-12 w-full shrink-0 px-8 sm:w-auto">
          {sending ? "Sending…" : "Send message"}
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="t-caption text-text-secondary">
          {FORM_PRIVACY_NOTE} See our{" "}
          <Link href="/privacy" className="font-bold text-primary-800 underline underline-offset-2">
            Privacy Policy
          </Link>
          . Making a complaint? See our{" "}
          <Link href="/complaints" className="font-bold text-primary-800 underline underline-offset-2">
            complaints procedure
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
