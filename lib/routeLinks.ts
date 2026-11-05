/**
 * Small, client-safe link helpers for the route pages. Kept apart from
 * lib/routes.ts so homepage client components don't ship every route page's
 * copy in their bundle just to build a link.
 *
 * DEST_ROUTE_SLUG must name only slugs that exist in lib/routes.ts
 * (lib/routes.ts checks this at build time).
 */

/** Destination airport code → the route page for it (London departures). */
export const DEST_ROUTE_SLUG: Record<string, string> = {
  DEL: "london-to-delhi",
  BOM: "london-to-mumbai",
  BLR: "london-to-bengaluru",
  HYD: "london-to-hyderabad",
  MAA: "london-to-chennai",
  COK: "london-to-kochi",
  DXB: "london-to-dubai",
  AUH: "london-to-abu-dhabi",
};

/** Booking-portal request with the route pre-filled: the same hand-off the
 *  homepage search widget makes (components/FlightSearch.tsx). */
export function portalRouteUrl(
  base: string,
  params: { from?: string; to?: string }
): string {
  const q = new URLSearchParams();
  if (params.from) q.set("from", params.from);
  if (params.to) q.set("to", params.to);
  const s = q.toString();
  return s ? `${base}?${s}` : base;
}
