import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import AssistFamilyBoard from "@/components/AssistFamilyBoard";
import { OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

/**
 * Full list of everyone currently offering to help — the mirror of
 * /parents-tickets/requests, reached from the "See every offer" link under
 * the travellers column on the main /parents-tickets board. Same component
 * (components/AssistFamilyBoard.tsx), pinned to the other side.
 */
export const metadata: Metadata = {
  title: "Travellers Offering to Help",
  description:
    "Every open Assist Family offer right now — travellers already booked on a route who are happy to keep an elderly passenger company.",
  alternates: { canonical: "/parents-tickets/offers" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/parents-tickets/offers`,
    title: "Travellers Offering to Help | Assist Family",
    description:
      "Every open offer right now, shortened for privacy — recognise a family who needs your route?",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Travellers Offering to Help | Assist Family",
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
          name: "Assist Family",
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
            { label: "Assist Family", href: "/parents-tickets" },
            { label: "Offers" },
          ]}
        />
        <section className="section bg-neutral-000">
          <div className="container-page">
            <AssistFamilyBoard lockSide="traveller" showRail={false} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
