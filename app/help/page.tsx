import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import HelpCentre from "@/components/HelpCentre";
import { HELP_TOPICS, helpAnswerText } from "@/lib/help";
import { OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

const DESCRIPTION =
  "Answers about booking flights with Wicket Travel: prices and payment, e-tickets, changes, cancellations and refunds, baggage, our Dubai visa service and Parent Travel Assist.";

export const metadata: Metadata = {
  title: "Help Centre",
  description: DESCRIPTION,
  alternates: { canonical: "/help" },
  robots: { index: true, follow: true },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/help`,
    title: "Help Centre | Wicket Travel",
    description: DESCRIPTION,
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Help Centre | Wicket Travel",
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Help Centre", item: `${SITE_URL}/help` },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/help#faq`,
      url: `${SITE_URL}/help`,
      mainEntity: HELP_TOPICS.flatMap((t) =>
        t.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: helpAnswerText(item.answer) },
        }))
      ),
    },
  ],
};

export default function HelpPage() {
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
          title="How can we help?"
          lead="Quick answers about booking with us, your ticket, changes and refunds, and our visa and Parent Travel Assist services."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Help Centre" }]}
        />
        <HelpCentre />
      </main>
      <Footer />
    </>
  );
}
