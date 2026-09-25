import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ParentsBoard from "@/components/ParentsBoard";
import { OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

/**
 * Full list of everyone currently offering to help — the mirror of
 * /parents-tickets/requests, reading the live feed. Same board component,
 * locked to the other side. (The main /parents-tickets page now shows its own
 * sample board — see lib/travelAssist.ts — and no longer links here.)
 */
export const metadata: Metadata = {
  title: "Travellers Offering to Help",
  description:
    "Every open Parents Travel Assist offer right now — travellers already booked on a route who are happy to keep an elderly passenger company.",
  alternates: { canonical: "/parents-tickets/offers" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/parents-tickets/offers`,
    title: "Travellers Offering to Help | Parents Travel Assist",
    description:
      "Every open offer right now, shortened for privacy — recognise a family who needs your route?",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Travellers Offering to Help | Parents Travel Assist",
    description:
      "Every open offer right now, shortened for privacy — recognise a family who needs your route?",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/parents-tickets/offers#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Parents Travel Assist",
          item: `${SITE_URL}/parents-tickets`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Offers",
          item: `${SITE_URL}/parents-tickets/offers`,
        },
      ],
    },
  ],
};

export default function AssistFamilyOffersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main className="flex-1">
        <PageHero
          title="Travellers offering to help"
          lead="Every open offer right now. Contact details are never published — ask us for the introduction."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Parents Travel Assist", href: "/parents-tickets" },
            { label: "Offers" },
          ]}
        />
        <section className="section bg-neutral-000">
          <div className="container-page">
            <ParentsBoard lockFilter="traveller" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
