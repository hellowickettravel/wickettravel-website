import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ListingDetail from "@/components/ListingDetail";
import { OG_BASE, TWITTER_BASE } from "@/lib/seo";
import {
  formatShareDate,
  NO_REFERENCE_SEGMENT,
  readSharedDetails,
  type SharedDetails,
} from "@/lib/parentsShare";

/**
 * One listing's own page — reached from "Ask for an introduction" on any
 * board card, on the main /parents-tickets page or either full list page
 * (components/AssistFamilyApp.tsx), and from links families share into
 * WhatsApp after posting (lib/parentsShare.ts). There is no per-listing API,
 * so the actual lookup happens client-side in ListingDetail against the same
 * public feed every other surface reads; this server file supplies the
 * shell, metadata and breadcrumb.
 *
 * A shared link carries the flight's route, date and airline in its query
 * string, so this page can show them before a coordinator has approved the
 * post onto the board, and so the WhatsApp link preview names the flight
 * instead of a generic "Listing".
 *
 * noindex: these are thin, ephemeral pages tied to one row of a live feed
 * that can vanish the moment it's matched — nothing worth sending search
 * traffic to directly. `follow` stays on so link equity still flows through
 * to the two evergreen, indexable list pages linked from here.
 */

type Props = {
  params: Promise<{ reference: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toSearchParams(
  raw: Record<string, string | string[] | undefined>
): URLSearchParams {
  const out = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (typeof first === "string") out.set(key, first);
  }
  return out;
}

function shareCopy(shared: SharedDetails | undefined) {
  if (!shared) {
    return {
      title: "Listing | Parent Travel Assist",
      description:
        "One open Parent Travel Assist request or offer, in full — every introduction still made through Wicket Travel, never a direct contact detail.",
    };
  }
  const when = formatShareDate(shared.date);
  const flight = `${shared.from} → ${shared.to}${when ? `, ${when}` : ""}`;
  return shared.type === "traveller"
    ? {
        title: `Travelling ${flight} and happy to help | Parent Travel Assist`,
        description:
          "A traveller on this flight is offering to keep an elderly passenger company. Ask Wicket Travel for an introduction.",
      }
    : {
        title: `Help needed: ${flight} | Parent Travel Assist`,
        description:
          "A family is looking for someone on this flight to keep their elderly relative company. Are you travelling? Offer your help through Wicket Travel.",
      };
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const shared = readSharedDetails(toSearchParams(await searchParams));
  const { title, description } = shareCopy(shared);
  return {
    // `absolute` so the layout's "| Wicket Travel" template doesn't push the
    // route out of view in a WhatsApp preview.
    title: { absolute: title },
    description,
    robots: { index: false, follow: true },
    openGraph: { ...OG_BASE, title, description },
    twitter: { ...TWITTER_BASE, title, description },
  };
}

export default async function ListingDetailPage({ params, searchParams }: Props) {
  const { reference } = await params;
  const decoded = decodeURIComponent(reference);
  const shared = readSharedDetails(toSearchParams(await searchParams));
  const hasReference = decoded !== NO_REFERENCE_SEGMENT;

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          title={
            shared
              ? shared.type === "traveller"
                ? "Offering to help"
                : "A family needs a travel companion"
              : "Listing detail"
          }
          lead="Contact details are never published — ask us for the introduction."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Parent Travel Assist", href: "/parents-tickets" },
            { label: hasReference ? decoded : "Shared request" },
          ]}
        />
        <section className="section bg-neutral-000">
          <div className="container-page">
            <ListingDetail
              reference={hasReference ? decoded : undefined}
              shared={shared}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
