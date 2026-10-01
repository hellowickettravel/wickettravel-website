import Link from "next/link";
import {
  BadgeCheck,
  Check,
  Handshake,
  PenLine,
  Search,
  ShieldCheck,
} from "lucide-react";

/**
 * The three standing explanations that used to sit in a right-hand rail:
 * how it works, what we promise, and where our checks stop.
 *
 * The board is now two facing columns with no room for a third, so these run
 * as a horizontal strip beneath it instead. Server-rendered — nothing here is
 * interactive — so it costs the board's client bundle nothing.
 *
 * Deliberately short. The long-form answers on vetting, money and privacy
 * live in the FAQ at the foot of the page, where someone who wants them goes
 * looking; a strip under the listings has to be scannable or it is just more
 * page to scroll past.
 */

const STEPS = [
  "Post your route, date and the help needed or offered.",
  "A coordinator checks it against everyone travelling that route.",
  "We introduce you both. You settle any amount directly between you.",
];

/* Only claims the service actually makes — no invented response times, no
   verification badge we do not issue. */
const PROMISES = [
  "Contact details are never published",
  "Every post is read by a person here",
  "Free to post — we take no cut",
  "Withdraw your post at any time",
];

export default function AssistFamilyRail() {
  return (
    <section
      aria-labelledby="assist-family-trust"
      className="bg-neutral-000 py-10 md:py-12"
    >
      <div className="container-page">
        <h2 id="assist-family-trust" className="sr-only">
          How Parent Travel Assist works, and what we promise
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <h3 className="t-label-1 flex items-center gap-2 text-primary-800">
              <ShieldCheck className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
              How it works
            </h3>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-primary-800 t-caption font-bold text-neutral-000"
                  >
                    {i + 1}
                  </span>
                  <span className="t-caption text-text-secondary">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-md border border-success/20 bg-success-surface p-5">
            <h3 className="t-label-1 flex items-center gap-2 text-primary-800">
              <BadgeCheck className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              Your safety matters
            </h3>
            <ul className="mt-4 space-y-2">
              {PROMISES.map((p) => (
                <li key={p} className="flex gap-2 t-caption text-text-secondary">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-success/20 pt-3 t-caption text-text-secondary">
              We review every post by hand — but this is our own check, not a
              DBS or criminal-records check, and we say so plainly in the{" "}
              <Link
                href="/parents-tickets#faq"
                className="t-label-3 text-primary-800 underline decoration-accent-400 underline-offset-2 hover:text-accent-600"
              >
                FAQ
              </Link>
              .
            </p>
          </div>

          <div className="rounded-md border border-primary-100 bg-primary-050 p-5">
            <h3 className="t-label-1 flex items-center gap-2 text-primary-800">
              <Search className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
              Not on the board yet?
            </h3>
            <p className="mt-3 t-caption text-text-secondary">
              Posting is free, takes two minutes and needs no account. A
              coordinator reads it the same day, and nothing appears publicly
              unless you tick the box.
            </p>
            <a href="#post-to-the-board" className="btn btn-secondary btn-sm mt-4 w-full">
              <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
              Post a request
            </a>
            <p className="mt-4 flex items-start gap-2 t-editorial-3 italic text-text-secondary">
              <Handshake className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-400" aria-hidden="true" />
              Same route. Different stories. Better together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
