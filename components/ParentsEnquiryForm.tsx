"use client";

import { useId, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  HandHeart,
  Loader2,
  Lock,
  Send,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { MOBILITY_NEEDS, RELATIONSHIPS, ROLES, type EnquiryType } from "@/lib/parents";

/**
 * Parents Tickets — the real dual-role enquiry form.
 *
 * Posts plain JSON to the same-origin relay at /api/parent-ticket, which
 * validates against the portal's contract and forwards server-side. Because the
 * relay's allowlist is keyed by the portal's own field names, this component's
 * state is keyed by those exact names too — so a 422's `fields` map drops
 * straight onto the right input with no translation layer to drift.
 *
 * One form, two sides. The toggle only swaps the conditional block; every shared
 * answer survives a switch, so changing your mind costs nothing.
 *
 * `consent_public` is the only thing that can ever put an entry on the public
 * board, so it is opt-in, unticked, and spelled out in full next to the box —
 * never a pre-ticked convenience.
 */

const ENDPOINT = "/api/parent-ticket";
const EMAIL_RE = /^\S+@\S+\.\S+$/;

/* Keys mirror the API contract exactly — see app/api/parent-ticket/route.ts. */
type FormState = {
  full_name: string;
  phone: string;
  email: string;
  from_location: string;
  to_location: string;
  travel_date: string;
  airline: string;
  languages_spoken: string;
  notes: string;
  // traveller
  assistance_offered: string;
  parents_capacity: string;
  assistance_fee: string;
  // requester
  parent_name: string;
  parent_age: string;
  relationship: string;
  assistance_needed: string;
  mobility_needs: string;
  offer_amount: string;
};

type Field = keyof FormState;
type Errors = Partial<Record<Field, string>>;

const EMPTY: FormState = {
  full_name: "",
  phone: "",
  email: "",
  from_location: "",
  to_location: "",
  travel_date: "",
  airline: "",
  languages_spoken: "",
  notes: "",
  assistance_offered: "",
  parents_capacity: "",
  assistance_fee: "",
  parent_name: "",
  parent_age: "",
  relationship: "",
  assistance_needed: "",
  mobility_needs: "",
  offer_amount: "",
};

/** Required for both sides. `enquiry_type` comes from the toggle, not the user. */
const REQUIRED: Field[] = [
  "full_name",
  "phone",
  "email",
  "from_location",
  "to_location",
];

const REQUIRED_MESSAGE: Record<string, string> = {
  full_name: "Please enter your full name.",
  phone: "Please enter your phone or WhatsApp number.",
  email: "Please enter your email address.",
  from_location: "Please enter the departure city or airport.",
  to_location: "Please enter the destination city or airport.",
};

/** Client-side mirror of the relay's own range checks — same limits, same words. */
function validate(role: EnquiryType, data: FormState): Errors {
  const errors: Errors = {};

  for (const key of REQUIRED) {
    if (!data[key].trim()) errors[key] = REQUIRED_MESSAGE[key];
  }
  if (data.email.trim() && !EMAIL_RE.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (
    data.travel_date &&
    data.travel_date < new Date().toISOString().slice(0, 10)
  ) {
    errors.travel_date = "The travel date can't be in the past.";
  }

  const range = (key: Field, min: number, max: number, message: string) => {
    const raw = data[key].trim();
    if (!raw) return;
    const n = Number(raw);
    if (!Number.isFinite(n) || n < min || n > max) errors[key] = message;
  };

  if (role === "traveller") {
    range(
      "parents_capacity",
      1,
      99,
      "Enter how many people you could accompany (1–99)."
    );
    range("assistance_fee", 0, 100, "Enter an amount between £0 and £100.");
  } else {
    range("parent_age", 1, 120, "Enter a valid age (1–120).");
    range("offer_amount", 0, 100, "Enter an amount between £0 and £100.");
  }

  return errors;
}

/** Build the exact JSON body the relay allows — empty optionals are dropped. */
function buildPayload(
  role: EnquiryType,
  data: FormState,
  consentPublic: boolean
) {
  const text = (v: string) => v.trim() || undefined;
  const number = (v: string) => (v.trim() === "" ? undefined : Number(v));

  const shared = {
    enquiry_type: role,
    full_name: data.full_name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    from_location: data.from_location.trim(),
    to_location: data.to_location.trim(),
    travel_date: text(data.travel_date),
    airline: text(data.airline),
    languages_spoken: text(data.languages_spoken),
    notes: text(data.notes),
    consent_public: consentPublic,
  };

  return role === "traveller"
    ? {
        ...shared,
        assistance_offered: text(data.assistance_offered),
        parents_capacity: number(data.parents_capacity),
        assistance_fee: number(data.assistance_fee),
      }
    : {
        ...shared,
        parent_name: text(data.parent_name),
        parent_age: number(data.parent_age),
        relationship: text(data.relationship),
        assistance_needed: text(data.assistance_needed),
        mobility_needs: text(data.mobility_needs),
        offer_amount: number(data.offer_amount),
      };
}

/** Keep only keys we actually render, so a stray upstream key can't be lost. */
function readFieldErrors(value: unknown): Errors {
  if (!value || typeof value !== "object") return {};
  const out: Errors = {};
  for (const [key, message] of Object.entries(value as Record<string, unknown>)) {
    if (key in EMPTY && typeof message === "string" && message.trim()) {
      out[key as Field] = message;
    }
  }
  return out;
}

/* ── Field primitives — the site's .input / label pairing, nothing new ──── */

const labelClass = "t-label-2 text-primary-800";
const hintClass = "mt-1.5 t-caption text-text-secondary";

function Err({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 t-label-3 text-error">
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

/** Journey fields a caller may pre-fill — e.g. the Parents Travel Assist match
 *  finder hands over the route and date the visitor already searched, so they
 *  never type the same thing twice. Everything else stays the visitor's own. */
export type EnquiryPrefill = Partial<
  Pick<FormState, "from_location" | "to_location" | "travel_date" | "airline">
>;

export default function ParentsEnquiryForm({
  initialRole = "requester",
  initialValues,
}: {
  initialRole?: EnquiryType;
  initialValues?: EnquiryPrefill;
} = {}) {
  const uid = useId();
  const id = (name: string) => `pt-${uid}-${name}`;

  const [role, setRole] = useState<EnquiryType>(initialRole);
  const [data, setData] = useState<FormState>(() => {
    const next = { ...EMPTY };
    // Only real strings — an `undefined` would otherwise blank a field to a
    // non-string and break every `.trim()` below.
    for (const [key, value] of Object.entries(initialValues ?? {})) {
      if (typeof value === "string") next[key as keyof EnquiryPrefill] = value;
    }
    return next;
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    reference: string | null;
    consented: boolean;
  } | null>(null);

  const set = (key: Field, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const found = validate(role, data);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Move focus to the first problem so the error isn't only a colour.
      const first = Object.keys(found)[0];
      document.getElementById(id(first))?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(role, data, consent)),
      });

      let body: Record<string, unknown> = {};
      try {
        const parsed = await res.json();
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          body = parsed as Record<string, unknown>;
        }
      } catch {
        // Unparseable response — handled by the !ok branch below.
      }

      const message =
        typeof body.error === "string" && body.error.trim()
          ? body.error
          : undefined;

      if (res.status === 429) {
        setSubmitError(
          message ??
            "Too many submissions from this connection — please wait a few minutes and try again, or call us instead."
        );
        return;
      }

      if (res.status === 422) {
        const fieldErrors = readFieldErrors(body.fields);
        setErrors(fieldErrors);
        setSubmitError(
          message ?? "Please check the highlighted fields and try again."
        );
        const first = Object.keys(fieldErrors)[0];
        if (first) document.getElementById(id(first))?.focus();
        return;
      }

      if (!res.ok || body.ok !== true) {
        setSubmitError(
          message ??
            "Your enquiry couldn't be submitted just now. Please try again, or call us and we'll take the details over the phone."
        );
        return;
      }

      // Success. The upstream shape isn't frozen beyond `ok`, so the reference
      // is read defensively and simply omitted when it isn't sent.
      const reference =
        typeof body.reference === "string" && body.reference.trim()
          ? body.reference.trim()
          : null;
      setDone({ reference, consented: consent });
    } catch {
      // Network failure or an aborted request — nothing typed is cleared, so
      // retrying costs the visitor nothing.
      setSubmitError(
        "We couldn't reach our server. Check your connection and try again — or call us and we'll take the details over the phone."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setData(EMPTY);
    setConsent(false);
    setErrors({});
    setSubmitError(null);
    setDone(null);
  };

  /* ── Success ─────────────────────────────────────────────────────────── */

  if (done) {
    return (
      <div className="py-6 text-center" role="status">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-surface">
          <CheckCircle2 className="h-9 w-9 text-success" aria-hidden="true" />
        </span>
        <p className="t-h3 mt-6 text-primary-800">Your post is with our team</p>
        {done.reference && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-050 px-4 py-2 t-body-sm text-primary-800">
            Your reference:{" "}
            <span className="t-code font-extrabold text-primary-800">
              {done.reference}
            </span>
          </p>
        )}
        <p className="t-body-sm mx-auto mt-4 max-w-md text-text-secondary">
          A Wicket Travel coordinator reads every post themselves and will be in
          touch on the number you gave us. Nothing is matched automatically.
        </p>
        <p className="t-body-sm mx-auto mt-4 max-w-md rounded-md bg-primary-050 px-4 py-3 text-primary-800">
          {done.consented
            ? "You asked to appear on the community board, so once our team has reviewed your post a shortened version will show there — first name and last initial, the route, date and airline, and your amount. Your phone number, email address, surname and notes are not part of it, and nobody can contact you off a listing."
            : "You did not tick the community-board box, so nothing about this post will be published. It stays between you and our team."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-outline">
            Post another
          </button>
        </div>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────────── */

  const isTraveller = role === "traveller";

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      {/* Role — native radios so the whole group is keyboard- and SR-native. */}
      <fieldset>
        <legend className="t-label-1 text-primary-800">
          Which side are you on?
        </legend>
        <p className="t-body-sm mt-1 text-text-secondary">
          You can switch at any time — nothing you have typed is lost.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ROLES.map((option) => {
            const active = role === option.key;
            const Icon = option.key === "traveller" ? HandHeart : Users;
            return (
              <label
                key={option.key}
                htmlFor={id(`role-${option.key}`)}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-md border p-4 transition-colors duration-200",
                  active
                    ? "border-primary-800 bg-primary-050"
                    : "border-neutral-300 bg-neutral-000 hover:border-primary-200 hover:bg-primary-050/60"
                )}
              >
                <input
                  type="radio"
                  id={id(`role-${option.key}`)}
                  name={`${uid}-enquiry-type`}
                  value={option.key}
                  checked={active}
                  onChange={() => setRole(option.key)}
                  className="mt-1 h-4 w-4 shrink-0 accent-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
                />
                <span>
                  <span className="flex items-center gap-2 t-label-1 text-primary-800">
                    <Icon
                      className="h-4 w-4 shrink-0 text-accent-500"
                      aria-hidden="true"
                    />
                    {option.label}
                  </span>
                  <span className="mt-1 block t-body-sm text-text-secondary">
                    {option.blurb}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* About you — always the person filling the form in, either side. */}
      <fieldset className="space-y-4">
        <legend className="t-label-1 text-primary-800">About you</legend>

        <div>
          <label htmlFor={id("full_name")} className={labelClass}>
            Your full name
          </label>
          <input
            id={id("full_name")}
            className="input mt-2"
            value={data.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            autoComplete="name"
            maxLength={120}
            aria-required="true"
            aria-invalid={!!errors.full_name}
            aria-describedby={
              errors.full_name ? `${id("full_name")}-error` : undefined
            }
            placeholder="Aisha Khan"
          />
          {errors.full_name && (
            <Err id={`${id("full_name")}-error`} message={errors.full_name} />
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={id("phone")} className={labelClass}>
              Phone or WhatsApp
            </label>
            <input
              id={id("phone")}
              type="tel"
              inputMode="tel"
              className="input mt-2"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              autoComplete="tel"
              maxLength={40}
              aria-required="true"
              aria-invalid={!!errors.phone}
              aria-describedby={
                errors.phone ? `${id("phone")}-error` : undefined
              }
              placeholder="+44 7000 000000"
            />
            {errors.phone && (
              <Err id={`${id("phone")}-error`} message={errors.phone} />
            )}
          </div>
          <div>
            <label htmlFor={id("email")} className={labelClass}>
              Email
            </label>
            <input
              id={id("email")}
              type="email"
              inputMode="email"
              className="input mt-2"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
              maxLength={254}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? `${id("email")}-error` : undefined
              }
              placeholder="you@example.com"
            />
            {errors.email && (
              <Err id={`${id("email")}-error`} message={errors.email} />
            )}
          </div>
        </div>
      </fieldset>

      {/* The journey — shared by both sides. */}
      <fieldset className="space-y-4">
        <legend className="t-label-1 text-primary-800">The journey</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={id("from_location")} className={labelClass}>
              Flying from
            </label>
            <input
              id={id("from_location")}
              className="input mt-2"
              value={data.from_location}
              onChange={(e) => set("from_location", e.target.value)}
              maxLength={120}
              aria-required="true"
              aria-invalid={!!errors.from_location}
              aria-describedby={
                errors.from_location
                  ? `${id("from_location")}-error`
                  : undefined
              }
              placeholder="Delhi (DEL)"
            />
            {errors.from_location && (
              <Err
                id={`${id("from_location")}-error`}
                message={errors.from_location}
              />
            )}
          </div>
          <div>
            <label htmlFor={id("to_location")} className={labelClass}>
              Flying to
            </label>
            <input
              id={id("to_location")}
              className="input mt-2"
              value={data.to_location}
              onChange={(e) => set("to_location", e.target.value)}
              maxLength={120}
              aria-required="true"
              aria-invalid={!!errors.to_location}
              aria-describedby={
                errors.to_location ? `${id("to_location")}-error` : undefined
              }
              placeholder="London Heathrow (LHR)"
            />
            {errors.to_location && (
              <Err
                id={`${id("to_location")}-error`}
                message={errors.to_location}
              />
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={id("travel_date")} className={labelClass}>
              Travel date{" "}
              <span className="font-normal text-text-secondary">
                (optional)
              </span>
            </label>
            <input
              id={id("travel_date")}
              type="date"
              className="input mt-2"
              value={data.travel_date}
              onChange={(e) => set("travel_date", e.target.value)}
              aria-invalid={!!errors.travel_date}
              aria-describedby={
                errors.travel_date
                  ? `${id("travel_date")}-error`
                  : `${id("travel_date")}-hint`
              }
            />
            {errors.travel_date ? (
              <Err
                id={`${id("travel_date")}-error`}
                message={errors.travel_date}
              />
            ) : (
              <p id={`${id("travel_date")}-hint`} className={hintClass}>
                Shown on the board if you consent below, so travellers can match
                it to their own flight.
              </p>
            )}
          </div>
          <div>
            <label htmlFor={id("airline")} className={labelClass}>
              Airline{" "}
              <span className="font-normal text-text-secondary">
                (optional)
              </span>
            </label>
            <input
              id={id("airline")}
              className="input mt-2"
              value={data.airline}
              onChange={(e) => set("airline", e.target.value)}
              maxLength={120}
              placeholder="Emirates"
            />
          </div>
        </div>

        <div>
          <label htmlFor={id("languages_spoken")} className={labelClass}>
            {isTraveller
              ? "Languages you speak"
              : "Languages your relative speaks"}{" "}
            <span className="font-normal text-text-secondary">(optional)</span>
          </label>
          <input
            id={id("languages_spoken")}
            className="input mt-2"
            value={data.languages_spoken}
            onChange={(e) => set("languages_spoken", e.target.value)}
            maxLength={200}
            placeholder="English, Urdu, Punjabi"
          />
          <p className={hintClass}>
            A shared language is often what matters most on a long flight.
          </p>
        </div>
      </fieldset>

      {/* Role-specific block. */}
      {isTraveller ? (
        <fieldset className="space-y-4">
          <legend className="t-label-1 text-primary-800">
            What you can offer
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("parents_capacity")} className={labelClass}>
                People you could accompany{" "}
                <span className="font-normal text-text-secondary">
                  (optional)
                </span>
              </label>
              <input
                id={id("parents_capacity")}
                type="number"
                inputMode="numeric"
                min={1}
                max={99}
                step={1}
                className="input mt-2"
                value={data.parents_capacity}
                onChange={(e) => set("parents_capacity", e.target.value)}
                aria-invalid={!!errors.parents_capacity}
                aria-describedby={
                  errors.parents_capacity
                    ? `${id("parents_capacity")}-error`
                    : undefined
                }
                placeholder="1"
              />
              {errors.parents_capacity && (
                <Err
                  id={`${id("parents_capacity")}-error`}
                  message={errors.parents_capacity}
                />
              )}
            </div>
            <div>
              <label htmlFor={id("assistance_fee")} className={labelClass}>
                Amount you&rsquo;re asking for (£){" "}
                <span className="font-normal text-text-secondary">
                  (optional)
                </span>
              </label>
              <input
                id={id("assistance_fee")}
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step={1}
                className="input mt-2"
                value={data.assistance_fee}
                onChange={(e) => set("assistance_fee", e.target.value)}
                aria-invalid={!!errors.assistance_fee}
                aria-describedby={
                  errors.assistance_fee
                    ? `${id("assistance_fee")}-error`
                    : `${id("assistance_fee")}-hint`
                }
                placeholder="0"
              />
              {errors.assistance_fee ? (
                <Err
                  id={`${id("assistance_fee")}-error`}
                  message={errors.assistance_fee}
                />
              ) : (
                <p id={`${id("assistance_fee")}-hint`} className={hintClass}>
                  Your figure, settled directly with the family. Leave it blank
                  to agree it between you.
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor={id("assistance_offered")} className={labelClass}>
              How you can help{" "}
              <span className="font-normal text-text-secondary">
                (optional)
              </span>
            </label>
            <textarea
              id={id("assistance_offered")}
              rows={4}
              maxLength={4000}
              className="input mt-2 resize-y"
              value={data.assistance_offered}
              onChange={(e) => set("assistance_offered", e.target.value)}
              placeholder="Happy to meet at check-in, stay together through security and hand over to family at arrivals."
            />
          </div>
        </fieldset>
      ) : (
        <fieldset className="space-y-4">
          <legend className="t-label-1 text-primary-800">
            About your relative
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("parent_name")} className={labelClass}>
                Their name{" "}
                <span className="font-normal text-text-secondary">
                  (optional)
                </span>
              </label>
              <input
                id={id("parent_name")}
                className="input mt-2"
                value={data.parent_name}
                onChange={(e) => set("parent_name", e.target.value)}
                maxLength={120}
                placeholder="Fatima"
              />
              <p className={hintClass}>
                Not shown on the board — for our team only.
              </p>
            </div>
            <div>
              <label htmlFor={id("parent_age")} className={labelClass}>
                Their age{" "}
                <span className="font-normal text-text-secondary">
                  (optional)
                </span>
              </label>
              <input
                id={id("parent_age")}
                type="number"
                inputMode="numeric"
                min={1}
                max={120}
                step={1}
                className="input mt-2"
                value={data.parent_age}
                onChange={(e) => set("parent_age", e.target.value)}
                aria-invalid={!!errors.parent_age}
                aria-describedby={
                  errors.parent_age ? `${id("parent_age")}-error` : undefined
                }
                placeholder="72"
              />
              {errors.parent_age && (
                <Err
                  id={`${id("parent_age")}-error`}
                  message={errors.parent_age}
                />
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("relationship")} className={labelClass}>
                They are your{" "}
                <span className="font-normal text-text-secondary">
                  (optional)
                </span>
              </label>
              <select
                id={id("relationship")}
                className="input mt-2"
                value={data.relationship}
                onChange={(e) => set("relationship", e.target.value)}
              >
                <option value="">Select…</option>
                {RELATIONSHIPS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={id("mobility_needs")} className={labelClass}>
                Mobility needs{" "}
                <span className="font-normal text-text-secondary">
                  (optional)
                </span>
              </label>
              <select
                id={id("mobility_needs")}
                className="input mt-2"
                value={data.mobility_needs}
                onChange={(e) => set("mobility_needs", e.target.value)}
              >
                <option value="">Select…</option>
                {MOBILITY_NEEDS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={id("offer_amount")} className={labelClass}>
              Amount you&rsquo;re offering (£){" "}
              <span className="font-normal text-text-secondary">
                (optional)
              </span>
            </label>
            <input
              id={id("offer_amount")}
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step={1}
              className="input mt-2 sm:max-w-[12rem]"
              value={data.offer_amount}
              onChange={(e) => set("offer_amount", e.target.value)}
              aria-invalid={!!errors.offer_amount}
              aria-describedby={
                errors.offer_amount
                  ? `${id("offer_amount")}-error`
                  : `${id("offer_amount")}-hint`
              }
              placeholder="50"
            />
            {errors.offer_amount ? (
              <Err
                id={`${id("offer_amount")}-error`}
                message={errors.offer_amount}
              />
            ) : (
              <p id={`${id("offer_amount")}-hint`} className={hintClass}>
                You set this figure and pay the helper directly. Wicket Travel
                takes nothing from it and charges you nothing to post.
              </p>
            )}
          </div>

          <div>
            <label htmlFor={id("assistance_needed")} className={labelClass}>
              What they need help with{" "}
              <span className="font-normal text-text-secondary">
                (optional)
              </span>
            </label>
            <textarea
              id={id("assistance_needed")}
              rows={4}
              maxLength={4000}
              className="input mt-2 resize-y"
              value={data.assistance_needed}
              onChange={(e) => set("assistance_needed", e.target.value)}
              placeholder="She doesn't speak much English and finds transfers stressful — mainly company through check-in, security and immigration."
            />
          </div>
        </fieldset>
      )}

      {/* Anything else + the consent gate. */}
      <fieldset className="space-y-4">
        <legend className="t-label-1 text-primary-800">
          Anything else, and one choice
        </legend>

        <div>
          <label htmlFor={id("notes")} className={labelClass}>
            Notes for our team{" "}
            <span className="font-normal text-text-secondary">(optional)</span>
          </label>
          <textarea
            id={id("notes")}
            rows={3}
            maxLength={4000}
            className="input mt-2 resize-y"
            value={data.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Best time to call, flexible dates, anything we should know."
          />
        </div>

        {/* The one thing that can ever make an entry public. Opt-in, unticked. */}
        <div className="rounded-md border border-neutral-300 bg-primary-050 p-4 sm:p-5">
          <label htmlFor={id("consent")} className="flex cursor-pointer gap-3">
            <input
              type="checkbox"
              id={id("consent")}
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-describedby={`${id("consent")}-detail`}
              className="mt-1 h-4 w-4 shrink-0 accent-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
            />
            <span>
              <span className="flex items-center gap-2 t-label-1 text-primary-800">
                <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                Show a short version of my post on the community board
              </span>
              <span
                id={`${id("consent")}-detail`}
                className="mt-2 block t-body-sm text-text-secondary"
              >
                Tick this and, once our team has reviewed it, the board will
                show a shortened version of your post: your first name and last
                initial, the route, the travel date and airline, any languages,
                the amount, and the description you wrote above. Your phone
                number, email address, surname, your relative&rsquo;s name and
                your notes to our team are never published, and nobody can
                contact you off a listing. Leave it unticked and nothing appears
                publicly at all — your post goes only to our team, which is the
                only way anyone is ever introduced either way.
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      {submitError && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md bg-error-surface px-4 py-3 t-label-2 text-error"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {submitError}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full px-6 py-4 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending your post…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              {isTraveller ? "Offer to help" : "Post my request"}
            </>
          )}
        </button>
        <p className="mt-3 text-center t-caption text-text-secondary">
          Free to post. No account needed. We only use your details to arrange
          this introduction.
        </p>
      </div>
    </form>
  );
}
