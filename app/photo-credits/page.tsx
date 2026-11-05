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
 * Credited individually (CREDITED): on 5 Nov 2026 every file that had no
 * recorded source (city shots from the first import, some believed to be from
 * Wikimedia Commons; category, hotel and car photos; the airport companion
 * photo) was replaced in place, at the same path, with an Unsplash photo
 * downloaded through the Unsplash API. Each one is listed below with its
 * photographer and photo page. Nothing on the site is of unknown source.
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

type Credit = { file: string; label: string; where: string; by: string; id: string };

/** Photos replaced on 5 Nov 2026, each credited to its photographer. */
const CREDITED: Credit[] = [
  { file: "cities/birmingham.jpg", label: "Birmingham canals near Brindleyplace", where: "Homepage, Flights", by: "Lulu Black", id: "tsTQuqKr4fk" },
  { file: "cities/edinburgh.jpg", label: "Edinburgh from Calton Hill", where: "Homepage, Parent Travel Assist", by: "Connor Mollison", id: "d7_TtRp1s9s" },
  { file: "cities/cape-town.jpg", label: "Cape Town and Table Mountain from the sea", where: "Homepage", by: "Peter Burdon", id: "F1po0flco3k" },
  { file: "cities/bangalore.jpg", label: "Bengaluru skyline", where: "Homepage, Flights, Parent Travel Assist", by: "Mahadev Ittina", id: "sEDewKyq6YM" },
  { file: "cities/hyderabad.jpg", label: "Hyderabad at night", where: "Homepage, Flights, Parent Travel Assist", by: "Sai Kiran Anagani", id: "C8hVlWs0FtM" },
  { file: "cities/chennai.jpg", label: "Chennai Central station", where: "Homepage, Flights", by: "Appu Gopi", id: "iUnmvZB5SCk" },
  { file: "cities/kochi.jpg", label: "Fishing nets on the Kochi waterfront", where: "Homepage, Flights", by: "Imthiyas Iqbal", id: "L-H_TofhfNg" },
  { file: "categories/flights.jpg", label: "View from an aircraft window", where: "Homepage", by: "@felirbe", id: "uvlvl0XqQl0" },
  { file: "categories/hotels.jpg", label: "Hotel room", where: "Homepage", by: "Linus Mimietz", id: "p3UWyaujtQo" },
  { file: "categories/packages.jpg", label: "Tropical beach with palm trees", where: "Homepage", by: "Simon Spring", id: "3ws2fq3VtXk" },
  { file: "categories/car-rentals.jpg", label: "Car on a road at sunset", where: "Homepage", by: "Tobias Weinhold", id: "lkNl4Vbqo6g" },
  { file: "hotels/hero-resort-pool.jpg", label: "Hotel swimming pool", where: "Hotels", by: "Zoshua Colah", id: "MtJ4lulTNj8" },
  { file: "hotels/city-hotel-room.jpg", label: "Hotel bedroom", where: "Hotels", by: "Vojtech Bruzek", id: "Yrxr3bsPdS0" },
  { file: "hotels/boutique-suite.jpg", label: "Hotel bedroom with a garden view", where: "Homepage", by: "visualsofdana", id: "T5pL6ciEn-I" },
  { file: "hotels/maldives-overwater.jpg", label: "Overwater villas in the Maldives", where: "Homepage, Hotels", by: "Mike Swigunski", id: "k9Zeq6EH_bk" },
  { file: "hotels/lagoon-cabanas.jpg", label: "Boardwalk across a lagoon in the Maldives", where: "Homepage", by: "Shai Pal", id: "05p3EF6tNzs" },
  { file: "hotels/santorini-suites.jpg", label: "Whitewashed buildings in Santorini", where: "Homepage, Hotels", by: "The Paris Photographer", id: "_auSXpaC914" },
  { file: "hotels/clifftop-pool.jpg", label: "Clifftop infinity pool at dusk", where: "Homepage, Hotels", by: "Wojciech Wyszkowski", id: "i9W7YYotEGw" },
  { file: "hotels/hillside-retreat.jpg", label: "Buildings on a misty hillside", where: "Hotels", by: "Ayyappan Mk", id: "BmdwlvK1jgw" },
  { file: "hotels/tropical-villas.jpg", label: "Resort pool with sun loungers", where: "Homepage, Hotels", by: "Zoshua Colah", id: "U7riPss-YD0" },
  { file: "cars/hero-coast-road.jpg", label: "Car parked by the Pacific coast", where: "Car Rentals", by: "Darpan", id: "rR6fP_rCu5w" },
  { file: "cars/economy-hatchback.jpg", label: "Red hatchback", where: "Car Rentals", by: "Zoshua Colah", id: "M05m-vSJk2g" },
  { file: "cars/suv.jpg", label: "White SUV on a gravel track", where: "Car Rentals", by: "Erik Mclean", id: "Qgxd4EuB5oE" },
  { file: "cars/luxury-sedan.jpg", label: "Black luxury saloon", where: "Car Rentals", by: "Talia", id: "PKdQIG4goQc" },
  { file: "cars/people-carrier.jpg", label: "People carrier", where: "Car Rentals", by: "Roger Starnes Sr", id: "RRazTfRrBZM" },
  { file: "support/airport-companion.jpg", label: "Two travellers walking through an airport", where: "Parent Travel Assist", by: "Cameron Cox", id: "KbeiZcW5byM" },
];

function CreditList() {
  return (
    <Ul>
      {CREDITED.map((c) => (
        <li key={c.file}>
          {c.label}: photo by{" "}
          <LegalLink href={`https://unsplash.com/photos/${c.id}`} external>
            {c.by} on Unsplash
          </LegalLink>{" "}
          <span className="text-text-secondary">· used on {c.where}</span>
        </li>
      ))}
    </Ul>
  );
}

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
    id: "credited-photos",
    heading: "Photos credited to their photographers",
    content: (
      <>
        <P>
          These photos are also from Unsplash, under the{" "}
          <LegalLink href="https://unsplash.com/license" external>
            Unsplash License
          </LegalLink>
          , and we credit each photographer by name:
        </P>
        <CreditList />
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
