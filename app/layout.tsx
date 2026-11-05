import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import { SITE_URL, BUSINESS } from "@/lib/seo";
import { I18nProvider } from "@/lib/i18n";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";

/* Brand Foundations v1.0 sets three typeface roles. All are self-hosted by
   next/font (no render-blocking Google request); `swap` paints immediately in
   the fallback and the matched fallback metrics keep the swap from shifting
   layout (near-zero CLS).

   Manrope and Newsreader are variable fonts, so no `weight` is needed — the
   whole axis ships in one file. IBM Plex Mono is not variable, so its single
   in-use weight is declared explicitly to keep the payload small. */

// Primary — UI & headings. Weights in use: 400 Regular / 700 Bold / 800 ExtraBold.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  // next/font requires literal values here — it reads these at build time.
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Helvetica Neue",
    "sans-serif",
  ],
});

// Secondary — editorial only: destination stories and long-form, never on
// booking flows. Not preloaded; no above-the-fold surface uses it today, so
// preloading would cost a request on every page for a font most never show.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// Utility — booking references, fare codes, PNRs. Static family, 400 only.
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cheap Flights UK | Best Airline Ticket Deals — Wicket Travel",
    template: "%s | Wicket Travel",
  },
  description:
    "Book cheap flights from the UK with Wicket Travel. Best airline ticket deals to India, Dubai and worldwide from Heathrow, Manchester and more. No hidden fees.",
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.legalName }],
  creator: BUSINESS.legalName,
  publisher: BUSINESS.legalName,
  keywords: [
    "cheap flights UK",
    "best airline ticket deals UK",
    "flights to India from UK",
    "flights to Delhi from UK",
    "flights to Mumbai from UK",
    "flights to Dubai from UK",
    "cheap flights from Heathrow",
    "cheap flights from Manchester",
    "book airline tickets UK",
    "trusted airline tickets",
    "Wicket Travel",
  ],
  category: "travel",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BUSINESS.name,
    title: "Cheap Flights UK | Best Airline Ticket Deals — Wicket Travel",
    description:
      "Book cheap flights from the UK with Wicket Travel. Best airline ticket deals to India, Dubai & worldwide from Heathrow, Manchester, Birmingham & more — no hidden fees.",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    site: "@WicketTravel",
    creator: "@WicketTravel",
    title: "Cheap Flights UK | Best Airline Ticket Deals — Wicket Travel",
    description:
      "Book cheap flights from the UK — best airline ticket deals to India, Dubai & worldwide. Trusted airlines, no hidden booking fees.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${manrope.variable} ${newsreader.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        {/* Warm up the one origin the browser still fetches directly: the
            avs.io airline logos, which appear just below the hero. Every photo
            on the site is local and goes through /_next/image, so it needs no
            hint. The old cdn.simpleicons.org dns-prefetch was removed — the
            brand marks are inline SVG in components/SocialIcons.tsx now, so
            that origin is never contacted and the hint only cost a DNS lookup. */}
        <link
          rel="preconnect"
          href="https://pics.avs.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://pics.avs.io" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <I18nProvider>
          {children}
          <BackToTop />
          <WhatsAppButton />
          <CookieConsent />
        </I18nProvider>
      </body>
    </html>
  );
}
