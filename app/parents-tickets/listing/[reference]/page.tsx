import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ListingDetail from "@/components/ListingDetail";

/**
 * One listing's own page — reached by tapping any card on the main
 * either full list page
 * (components/ParentsBoard.tsx). There
 * is no per-listing API, so the actual lookup happens client-side in
 * ListingDetail against the same public feed every other surface reads; this
 * server file only supplies the shell, metadata and breadcrumb.
 *
 * noindex: these are thin, ephemeral pages tied to one row of a live feed
 * that can vanish the moment it's matched — nothing worth sending search
 * traffic to directly. `follow` stays on so link equity still flows through
 * to the two evergreen, indexable list pages linked from here.
 */
export const metadata: Metadata = {
  title: "Listing | Parents Travel Assist",
  description:
    "One open Parents Travel Assist request or offer, in full — every introduction still made through Wicket Travel, never a direct contact detail.",
  robots: { index: false, follow: true },
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const decoded = decodeURIComponent(reference);

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          title="Listing detail"
          lead="Contact details are never published — ask us for the introduction."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Parents Travel Assist", href: "/parents-tickets" },
            { label: decoded },
          ]}
        />
        <section className="section bg-neutral-000">
          <div className="container-page">
            <ListingDetail reference={decoded} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
