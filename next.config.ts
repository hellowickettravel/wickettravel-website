import type { NextConfig } from "next";

/**
 * Response headers applied to every path.
 *
 * Scope note: this is deliberately the set that cannot break a working page.
 * A full Content-Security-Policy is NOT here, and that is a decision rather
 * than an oversight — Next inlines its RSC payload as `<script>` and the
 * JSON-LD blocks are inline too, so a real `script-src` needs per-request
 * nonces threaded through `proxy.ts`. Shipping `'unsafe-inline'` instead
 * would be a CSP that reads as protection while providing almost none.
 * The directives below are the ones that need no nonce and no inventory of
 * every asset origin.
 */
const SECURITY_HEADERS = [
  // Stop the browser second-guessing a declared Content-Type. The relays
  // return JSON; without this, a response a browser decides looks like HTML
  // can be treated as HTML.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the full URL within our own origin, only the origin cross-site, and
  // nothing at all when downgrading to http.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on this site needs any of these, and a permissions prompt a
  // visitor didn't expect is its own kind of trust damage.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // The subset of CSP that is safe without nonces:
  //   frame-ancestors  — no clickjacking (supersedes X-Frame-Options)
  //   base-uri         — an injected <base> can't repoint every relative URL
  //   form-action      — a form can only post back to us; every real form
  //                      here submits over fetch, so nothing legitimate uses
  //                      a cross-origin action
  //   object-src       — no plugin content, ever
  {
    key: "Content-Security-Policy",
    value: [
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (smallest, best for LCP + mobile), then WebP, then the
    // browser falls back to the original format. Applies to every next/image —
    // hero, hotel/city cards, resort collage — with no visual change.
    formats: ["image/avif", "image/webp"],
    // No remotePatterns: every next/image on the site now serves from /public.
    // The last hotlinked source (an images.unsplash.com photo on /about) has
    // been replaced with a local file — see public/about/family-together.jpg
    // — so an external allowlist entry here would be unused surface area.
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // The relays answer JSON to this site's own pages and nobody else.
        // No CORS headers are sent, so a cross-origin read is already blocked;
        // this stops a shared cache holding a lead response as well.
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
