import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LegalLayout, { LegalLink, P, Ul, type LegalSection } from "@/components/LegalLayout";
import { COMPANY, LEGAL_UPDATED } from "@/lib/legal";
import { OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

const DESCRIPTION =
  "Where the photos, logos and other images on wickettravel.com come from, and the licences we use them under.";

export const metadata: Metadata = {
  title: "Photo Credits",
  description: DESCRIPTION,
  alternates: { canonical: "/photo-credits" },
  robots: { index: true, follow: true },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/photo-credits`,
    title: "Photo Credits | Wicket Travel",
    description: DESCRIPTION,
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Photo Credits | Wicket Travel",
    description: DESCRIPTION,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Photo Credits", item: `${SITE_URL}/photo-credits` },
  ],
};

/*
 * IMAGE INVENTORY — how each group's source was established (5 Nov 2026):
 *
 * Unsplash: commit 8cb7ad7 ("self-hosted 40+ hotlinked images") replaced
 * hotlinks to 36 distinct images.unsplash.com photos with local copies. The
 * UNSPLASH list is only the files that commit put in place of one of those
 * hotlinks (the photo IDs are in its diff). Individual photographers were not
 * recorded, so they are credited at group level; the Unsplash License does
 * not require attribution.
 *
 * To be confirmed (UNCONFIRMED): files with no recorded source. Some arrived
 * in the first import (560a7b8); a comment in components/BestFaresByCity.tsx
 * says city shots without an Unsplash match came from Wikimedia Commons,
 * which usually requires attribution under a Creative Commons licence. The
 * rest were added or "re-sourced" in 8cb7ad7 for new pages without a
 * replaced hotlink (category photos, cars, three hotel shots, Cape Town, the
 * airport companion). They are listed with a takedown route. Replace them,
 * or move them to the right group with the author's name, once confirmed.
 */
type Group = { files: { label: string; where: string }[] };

const UNSPLASH: Group = {
  files: [
    { label: "Aircraft wing through a cabin window", where: "Homepage and Flights hero" },
    { label: "Above the clouds", where: "About" },
    { label: "Airline aircraft photos (Air India, British Airways, Emirates, Etihad, Gulf Air, Lufthansa, Qatar Airways, Virgin Atlantic)", where: "Homepage airline fares" },
    { label: "City and airport photos (Abu Dhabi, Ajman, Bangkok, Chicago, Delhi, Dubai, Fujairah, Gatwick, Heathrow, Hong Kong, Kuala Lumpur, Los Angeles, Luton, Manchester, Miami, Mumbai, New York, Ras Al Khaimah, San Francisco, Seoul, Sharjah, Singapore, Tokyo, Washington DC)", where: "Homepage, Flights, Hotels, Visa, Parent Travel Assist" },
    { label: "Support agent on a call", where: "Homepage" },
  ],
};

const UNCONFIRMED: Group = {
  files: [
    { label: "City photos: Bangalore, Birmingham, Cape Town, Chennai, Edinburgh, Hyderabad, Kochi", where: "Homepage, Flights, Parent Travel Assist" },
    { label: "Category photos: flights, hotels, car rentals, packages", where: "Homepage" },
    { label: "Hotel photos: boutique suite, city hotel room, clifftop pool, hillside retreat, lagoon cabanas, Maldives overwater villas, resort pool, Santorini suites, tropical villas", where: "Homepage, Hotels" },
    { label: "Car hire photos: coast road, economy hatchback, luxury saloon, people carrier, SUV", where: "Car Rentals" },
    { label: "Airport companion photo", where: "Parent Travel Assist" },
  ],
};

function FileList({ group }: { group: Group }) {
  return (
    <Ul>
      {group.files.map((f) => (
        <li key={f.label}>
          {f.label} <span className="text-text-secondary">· used on {f.where}</span>
        </li>
      ))}
    </Ul>
  );
}

const sections: LegalSection[] = [
  {
    id: "overview",
    heading: "About our images",
    content: (
      <>
        <P>
          This page lists where the photos, logos and other images on
          wickettravel.com come from and the licences we use them under. All
          images are served from our own website; we don&apos;t load photos
          from other servers.
        </P>
        <P>
          Photos of places, aircraft, hotels and cars are illustrations. They
          don&apos;t show a specific flight, hotel or vehicle you will get, and
          a photo of an airline&apos;s aircraft doesn&apos;t mean that airline
          endorses us.
        </P>
      </>
    ),
  },
  {
    id: "unsplash",
    heading: "Photos from Unsplash",
    content: (
      <>
        <P>
          These photos are from Unsplash and used under the{" "}
          <LegalLink href="https://unsplash.com/license" external>
            Unsplash License
          </LegalLink>
          , which allows free commercial use without attribution. We thank the
          Unsplash photographers whose work appears here; we didn&apos;t record
          each photographer&apos;s name when the photos were added, so we
          credit them as a group.
        </P>
        <FileList group={UNSPLASH} />
      </>
    ),
  },
  {
    id: "being-confirmed",
    heading: "Photos whose source we're confirming",
    content: (
      <>
        <P>
          We&apos;re confirming the original source and photographer of these
          images so we can credit them properly. Some city photos may come
          from Wikimedia Commons, where each image has its own licence and
          author.
        </P>
        <FileList group={UNCONFIRMED} />
        <P>
          If you took one of these photos, or own the rights to it, and
          haven&apos;t licensed it to us, please email{" "}
          <LegalLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</LegalLink>{" "}
          with a link to the image. We&apos;ll credit you or remove it
          straight away.
        </P>
      </>
    ),
  },
  {
    id: "airline-logos",
    heading: "Airline logos",
    content: (
      <P>
        Airline logos on our homepage are loaded from{" "}
        <LegalLink href="https://pics.avs.io" external>
          pics.avs.io
        </LegalLink>
        , a logo service that supplies airline marks by their IATA code. The
        logos are trademarks of their airlines and are used only to identify
        the airlines whose flights we book. Their use doesn&apos;t mean an
        airline endorses or partners with {COMPANY.legalName}. Like any image
        on the web, that service receives your IP address and browser details
        when your browser fetches a logo; it doesn&apos;t set cookies on our
        site.
      </P>
    ),
  },
  {
    id: "accreditation-logos",
    heading: "Registration and review logos",
    content: (
      <>
        <P>
          The IATA and Trustpilot logos in our footer were supplied by our own
          team and are trademarks of their owners. We show each one only for
          what it says next to it:
        </P>
        <Ul>
          <li>
            IATA: our IATA TIDS registration ({COMPANY.iataTids}). This is a
            travel agent identification code, not IATA accreditation.
          </li>
          <li>Trustpilot: a link to our public review profile.</li>
          <li>
            ABTA: we only show ABTA&apos;s logo with a membership number, as a
            member. It doesn&apos;t appear while we have none on record.
          </li>
        </Ul>
        <P>We don&apos;t display the ATOL logo: we don&apos;t hold an ATOL licence.</P>
      </>
    ),
  },
  {
    id: "our-brand",
    heading: "Our own brand",
    content: (
      <P>
        The Wicket Travel name and logo belong to {COMPANY.legalName}. The
        Wicket Travel Holidays logo belongs to our sister company. Icons on the site are from the open-source
        Lucide icon set (ISC licence); the WhatsApp and social media marks
        belong to their owners and are used only to link to those services.
      </P>
    ),
  },
  {
    id: "contact",
    heading: "Questions or corrections",
    content: (
      <P>
        If an image is wrongly credited, or you&apos;d like one removed,
        email <LegalLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</LegalLink>.
      </P>
    ),
  },
];

export default function PhotoCreditsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main className="flex-1">
        <PageHero
          title="Photo credits"
          lead="Where the photos and logos on our site come from, and the licences we use them under."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Photo credits" }]}
        />
        <LegalLayout sections={sections} lastUpdated={LEGAL_UPDATED} />
      </main>
      <Footer />
    </>
  );
}
