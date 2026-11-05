/**
 * Cookie consent: one small store shared by the banner, the footer's
 * "Cookie settings" button and anything that loads a non-essential script.
 *
 * Rules this implements (UK GDPR + PECR, ICO guidance):
 * - Nothing optional loads until the visitor allows its category.
 * - Accept all, Reject all and Manage choices are offered with equal weight.
 * - The choice is remembered for 6 months (CONSENT_MAX_AGE_DAYS), then asked
 *   again; it can be changed at any time from "Cookie settings".
 * - Bumping CONSENT_VERSION re-asks everyone (do it when a new optional tool
 *   is added, and add the tool to app/cookie-policy/page.tsx).
 *
 * The choice itself is a strictly necessary cookie (wt_consent), so storing
 * it needs no consent.
 */

export const CONSENT_COOKIE = "wt_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 182;

export type ConsentCategory = "analytics" | "reviews";

export type ConsentState = {
  v: number;
  analytics: boolean;
  reviews: boolean;
  /** ISO date the choice was made — kept as the consent record. */
  at: string;
};

/** What each optional category does, shown in the banner's manage panel. */
export const CONSENT_CATEGORIES: {
  id: ConsentCategory;
  title: string;
  description: string;
}[] = [
  {
    id: "analytics",
    title: "Analytics",
    description:
      "Lets us count visits and see which pages people use, so we can improve the site. Only switched on if we run an analytics tool; it is never used for advertising.",
  },
  {
    id: "reviews",
    title: "Reviews widget",
    description:
      "Shows our live Trustpilot rating, loaded from Trustpilot, which may set its own cookies. Without it you see a plain link to our Trustpilot page.",
  },
];

const OPEN_EVENT = "wt:open-cookie-settings";
const CHANGE_EVENT = "wt:consent-change";

export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  try {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
      ?.slice(CONSENT_COOKIE.length + 1);
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState>;
    if (parsed.v !== CONSENT_VERSION) return null;
    return {
      v: CONSENT_VERSION,
      analytics: parsed.analytics === true,
      reviews: parsed.reviews === true,
      at: typeof parsed.at === "string" ? parsed.at : "",
    };
  } catch {
    return null;
  }
}

/** Optional cookies set by third parties on our domain, removed when the
 *  visitor withdraws consent (Google Analytics names start with _ga). */
function clearOptionalCookies(state: ConsentState) {
  if (state.analytics) return;
  const host = location.hostname.replace(/^www\./, "");
  for (const c of document.cookie.split("; ")) {
    const name = c.split("=")[0];
    if (!name.startsWith("_ga")) continue;
    for (const domain of ["", `; domain=.${host}`, `; domain=${location.hostname}`]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

export function saveConsent(choice: Pick<ConsentState, ConsentCategory>) {
  const previous = readConsent();
  const state: ConsentState = {
    v: CONSENT_VERSION,
    analytics: choice.analytics,
    reviews: choice.reviews,
    at: new Date().toISOString(),
  };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    JSON.stringify(state)
  )}; Max-Age=${CONSENT_MAX_AGE_DAYS * 86400}; path=/; SameSite=Lax${secure}`;
  clearOptionalCookies(state);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: state }));
  // A script that has already run can't be unloaded; a reload is the only
  // honest way to stop it once consent is withdrawn.
  const withdrew =
    previous && ((previous.analytics && !state.analytics) || (previous.reviews && !state.reviews));
  if (withdrew) location.reload();
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenCookieSettings(fn: () => void) {
  window.addEventListener(OPEN_EVENT, fn);
  return () => window.removeEventListener(OPEN_EVENT, fn);
}

export function onConsentChange(fn: (s: ConsentState) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<ConsentState>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}
