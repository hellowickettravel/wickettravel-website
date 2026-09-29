import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Handshake,
  PenLine,
  ShieldCheck,
  Users,
} from "lucide-react";
import { BUSINESS } from "@/lib/seo";

/**
 * The board's right-hand rail: how it works, what we promise, and the way in.
 *
 * Server-rendered and passed into components/AssistFamilyApp.tsx as a prop, so
 * the three standing explanations ship as HTML rather than inflating the
 * client bundle of a component that only needs to be interactive for its
 * filters.
 *
 * Everything here is deliberately short. The long-form answers on vetting,
 * money and privacy live in the FAQ at the foot of the page, where someone
 * who wants them goes looking; a rail that sits beside the listings has to
 * be scannable or it is just more page to scroll past.
 */

const STEPS = [
  {
    title: "Post your journey",
    body: "Your route, the date, and what kind of help is needed or offered.",
  },
  {
    title: "We find the other half",
    body: "A coordinator checks your post against everyone travelling that route.",
  },
  {
    title: "We introduce you",
    body: "Both sides agree first. You settle any amount directly between you.",
  },
];

/* Only claims the service actually makes elsewhere on this page — no invented
   response times, no verification badge we do not issue. */
const PROMISES = [
  "Contact details are never published",
  "Every post is read by a person here",
  "Free to post — we take no cut",
  "Withdraw your post at any time",
];

export default function AssistFamilyRail() {
  return (
    <div className="space-y-4">
      <section
        aria-labelledby="rail-how"
        className="card p-5"
      >
        <h2
          id="rail-how"
          className="t-label-1 flex items-center gap-2 text-primary-800"
        >
          <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-accent-500" aria-hidden="true" />
          How it works
        </h2>

        <ol className="relative mt-5 space-y-5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-3">
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-[-1.25rem] left-[13px] top-7 w-px bg-neutral-300"
                />
              )}
              <span
                aria-hidden="true"
                className="relative z-raised grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full bg-primary-800 t-label-3 text-neutral-000"
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block t-label-2 text-primary-800">
                  {step.title}
                </span>
                <span className="mt-1 block t-caption text-text-secondary">
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="rail-safety"
        className="rounded-md border border-success/20 bg-success-surface p-5"
      >
        <h2
          id="rail-safety"
          className="t-label-1 flex items-center gap-2 text-primary-800"
        >
          <BadgeCheck className="h-4.5 w-4.5 shrink-0 text-success" aria-hidden="true" />
          Your safety matters
        </h2>
        <ul className="mt-4 space-y-2">
          {PROMISES.map((p) => (
            <li key={p} className="flex gap-2 t-caption text-text-secondary">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-success/20 pt-3 t-caption text-text-secondary">
          We review every post by hand — but this is our own check, not a DBS
          or criminal-records check, and we say so plainly in the{" "}
          <Link
            href="/parents-tickets#faq"
            className="t-label-3 text-primary-800 underline decoration-accent-400 underline-offset-2 hover:text-accent-600"
          >
            FAQ
          </Link>
          .
        </p>
      </section>

      <section
        aria-labelledby="rail-join"
        className="rounded-md border border-primary-100 bg-primary-050 p-5"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-000">
          <Users className="h-5 w-5 text-primary-700" aria-hidden="true" />
        </span>
        <h2 id="rail-join" className="t-label-1 mt-3 text-primary-800">
          Not on the board yet?
        </h2>
        <p className="mt-1 t-caption text-text-secondary">
          Posting is free, takes two minutes and needs no account. A
          coordinator reads it the same day.
        </p>
        <a
          href="#post-to-the-board"
          className="btn btn-secondary btn-sm mt-4 w-full"
        >
          <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
          Post a request
        </a>
        <a
          href={`tel:${BUSINESS.phone}`}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xs t-label-3 text-primary-800 transition-colors hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
        >
          Or talk to us: {BUSINESS.phoneDisplay}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </section>

      {/* Editorial serif, the one voice in the system that isn't UI — the
          closing line on a page about strangers helping each other. */}
      <p className="flex items-start gap-2 px-2 pt-2 t-editorial-3 italic text-text-secondary">
        <Handshake className="mt-1 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
        Same route. Different stories. Better together.
      </p>
    </div>
  );
}
