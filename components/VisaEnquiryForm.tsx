"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { VISA_TYPES } from "@/lib/visa";

/**
 * The real Dubai / UAE visa enquiry form — the single implementation shared by
 * two surfaces:
 *
 *   • components/VisaBanner.tsx — the homepage banner's modal
 *   • app/visa/page.tsx        — the dedicated /visa page, inline
 *
 * It was previously inlined in VisaBanner. Nothing about the contract changed
 * when it moved: same fields, same client-side validation, same multipart POST
 * to /api/visa-enquiry with a `payload` JSON string (documents are collected
 * later, on the call-back), same reference number on success.
 *
 * `idPrefix` exists because both surfaces can be mounted in the same document
 * (the homepage renders the banner; a future page could render both) and every
 * field id / aria-describedby must stay unique.
 */

type Field = "first_name" | "last_name" | "email" | "phone";

const EMPTY = {
  visa_type: VISA_TYPES[0],
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  additional_notes: "",
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;

type Props = {
  /** Namespace for field ids — must be unique per mounted instance. */
  idPrefix: string;
  /**
   * Rendered as an extra button in the success state. The modal passes its
   * close handler; the page has nothing to dismiss, so it passes nothing.
   */
  onDone?: () => void;
  doneLabel?: string;
};

export default function VisaEnquiryForm({
  idPrefix,
  onDone,
  doneLabel = "Done",
}: Props) {
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof EMPTY, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    if (key in errors)
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as Field];
        return next;
      });
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!data.first_name.trim()) next.first_name = "Enter your first name.";
    if (!data.last_name.trim()) next.last_name = "Enter your last name.";
    if (!EMAIL_RE.test(data.email.trim()))
      next.email = "Enter a valid email address.";
    if (!data.phone.trim()) next.phone = "Enter your phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      // The relay expects multipart: a `payload` JSON string (documents are
      // collected later, on the call-back).
      const body = new FormData();
      body.append("payload", JSON.stringify(data));
      const res = await fetch("/api/visa-enquiry", { method: "POST", body });
      const result: { ok?: boolean; reference?: string; error?: string } =
        await res.json();
      if (res.ok && result.ok) {
        setReference(result.reference ?? null);
        setSubmitted(true);
      } else {
        setSubmitError(result.error ?? "The enquiry could not be submitted.");
      }
    } catch {
      // Network failure or an unparseable response — entered data stays put so
      // the visitor can simply retry.
      setSubmitError(
        "We couldn't reach our server — please check your connection."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setData(EMPTY);
    setErrors({});
    setSubmitError(null);
    setReference(null);
    setSubmitted(false);
  };

  const field =
    "mt-2 w-full rounded-md border border-neutral-300 bg-neutral-000 px-4 py-3 t-body-sm text-primary-800 outline-none transition-colors placeholder:text-text-secondary focus-visible:border-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700";
  const label = "t-label-2 text-primary-800";

  if (submitted) {
    return (
      <div className="py-6 text-center" role="status">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-surface">
          <CheckCircle2 className="h-9 w-9 text-success" aria-hidden="true" />
        </span>
        <p className="t-h3 mt-6 text-primary-800">Enquiry received!</p>
        {reference && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-050 px-4 py-2 t-body-sm text-primary-800">
            Your reference:{" "}
            <span className="t-code font-extrabold text-primary-800">
              {reference}
            </span>
          </p>
        )}
        <p className="t-body-sm mx-auto mt-4 max-w-sm text-text-secondary">
          A Wicket Travel visa expert will call you back within 2 hours to
          confirm your details and next steps.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {onDone && (
            <button
              type="button"
              onClick={onDone}
              className="btn btn-primary px-6 py-3"
            >
              {doneLabel}
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="btn btn-outline px-6 py-3"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-type`} className={label}>
          Visa type
        </label>
        <select
          id={`${idPrefix}-type`}
          value={data.visa_type}
          onChange={(e) => set("visa_type", e.target.value)}
          className={field}
        >
          {VISA_TYPES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-first`} className={label}>
            First name
          </label>
          <input
            id={`${idPrefix}-first`}
            value={data.first_name}
            onChange={(e) => set("first_name", e.target.value)}
            autoComplete="given-name"
            aria-invalid={!!errors.first_name}
            aria-describedby={
              errors.first_name ? `${idPrefix}-first-error` : undefined
            }
            className={field}
            placeholder="Emily"
          />
          {errors.first_name && (
            <p
              id={`${idPrefix}-first-error`}
              className="mt-2 t-label-3 text-error"
            >
              {errors.first_name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-last`} className={label}>
            Last name
          </label>
          <input
            id={`${idPrefix}-last`}
            value={data.last_name}
            onChange={(e) => set("last_name", e.target.value)}
            autoComplete="family-name"
            aria-invalid={!!errors.last_name}
            aria-describedby={
              errors.last_name ? `${idPrefix}-last-error` : undefined
            }
            className={field}
            placeholder="Clarke"
          />
          {errors.last_name && (
            <p
              id={`${idPrefix}-last-error`}
              className="mt-2 t-label-3 text-error"
            >
              {errors.last_name}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-email`} className={label}>
            Email
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            inputMode="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? `${idPrefix}-email-error` : undefined
            }
            className={field}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p
              id={`${idPrefix}-email-error`}
              className="mt-2 t-label-3 text-error"
            >
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-phone`} className={label}>
            Phone
          </label>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            inputMode="tel"
            value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={
              errors.phone ? `${idPrefix}-phone-error` : undefined
            }
            className={field}
            placeholder="+44 7000 000000"
          />
          {errors.phone && (
            <p
              id={`${idPrefix}-phone-error`}
              className="mt-2 t-label-3 text-error"
            >
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-notes`} className={label}>
          Anything we should know?{" "}
          <span className="font-normal text-text-secondary">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          rows={3}
          value={data.additional_notes}
          onChange={(e) => set("additional_notes", e.target.value)}
          className={`${field} resize-y`}
          placeholder="Travel dates, number of applicants, previous UAE visas…"
        />
      </div>

      {submitError && (
        <p
          role="alert"
          className="rounded-md bg-error-surface px-4 py-3 t-label-2 text-error"
        >
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full px-6 py-4 t-body disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send enquiry
          </>
        )}
      </button>
      <p className="text-center t-caption text-text-secondary">
        We only use your details to answer this enquiry.
      </p>
    </form>
  );
}
