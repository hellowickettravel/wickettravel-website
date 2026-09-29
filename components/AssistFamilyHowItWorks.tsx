"use client";

import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  EyeOff,
  HandHeart,
  Handshake,
  PenLine,
  Search,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * "How it works", as a control rather than an essay.
 *
 * This replaces two side-by-side cards of prose — three numbered paragraphs
 * each, plus a ~70-word privacy notice repeated verbatim on both. Every
 * visitor is on exactly one side of this service, so showing them both at
 * full length meant half the words on screen were never for the person
 * reading them. A visitor picks their side and reads three short steps.
 *
 * The copy is cut to the bone deliberately: the long-form answers on vetting,
 * money and privacy all still exist, in the FAQ directly below, where someone
 * who wants them goes looking. What survives here is the shape of the thing.
 *
 * The privacy mechanic is the one exception to that cutting — it stays on
 * screen for both sides, because it is the objection that stops people
 * posting, and is repeated again beside the consent checkbox and in the FAQ.
 */

const SIDES = [
  {
    key: "family" as const,
    tab: "I need help for a relative",
    icon: Users,
    steps: [
      {
        icon: PenLine,
        title: "Post the journey",
        body: "Route, rough date, what they'd find hard alone, and what you'd like to offer. Two minutes, no account.",
      },
      {
        icon: Search,
        title: "We find someone going the same way",
        body: "A coordinator checks your post against travellers already booked on that route. No algorithm.",
      },
      {
        icon: Handshake,
        title: "We introduce you",
        body: "Both sides say yes, we put you in touch, and you agree the amount directly between you.",
      },
    ],
  },
  {
    key: "traveller" as const,
    tab: "I'm flying — I can help",
    icon: HandHeart,
    steps: [
      {
        icon: PenLine,
        title: "Post the flight you're on",
        body: "Your route and date, how many people you could accompany, and what you're happy to help with.",
      },
      {
        icon: BadgeCheck,
        title: "We check it and look for a family",
        body: "Every offer is read by hand and lined up against families on that route. Strangers never contact you.",
      },
      {
        icon: Handshake,
        title: "We make the introduction",
        body: "If it's a good fit, we introduce you both. Anything you asked for is paid to you directly.",
      },
    ],
  },
];

const PROMISES = [
  { icon: EyeOff, text: "First name and last initial only" },
  { icon: BadgeCheck, text: "No phone number or email ever published" },
  { icon: Handshake, text: "Every introduction made by a person here" },
];

export default function AssistFamilyHowItWorks() {
  const [active, setActive] = useState<"family" | "traveller">("family");
  const side = SIDES.find((s) => s.key === active) ?? SIDES[0];

  return (
    <div>
      <div
        role="group"
        aria-label="Which side are you on"
        className="mx-auto grid max-w-xl grid-cols-2 gap-1 rounded-sm bg-neutral-000 p-1 shadow-e1"
      >
        {SIDES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive(s.key)}
            aria-pressed={active === s.key}
            className={cn(
              "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xs px-3 text-center t-label-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
              active === s.key
                ? s.key === "traveller"
                  ? "bg-primary-800 text-neutral-000"
                  : "bg-accent-500 text-neutral-000"
                : "text-text-secondary hover:bg-neutral-100 hover:text-primary-800"
            )}
          >
            <s.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{s.tab}</span>
          </button>
        ))}
      </div>

      {/* Three steps on one connector line. The line is the sequence; the
          numbers only confirm it. Hidden below lg, where the steps stack and
          a horizontal rule would point nowhere. */}
      <ol className="mt-10 grid gap-6 lg:grid-cols-3 lg:gap-8">
        {side.steps.map((step, i) => (
          <li key={step.title} className="relative">
            {/* The connector belongs to the step it leaves, not to the row —
                drawn per item so it stops at the last icon instead of running
                on to the container edge with nothing at the end of it. */}
            {i < side.steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-14 right-[-2rem] top-6 hidden h-px bg-neutral-300 lg:block"
              />
            )}
            <span
              className={cn(
                "relative z-raised grid h-12 w-12 place-items-center rounded-full ring-8 ring-sand-500",
                active === "traveller"
                  ? "bg-primary-800 text-neutral-000"
                  : "bg-accent-500 text-neutral-000"
              )}
            >
              <step.icon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Step {i + 1}</span>
            </span>
            <h3 className="t-h5 mt-5 text-primary-800">
              <span
                className={cn(
                  "mr-2 t-label-3",
                  active === "traveller" ? "text-primary-500" : "text-accent-600"
                )}
                aria-hidden="true"
              >
                0{i + 1}
              </span>
              {step.title}
            </h3>
            <p className="t-body-sm mt-2 max-w-sm text-text-secondary">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      {/* The privacy mechanic, as three chips instead of a paragraph each
          side. Same promise, a fifth of the words. */}
      <ul className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {PROMISES.map((p) => (
          <li
            key={p.text}
            className="inline-flex items-center gap-2 rounded-full border border-sand-600 bg-neutral-000 px-4 py-2 t-label-3 text-primary-800"
          >
            <p.icon className="h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
            {p.text}
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center">
        <a
          href="#post-to-the-board"
          className="inline-flex items-center gap-2 rounded-xs t-label-1 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-4 transition-colors hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
        >
          {active === "traveller" ? "Post the flight you're on" : "Post the journey"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
