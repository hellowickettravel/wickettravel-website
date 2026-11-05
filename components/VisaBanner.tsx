"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, X } from "lucide-react";
import VisaEnquiryForm from "@/components/VisaEnquiryForm";
import Link from "next/link";
import { PERKS, VISA_DISCLAIMER, VISA_FEE_NOTE } from "@/lib/visa";

/**
 * Dubai Visa — marketing banner only. The full application wizard is retired;
 * the banner's CTA opens a short enquiry modal that posts to the same
 * /api/visa-enquiry relay, so an expert can call the traveller back and take
 * the detail over the phone.
 *
 * The form itself now lives in components/VisaEnquiryForm.tsx, shared with the
 * dedicated /visa page — same fields, validation and request contract; this
 * file owns only the banner and the modal chrome around it.
 */

export default function VisaBanner() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll, close on Escape, and move focus into the dialog.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section
      id="dubai-visa"
      className="section scroll-mt-16 bg-sand-500"
      aria-labelledby="dubai-visa-heading"
    >
      <div className="container-page">
        {/* Flat navy — same reasoning as CallUsBand's banner. Keeping this
            section 100% navy/orange also holds PRODUCT.md's line against
            government-lookalike visa styling. */}
        <div className="relative overflow-hidden rounded-lg bg-primary-800 shadow-e3 shadow-primary-900/30 ring-1 ring-neutral-000/10">
          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div className="text-center lg:text-left">
              <h2 id="dubai-visa-heading" className="t-h2 text-text-on-dark">
                Dubai visa help, handled end to end
              </h2>
              <p className="t-body-lg mx-auto mt-4 max-w-xl text-primary-200 lg:mx-0">
                Help with your UAE tourist or visit visa — from the eligibility
                check right through to submission. We&apos;re a private travel
                agent, not a government website; the UAE authorities decide
                every application.
              </p>
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 t-label-2 text-primary-100 lg:justify-start">
                {PERKS.map((perk) => (
                  <li key={perk} className="inline-flex items-center gap-2">
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-accent-400"
                      aria-hidden="true"
                    />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-3">
              {/* Plain button — scale hover/tap dropped, see CallUsBand. The
                  click already has unmistakable feedback: a modal opens. */}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-3 rounded-full bg-accent-500 px-8 py-4 t-label-1 text-text-on-dark shadow-e2 shadow-accent-500/30 transition-colors hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800"
              >
                Start your visa enquiry
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <p className="flex items-center gap-2 t-body-sm text-primary-200">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Takes a minute — no account needed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 flex z-modal items-end justify-center p-0 sm:items-center sm:p-6">
            <motion.div
              key="visa-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
            />
            <motion.div
              key="visa-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="visa-modal-title"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-lg bg-neutral-000 shadow-e3 sm:rounded-lg"
            >
              {/* Was `bg-gradient-to-r from-primary-800 to-primary-800` — a
                  gradient between two identical stops, i.e. a no-op that still
                  cost a paint layer. */}
              <div className="flex shrink-0 items-start justify-between gap-4 bg-primary-800 px-6 py-6 sm:px-8">
                <div>
                  <h3 id="visa-modal-title" className="t-h4 text-text-on-dark">
                    Dubai visa enquiry
                  </h3>
                  <p className="mt-2 flex items-center gap-2 t-body-sm text-primary-100/85">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    We aim to call you back the same day.
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close enquiry form"
                  className="-mr-2 -mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-text-on-dark/80 transition-colors hover:bg-neutral-000/10 hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
                <p
                  role="note"
                  className="mb-6 rounded-md border border-neutral-300 bg-neutral-050 p-4 t-body-sm text-text-secondary"
                >
                  {VISA_DISCLAIMER} {VISA_FEE_NOTE}{" "}
                  <Link
                    href="/visa-terms"
                    className="font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                  >
                    Visa service terms
                  </Link>
                </p>
                <VisaEnquiryForm
                  idPrefix="vb"
                  onDone={() => setOpen(false)}
                  doneLabel="Done"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
