import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LegalLayout, { type LegalSection } from "@/components/LegalLayout";
import { LEGAL_UPDATED } from "@/lib/legal";
import { OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

/** Metadata for a legal/policy page: canonical, indexable, social cards. */
export function legalMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: { ...OG_BASE, url: `${SITE_URL}${path}`, title: `${title} | Wicket Travel`, description },
    twitter: { ...TWITTER_BASE, title: `${title} | Wicket Travel`, description },
  };
}

/** The full page: breadcrumb JSON-LD, header, hero, sections, footer. */
export default function LegalPage({
  title,
  lead,
  path,
  sections,
  intro,
  lastUpdated = LEGAL_UPDATED,
}: {
  title: string;
  lead: string;
  path: string;
  sections: LegalSection[];
  intro?: ReactNode;
  lastUpdated?: string;
}) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}${path}` },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main className="flex-1">
        <PageHero title={title} lead={lead} breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]} />
        <LegalLayout sections={sections} lastUpdated={lastUpdated} intro={intro} />
      </main>
      <Footer />
    </>
  );
}

/** Bold inline term used at the start of list items in legal copy. */
export function Term({ children }: { children: ReactNode }) {
  return <strong className="text-primary-800">{children}</strong>;
}
