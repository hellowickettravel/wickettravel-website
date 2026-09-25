"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, PhoneCall, ShieldCheck, X } from "lucide-react";
import ParentsEnquiryForm, { type EnquiryPrefill } from "@/components/ParentsEnquiryForm";
import type { EnquiryType } from "@/lib/parents";
import { BUSINESS } from "@/lib/seo";
import { whatsappLink } from "@/components/travel-assist/constants";

export type DialogState = {
  role: EnquiryType;
  prefill?: EnquiryPrefill;
  /** Set when the visitor came from a listing card, e.g. "Arjun M." */
  withName?: string;
  /** Bumped on every open so the form always starts fresh. */
  nonce: number;
};

/**
 * The one place this page takes a real enquiry: the existing Parents Travel
 * Assist form (components/ParentsEnquiryForm — posts to /api/parent-ticket,
 * the live portal relay), in a dialog, pre-filled with whatever route and date
 * the visitor already chose. Same modal mechanics as VisaBanner's: scroll lock,
 * Escape to close, focus moved in on open and back to the page on close.
 */
export default function PostTripDialog({
  state,
  onClose,
}: {
  state: DialogState | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = state !== null;

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      returnTo?.focus?.();
    };
  }, [open, onClose]);

  const isTraveller = state?.role === "traveller";
  const title = state?.withName
    ? isTraveller
      ? `Offer to help ${state.withName.split(/[\s&]/)[0]}’s family`
      : `Get matched with ${state.withName}`
    : isTraveller
      ? "Offer to help on your flight"
      : "Post your parents’ trip";

  const waMessage = isTraveller
    ? "Hi Wicket Travel — I'm flying soon and would like to help a family through Parents Travel Assist."
    : "Hi Wicket Travel — my parents are flying from India to the UK and I'd like a companion for them through Parents Travel Assist.";

  return (
    <AnimatePresence>
      {state && (
        <div className="fixed inset-0 z-modal flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            key="pta-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            aria-hidden="true"
            className="absolute inset-0 bg-primary-900/60"
          />
          <motion.div
            key="pta-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pta-dialog-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-lg bg-neutral-000 shadow-e3 sm:rounded-lg"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 bg-primary-800 px-6 py-5 sm:px-8">
              <div className="min-w-0">
                <h2 id="pta-dialog-title" className="t-h4 text-text-on-dark">
                  {title}
                </h2>
                <p className="mt-2 flex items-center gap-2 t-body-sm text-primary-100">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                  A coordinator checks every post and both sides before any introduction.
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 -mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-text-on-dark/80 transition-colors hover:bg-neutral-000/10 hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/50"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 border-b border-primary-100 bg-primary-050 px-6 py-3 t-label-3 text-primary-800 sm:px-8">
              <span className="text-text-secondary">Rather talk?</span>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="inline-flex items-center gap-1.5 rounded-xs hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
              >
                <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
                {BUSINESS.phoneDisplay}
              </a>
              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xs hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                WhatsApp us
              </a>
            </div>

            <div className="overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
              <ParentsEnquiryForm
                key={state.nonce}
                initialRole={state.role}
                initialValues={state.prefill}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
