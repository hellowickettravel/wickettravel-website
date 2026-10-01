"use client";

import { PHONE_LINK } from "@/lib/links";
import { useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronDown, Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { BUSINESS } from "@/lib/seo";

const EASE = [0.22, 1, 0.36, 1] as const;

const SUBJECTS = [
  "General enquiry",
  "Booking support",
  "Visa enquiry",
  "Refund request",
  "Feedback",
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
 * On-brand contact form. There is no backend behind this yet — submitting
 * hands off to the visitor's email client via a pre-filled `mailto:` link and
 * then shows an on-brand success state. Swap this for a POST to a real
 * inbox/CRM endpoint (e.g. `/api/contact`) once one exists, following the
 * same pattern as `/api/visa-enquiry`.
 */
export default function ContactForm() {
  const reduce = useReducedMotion();
  const [data, setData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field: Field) => (value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const blurCheck = (field: Field) => () => {
    const msg = fieldError(field, data);
    if (msg) setErrors((e) => ({ ...e, [field]: msg }));
  };

  const onSubmit = (e: FormEvent) => {
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

    // No backend yet — real endpoint would go here (POST to /api/contact).
    // For now, hand off to the visitor's default email client with the form
    // pre-filled so nothing typed is lost.
    const subjectLine = data.subject
      ? `${data.subject} — message from ${data.name}`
      : `Website enquiry from ${data.name}`;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "—"}`,
      "",
      data.message,
    ].join("\n");
    window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(
      subjectLine
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
  };

  const startOver = () => {
    setData(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
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
        <h3 className="t-h3 mt-6 text-primary-800">Almost there, {data.name.split(" ")[0] || "traveler"}!</h3>
        <p className="t-body-sm mx-auto mt-3 max-w-sm text-text-secondary">
          Your email app should have opened with your message pre-filled — just
          hit send. Prefer not to wait? WhatsApp us on{" "}
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

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
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

      <button type="submit" className="btn btn-primary h-12 w-full px-8 sm:w-auto">
        Send message
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
