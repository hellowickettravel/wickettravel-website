import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LegalLayout, { LegalLink, P, Ul, type LegalSection } from "@/components/LegalLayout";
import { COMPANY, LEGAL_UPDATED } from "@/lib/legal";
import { BUSINESS, OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

const DESCRIPTION =
  "How Wicket Travel writes its pages and guides, where its facts and prices come from, how it makes money, and how it handles reviews and corrections.";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/editorial-policy" },
  robots: { index: true, follow: true },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/editorial-policy`,
    title: "Editorial Policy | Wicket Travel",
    description: DESCRIPTION,
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Editorial Policy | Wicket Travel",
    description: DESCRIPTION,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Editorial Policy", item: `${SITE_URL}/editorial-policy` },
  ],
};

const TRUSTPILOT_URL =
  BUSINESS.sameAs.find((u) => u.includes("trustpilot.com")) ??
  "https://www.trustpilot.com/review/wickettravel.com";

const sections: LegalSection[] = [
  {
    id: "who-writes",
    heading: "Who writes our content",
    content: (
      <>
        <P>
          The pages, travel information and help articles on wickettravel.com
          are written and checked by the Wicket Travel team at{" "}
          {COMPANY.legalName}. We credit the team as a whole rather than
          individual writers. Nothing on this site is paid-for advertising
          dressed up as advice.
        </P>
        <P>
          We write for travellers flying from the UK: plain English, practical
          advice and the details that change what you pay or how you travel.
        </P>
      </>
    ),
  },
  {
    id: "facts-and-sources",
    heading: "Facts and sources",
    content: (
      <>
        <P>
          Practical facts such as airports, routes, flying times, baggage,
          security and entry rules come from official sources: the airlines,
          the airports and government websites such as{" "}
          <LegalLink href="https://www.gov.uk/foreign-travel-advice" external>
            GOV.UK foreign travel advice
          </LegalLink>
          .
        </P>
        <P>
          Rules change, so always check the latest baggage allowance, entry
          requirements and fare conditions with your airline before you
          travel. When you book with us, the fare rules and allowances in your
          quote and on your e-ticket are the ones that apply.
        </P>
      </>
    ),
  },
  {
    id: "prices",
    heading: "Where our prices come from",
    content: (
      <>
        <Ul>
          <li>
            We don&apos;t run a live fare feed on this website, so we don&apos;t
            publish fares as if they were bookable right now. Fares change as
            seats sell.
          </li>
          <li>
            When you ask for a flight, a consultant checks current availability
            and quotes you a total price for your exact route, dates and
            travellers.
          </li>
          <li>
            We never make up or estimate a fare to show on a page. Where we
            have no real price, we show none.
          </li>
        </Ul>
        <P>
          The total price and the fare rules are confirmed with you before you
          pay. See our <LegalLink href="/terms">terms and conditions</LegalLink>.
        </P>
      </>
    ),
  },
  {
    id: "how-we-make-money",
    heading: "How we make money",
    content: (
      <>
        <P>
          {COMPANY.legalName} is a travel agent. We earn our income from the
          margin or service charge included in the total price we quote you,
          which you see and agree to before you pay. We don&apos;t add card
          surcharges or fees at the end.
        </P>
        <P>
          Airlines or the ticketing partners we book through may also pay us
          commission or incentives. These never add to the price we quote you.
        </P>
        <P>
          Hotels, car hire and holidays are sold by our sister company,{" "}
          <LegalLink href="https://www.wickettravelholidays.com/" external>
            Wicket Travel Holidays
          </LegalLink>
          . We say so wherever those links appear.
        </P>
      </>
    ),
  },
  {
    id: "reviews",
    heading: "Reviews and ratings",
    content: (
      <>
        <P>
          The customer reviews we show come from our public{" "}
          <LegalLink href={TRUSTPILOT_URL} external>
            Trustpilot profile
          </LegalLink>
          . We name each reviewer and show their star rating as Trustpilot
          shows them. Where a review is too long for the page we shorten it,
          but we never add words to it or change what the reviewer meant, and
          the full review is always on Trustpilot.
        </P>
        <Ul>
          <li>We never write reviews ourselves or ask anyone to write a fake one.</li>
          <li>We never pay for reviews or offer anything in return for a positive one.</li>
          <li>We never report genuine negative reviews to have them taken down.</li>
          <li>
            We only show a rating or a number of reviews that matches what
            Trustpilot shows, and link to it so you can check.
          </li>
        </Ul>
      </>
    ),
  },
  {
    id: "claims",
    heading: "Claims about us",
    content: (
      <P>
        We only say things about our business that we can prove: our company
        registration, our IATA TIDS number ({COMPANY.iataTids}) and what our
        customers say on Trustpilot. We don&apos;t display the logo of any
        scheme or body we don&apos;t belong to. We do not hold an ATOL licence,
        and we don&apos;t describe our bookings as ATOL protected.
      </P>
    ),
  },
  {
    id: "dates-and-updates",
    heading: "Dates and updates",
    content: (
      <P>
        Our legal and policy pages show the date they were last updated. We
        review our travel information when the rules it describes change, and
        update the date when we make a meaningful change to the content. Small
        fixes such as typos don&apos;t change the date.
      </P>
    ),
  },
  {
    id: "corrections",
    heading: "Corrections",
    content: (
      <P>
        Spotted a mistake or something out of date? Email{" "}
        <LegalLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</LegalLink>{" "}
        with the page and what&apos;s wrong. We&apos;ll check it and correct
        the page if it needs it.
      </P>
    ),
  },
];

export default function EditorialPolicyPage() {
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
          title="Editorial policy"
          lead="How we write our pages, where our facts and prices come from, how we make money and how we handle reviews."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Editorial policy" }]}
        />
        <LegalLayout sections={sections} lastUpdated={LEGAL_UPDATED} />
      </main>
      <Footer />
    </>
  );
}
