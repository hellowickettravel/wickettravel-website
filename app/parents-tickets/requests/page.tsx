import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import AssistFamilyBoard from "@/components/AssistFamilyBoard";
import { OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

/**
 * Full list of everyone currently asking for a companion — reached from the
 * "See every request" link under the families column on the main
 * /parents-tickets board. Same feed and the same component
 * (components/AssistFamilyBoard.tsx), pinned to one side so the page is its
 * own filter, with its own crawlable URL. Search, the date/airport/language
 * filters and the sort all still work here; only the two-column split and the
 * departures rail are dropped, since a single-sided page has nothing to face
 * and the rail belongs to the board proper.
 */
export const metadata: Metadata = {
  title: "Families Asking for a Companion",
  description:
    "Every open Assist Family request right now — families whose elderly relative is flying alone and would like a trusted companion for the journey.",
  alternates: { canonical: "/parents-tickets/requests" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/parents-tickets/requests`,
    title: "Families Asking for a Companion | Assist Family",
    description:
      "Every open request right now, shortened for privacy — recognise a route you're flying?",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Families Asking for a Companion | Assist Family",
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
          name: "Assist Family",
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
            { label: "Assist Family", href: "/parents-tickets" },
            { label: "Requests" },
          ]}
        />
        <section className="section bg-neutral-000">
          <div className="container-page">
            <AssistFamilyBoard lockSide="requester" showRail={false} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
