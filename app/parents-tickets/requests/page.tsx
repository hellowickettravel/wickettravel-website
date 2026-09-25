import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ParentsBoard from "@/components/ParentsBoard";
import { OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

/**
 * Full list of everyone currently asking for a companion, from the live feed.
 * (The main /parents-tickets page now shows its own sample board — see
 * lib/travelAssist.ts — and no longer links here.) Same component
 * (components/ParentsBoard.tsx) the main page used to show inline, just
 * locked to one side and given its own crawlable URL.
 */
export const metadata: Metadata = {
  title: "Families Asking for a Companion",
  description:
    "Every open Parents Travel Assist request right now — families whose elderly relative is flying alone and would like a trusted companion for the journey.",
  alternates: { canonical: "/parents-tickets/requests" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/parents-tickets/requests`,
    title: "Families Asking for a Companion | Parents Travel Assist",
    description:
      "Every open request right now, shortened for privacy — recognise a route you're flying?",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Families Asking for a Companion | Parents Travel Assist",
    description:
      "Every open request right now, shortened for privacy — recognise a route you're flying?",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/parents-tickets/requests#breadcrumb`,
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
          name: "Requests",
          item: `${SITE_URL}/parents-tickets/requests`,
        },
      ],
    },
  ],
};

export default function AssistFamilyRequestsPage() {
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
          title="Families asking for a companion"
          lead="Every open request right now. Contact details are never published — ask us for the introduction."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Parents Travel Assist", href: "/parents-tickets" },
            { label: "Requests" },
          ]}
        />
        <section className="section bg-neutral-000">
          <div className="container-page">
            <ParentsBoard lockFilter="requester" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
