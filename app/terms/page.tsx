import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LegalLayout, { LegalLink, P, Placeholder, Ul, type LegalSection } from "@/components/LegalLayout";
import { BUSINESS, OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you use Wicket Travel Limited to search, enquire about or book airline tickets from the UK.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/terms`,
    title: "Terms of Service | Wicket Travel",
    description:
      "The terms that apply when you use Wicket Travel Limited to book airline tickets from the UK.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Terms of Service | Wicket Travel",
    description:
      "The terms that apply when you use Wicket Travel Limited to book airline tickets from the UK.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${SITE_URL}/terms` },
  ],
};

const LAST_UPDATED = "28 July 2026";

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "1. Who we are",
    content: (
      <P>
        These terms govern your use of wickettravel.com and any booking or
        enquiry service provided by {BUSINESS.legalName} (company
        registration {BUSINESS.registration}), registered in the UK at{" "}
        {BUSINESS.streetAddress}, {BUSINESS.addressLocality}, {BUSINESS.addressRegion},{" "}
        {BUSINESS.postalCode} (&ldquo;Wicket Travel&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;). By using our site or asking us to arrange a
        booking, you agree to these terms.
      </P>
    ),
  },
  {
    id: "acceptance",
    heading: "2. Acceptance of these terms",
    content: (
      <P>
        By browsing our site, submitting an enquiry, or confirming a booking
        with us, you confirm that you accept these terms and our{" "}
        <LegalLink href="/privacy">Privacy Policy</LegalLink>. If you do not
        agree with any part of these terms, please do not use our services —
        contact us first if you have questions.
      </P>
    ),
  },
  {
    id: "our-service",
    heading: "3. Our service",
    content: (
      <>
        <P>
          Wicket Travel is a UK-based flight ticket booking service. We act as
          an intermediary: we compare fares across airlines, help you find
          the best available price for your route, and take your booking
          through to confirmation with the airline or via our booking portal.
        </P>
        <P>
          Flights are our sole focus. Hotels, car rentals and holiday
          packages shown or referenced on our site are provided by our sister
          brand,{" "}
          <LegalLink href="https://www.wickettravelholidays.com/" external>
            Wicket Travel Holidays
          </LegalLink>
          , a separate business with its own terms of service — any booking
          you make there is governed by that site&apos;s terms, not these
          ones.
        </P>
      </>
    ),
  },
  {
    id: "booking-terms",
    heading: "4. Booking process",
    content: (
      <>
        <P>
          When you ask us to book a flight, we search live availability and
          fares and present you with options. A booking is only confirmed
          once payment has been taken and you receive a confirmation with a
          booking reference / PNR from us or the airline. Until then, no
          fare, seat or price is guaranteed.
        </P>
        <P>
          Some enquiries (for example, our Dubai visa or Parents Travel Assist
          forms) are handled as assisted, human-reviewed requests rather than
          instant bookings — our team will contact you to complete the
          process.
        </P>
      </>
    ),
  },
  {
    id: "pricing-and-payment",
    heading: "5. Pricing, fees & payment",
    content: (
      <>
        <P>
          Fares are set by airlines and can change until a booking is
          confirmed and paid for. We aim to show the best available fare at
          the time you search. Any service or administration fee we charge
          will always be shown to you clearly before you pay — we do not add
          hidden charges at checkout.
        </P>
        <P>
          Where a specific service fee applies (for example, to a visa
          application or an amendment), the amount is{" "}
          <Placeholder>to be confirmed by Wicket Travel Limited</Placeholder>{" "}
          and will be disclosed before you agree to it. Payment is processed
          securely by our payment provider or booking portal; we do not store
          full card details.
        </P>
      </>
    ),
  },
  {
    id: "your-responsibilities",
    heading: "6. Your responsibilities",
    content: (
      <>
        <P>When booking through us, you&apos;re responsible for:</P>
        <Ul>
          <li>Giving us accurate passenger names exactly as they appear on the travel document being used.</li>
          <li>Ensuring passports, visas and any other travel documents are valid for your entire trip.</li>
          <li>Checking and complying with the destination country&apos;s entry, visa and health requirements.</li>
          <li>Arriving at the airport in good time and checking in as required by the airline.</li>
          <li>Reviewing your booking confirmation and telling us immediately if anything looks wrong.</li>
        </Ul>
        <P>
          We are not liable for losses arising from incorrect information you
          provide, or from failing to meet a destination&apos;s entry
          requirements.
        </P>
      </>
    ),
  },
  {
    id: "changes-and-cancellations",
    heading: "7. Changes & cancellations by airlines",
    content: (
      <P>
        Airlines, not Wicket Travel, set fare rules, schedules and
        cancellation terms. If an airline changes or cancels a flight, we
        will do our best to notify you promptly and help you exercise your
        options with that airline (rebooking, credit or refund, as the
        airline&apos;s policy allows). See our{" "}
        <LegalLink href="/refunds">Refund Policy</LegalLink> for how refunds
        work.
      </P>
    ),
  },
  {
    id: "liability",
    heading: "8. Our liability",
    content: (
      <>
        <P>
          We take reasonable care in comparing fares and processing bookings,
          but as an intermediary we do not control airline schedules, fare
          rules or in-flight service. To the fullest extent permitted by law,
          we are not liable for losses caused by an airline&apos;s acts or
          omissions, delays, cancellations, or events outside our reasonable
          control.
        </P>
        <P>
          Nothing in these terms limits or excludes our liability where it
          would be unlawful to do so, including for death or personal injury
          caused by our negligence, or for fraud.
        </P>
      </>
    ),
  },
  {
    id: "third-party-terms",
    heading: "9. Airline & third-party terms",
    content: (
      <P>
        Your flight is also governed by the operating airline&apos;s own
        conditions of carriage, fare rules and baggage policy, which take
        precedence on matters such as check-in, baggage allowance, delays and
        denied boarding. Please check these with the airline once your
        booking is confirmed.
      </P>
    ),
  },
  {
    id: "intellectual-property",
    heading: "10. Intellectual property",
    content: (
      <P>
        The Wicket Travel name, logo and the content on this site (excluding
        airline logos and third-party marks, which belong to their
        respective owners) belong to {BUSINESS.legalName} or its licensors.
        You may not copy, reproduce or reuse our branding or site content
        without our written permission.
      </P>
    ),
  },
  {
    id: "acceptable-use",
    heading: "11. Acceptable use",
    content: (
      <P>
        You agree not to misuse our site — for example, by attempting to
        interfere with its operation, submitting false booking or passenger
        information, or using it for any unlawful purpose.
      </P>
    ),
  },
  {
    id: "governing-law",
    heading: "12. Governing law",
    content: (
      <P>
        These terms are governed by the laws of England and Wales. Any
        dispute arising from them is subject to the exclusive jurisdiction of
        the courts of England and Wales.
      </P>
    ),
  },
  {
    id: "changes-to-terms",
    heading: "13. Changes to these terms",
    content: (
      <P>
        We may update these terms from time to time — for example, as our
        services change. The &ldquo;last updated&rdquo; date at the top of
        this page shows when they were last revised.
      </P>
    ),
  },
  {
    id: "contact-us",
    heading: "14. Contact us",
    content: (
      <P>
        {BUSINESS.legalName}, {BUSINESS.streetAddress}, {BUSINESS.addressLocality},{" "}
        {BUSINESS.addressRegion}, {BUSINESS.postalCode}, UK.{" "}
        <br className="hidden sm:block" />
        Email: <LegalLink href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</LegalLink> ·
        {" "}Phone/WhatsApp: <LegalLink href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</LegalLink>
      </P>
    ),
  },
];

export default function TermsOfServicePage() {
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
          title="Terms of Service"
          lead="The terms that apply when you search, enquire about or book a flight with Wicket Travel."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
        />
        <LegalLayout sections={sections} lastUpdated={LAST_UPDATED} />
      </main>
      <Footer />
    </>
  );
}
