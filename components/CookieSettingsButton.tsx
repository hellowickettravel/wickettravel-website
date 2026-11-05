"use client";

import { openCookieSettings } from "@/lib/consent";

/** Footer link that reopens the cookie choices from any page. */
export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
