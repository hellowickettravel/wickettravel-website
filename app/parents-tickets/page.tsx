import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AssistHero from "@/components/travel-assist/AssistHero";
import AssistExperience from "@/components/travel-assist/AssistExperience";
import AssistJourney from "@/components/travel-assist/AssistJourney";
import AssistTrust from "@/components/travel-assist/AssistTrust";
import AssistClosing from "@/components/travel-assist/AssistClosing";
import {
  AREA_SERVED_UK,
  BUSINESS,
  OG_BASE,
  ORGANIZATION_ID,
  SITE_URL,
  TWITTER_BASE,
} from "@/lib/seo";

/**
 * /parents-tickets — Parents Travel Assist.
 *
 * Its own page with its own identity, not a variant of the flight pages:
 *
 *   hero (Delhi T3 photo + match visual)  →  date-first search bar  →
 *   "who's flying when" day strip  →  two-sided photo board  →  how it works
 *   (photo steps) + the "book their tickets with us" hook  →  trust (checks +
 *   real Trustpilot reviews)  →  closing call to action
 *
 * The board shows sample listings for now (lib/travelAssist.ts explains how
 * to switch it to the live /api/parent-ticket/public feed). The one real
 * intake is the existing enquiry form, opened in a dialog from any "post"
 * button and pre-filled with the route the visitor picked.
 *
 * The URL stays /parents-tickets although the service is now called Parents
 * Travel Assist: it has indexing history, sits in the JSON-LD @id chain and
 * llms.txt, and the sub-pages (/requests, /offers, /listing/…) hang off it.
 * Renaming the path would need a 301 for no gain to the visitor.
 */

const TITLE = "Parents Travel Assist";
const DESCRIPTION =
  "Parents flying from India to the UK? We pair them with a verified traveller on the same flight — checked by our team, from check-in to arrivals.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/parents-tickets" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/parents-tickets`,
    title: `${TITLE} | Companions for Parents Flying India to UK`,
    description: DESCRIPTION,
  },
  twitter: {
    ...TWITTER_BASE,
    title: `${TITLE} | Companions for Parents Flying India to UK`,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/parents-tickets#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: TITLE,
          item: `${SITE_URL}/parents-tickets`,
        },
      ],
    },
    {
      /* The matching service Wicket Travel runs. No `offers` node: there is
         no Wicket Travel price for the introduction to publish. */
      "@type": "Service",
      "@id": `${SITE_URL}/parents-tickets#service`,
      name: `${TITLE} — travel companions for parents`,
      serviceType: "Travel companion matching service",
      url: `${SITE_URL}/parents-tickets`,
      description:
        "Wicket Travel pairs parents flying from India to the UK with a traveller booked on the same flight. Our team checks both sides — passport, booking and phone — and makes every introduction; contact details are never published.",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: AREA_SERVED_UK,
      audience: {
        "@type": "Audience",
        audienceType:
          "Families whose parents fly from India to the UK, and travellers willing to accompany them",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${SITE_URL}/parents-tickets`,
        servicePhone: {
          "@type": "ContactPoint",
          telephone: BUSINESS.phone,
          contactType: "customer service",
          areaServed: "GB",
          availableLanguage: ["English", "Hindi", "Urdu", "Arabic"],
        },
      },
    },
  ],
};

export default function ParentsTravelAssistPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header transparent />
      <main className="flex-1">
        <AssistHero />
        <AssistExperience />
        <AssistJourney />
        <AssistTrust />
        <AssistClosing />
      </main>
      <Footer />
    </>
  );
}
