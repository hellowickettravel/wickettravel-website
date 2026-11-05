"use client";

import Script from "next/script";
import { useEffect, useRef, type ReactNode } from "react";
import { useConsentFor } from "@/components/CookieConsent";

/**
 * Trustpilot's official TrustBox, so the score shown is always the live one.
 *
 * It loads only when BOTH are true:
 *  - NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID is set (find it in Trustpilot
 *    Business → Integrations → TrustBox; it's the data-businessunit-id), and
 *  - the visitor allowed the "Reviews widget" cookie category (Trustpilot's
 *    script sets its own cookies).
 * Otherwise `fallback` (a plain link to the Trustpilot profile) renders.
 */
const BUSINESS_UNIT_ID = process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID;
/** "Micro Star" TrustBox template — free on every Trustpilot plan. */
const TEMPLATE_ID = "5419b732fbfb950b10de65e5";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement, force?: boolean) => void };
  }
}

export default function TrustpilotWidget({
  fallback,
  theme = "dark",
}: {
  fallback: ReactNode;
  theme?: "light" | "dark";
}) {
  const allowed = useConsentFor("reviews");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (allowed && ref.current && window.Trustpilot) {
      window.Trustpilot.loadFromElement(ref.current, true);
    }
  }, [allowed]);

  if (!BUSINESS_UNIT_ID || !allowed) return <>{fallback}</>;

  return (
    <>
      <Script
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="afterInteractive"
        onLoad={() => ref.current && window.Trustpilot?.loadFromElement(ref.current, true)}
      />
      <div
        ref={ref}
        className="trustpilot-widget"
        data-locale="en-GB"
        data-template-id={TEMPLATE_ID}
        data-businessunit-id={BUSINESS_UNIT_ID}
        data-style-height="24px"
        data-style-width="100%"
        data-theme={theme}
      >
        <a href="https://uk.trustpilot.com/review/wickettravel.com" target="_blank" rel="noopener noreferrer">
          Trustpilot
        </a>
      </div>
    </>
  );
}
