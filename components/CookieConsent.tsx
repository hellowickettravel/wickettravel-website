"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Cookie, X } from "lucide-react";
import {
  CONSENT_CATEGORIES,
  CONSENT_COOKIE,
  onConsentChange,
  onOpenCookieSettings,
  readConsent,
  saveConsent,
  type ConsentCategory,
  type ConsentState,
} from "@/lib/consent";

/* ── Reading the choice ────────────────────────────────────────────────
 * useSyncExternalStore over the cookie string: the server (and the first
 * client render) see "no choice yet, not hydrated", so the banner never
 * flashes into server HTML and nothing optional is ever server-rendered. */

function subscribe(cb: () => void) {
  return onConsentChange(cb);
}
function cookieSnapshot() {
  return document.cookie.includes(`${CONSENT_COOKIE}=`) ? document.cookie : "";
}
function serverSnapshot() {
  return null;
}

/** The visitor's saved choice; `undefined` until hydrated, `null` if none. */
export function useConsent(): ConsentState | null | undefined {
  const raw = useSyncExternalStore(subscribe, cookieSnapshot, serverSnapshot);
  if (raw === null) return undefined;
  return raw ? readConsent() : null;
}

/** True only once the visitor has allowed this category. */
export function useConsentFor(category: ConsentCategory): boolean {
  const c = useConsent();
  return !!c && c[category];
}

/* ── Banner + manage dialog ─────────────────────────────────────────── */

export default function CookieConsent() {
  const consent = useConsent();
  const [managing, setManaging] = useState(false);

  useEffect(() => onOpenCookieSettings(() => setManaging(true)), []);

  const choose = useCallback((choice: Pick<ConsentState, ConsentCategory>) => {
    saveConsent(choice);
    setManaging(false);
  }, []);

  const all = { analytics: true, reviews: true };
  const none = { analytics: false, reviews: false };

  return (
    <>
      {consent === null && !managing ? (
        <section
          aria-label="Cookie choices"
          className="fixed inset-x-0 bottom-0 z-modal border-t border-neutral-300 bg-neutral-000 shadow-e3"
        >
          <div className="container-page flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex min-w-0 gap-3">
              <Cookie className="mt-1 h-5 w-5 shrink-0 text-primary-700" aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="t-label-1 text-primary-800">Cookies on Wicket Travel</h2>
                <p className="mt-1 t-body-sm text-text-secondary">
                  We use necessary cookies to make the site work and remember
                  this choice. With your permission we&apos;d also measure how
                  the site is used and show our live Trustpilot rating. Nothing
                  optional loads until you choose.{" "}
                  <Link
                    href="/cookie-policy"
                    className="font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                  >
                    Cookie policy
                  </Link>
                </p>
              </div>
            </div>
            {/* Three buttons of equal weight: the ICO expects rejecting to be
                as easy as accepting. */}
            <div className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-3">
              <button type="button" onClick={() => setManaging(true)} className="btn btn-outline btn-sm h-11">
                Manage choices
              </button>
              <button type="button" onClick={() => choose(none)} className="btn btn-secondary btn-sm h-11">
                Reject all
              </button>
              <button type="button" onClick={() => choose(all)} className="btn btn-secondary btn-sm h-11">
                Accept all
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {managing ? (
        <ManageDialog
          initial={consent ?? none}
          onClose={() => setManaging(false)}
          onSave={choose}
        />
      ) : null}

      <ConsentScripts />
    </>
  );
}

function ManageDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: Pick<ConsentState, ConsentCategory>;
  onClose: () => void;
  onSave: (c: Pick<ConsentState, ConsentCategory>) => void;
}) {
  const [draft, setDraft] = useState({ analytics: initial.analytics, reviews: initial.reviews });
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    return () => d?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="z-modal m-auto w-[calc(100%-32px)] max-w-lg rounded-lg bg-neutral-000 p-0 shadow-e3 backdrop:bg-primary-900/60"
    >
      <div className="flex items-start justify-between gap-4 border-b border-neutral-300 p-6">
        <div>
          <h2 id={titleId} className="t-h4 text-primary-800">Cookie settings</h2>
          <p className="mt-1 t-body-sm text-text-secondary">
            Choose which optional cookies we may use. You can change this at
            any time from &ldquo;Cookie settings&rdquo; at the bottom of every page.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cookie settings"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-primary-800 hover:bg-primary-050 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <ul className="divide-y divide-neutral-300 px-6">
        <li className="py-4">
          <div className="flex items-center justify-between gap-4">
            <span className="t-label-1 text-primary-800">Necessary</span>
            <span className="t-label-3 text-text-secondary">Always on</span>
          </div>
          <p className="mt-1 t-body-sm text-text-secondary">
            Remember your cookie choice and keep the site and its forms secure.
          </p>
        </li>
        {CONSENT_CATEGORIES.map((c) => (
          <li key={c.id} className="py-4">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <span className="t-label-1 text-primary-800">{c.title}</span>
              <input
                type="checkbox"
                role="switch"
                checked={draft[c.id]}
                onChange={(e) => setDraft((d) => ({ ...d, [c.id]: e.target.checked }))}
                className="h-5 w-5 shrink-0 accent-primary-700"
              />
            </label>
            <p className="mt-1 t-body-sm text-text-secondary">{c.description}</p>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-2 border-t border-neutral-300 p-6 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onSave({ analytics: false, reviews: false })}
          className="btn btn-secondary btn-sm h-11"
        >
          Reject all
        </button>
        <button type="button" onClick={() => onSave(draft)} className="btn btn-outline btn-sm h-11">
          Save choices
        </button>
        <button
          type="button"
          onClick={() => onSave({ analytics: true, reviews: true })}
          className="btn btn-secondary btn-sm h-11"
        >
          Accept all
        </button>
      </div>
      <p className="px-6 pb-6 t-caption text-text-secondary">
        Details of every cookie are in our{" "}
        <Link href="/cookie-policy" className="font-bold text-primary-800 underline underline-offset-2">
          cookie policy
        </Link>
        .
      </p>
    </dialog>
  );
}

/* ── Optional scripts, loaded only after consent ─────────────────────── */

/** Google Analytics 4 measurement ID (G-XXXXXXX). Unset = no analytics at all. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function ConsentScripts() {
  const analytics = useConsentFor("analytics");
  if (!GA_ID || !analytics) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}
