import { WHATSAPP_URL } from "@/lib/links";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LegalLayout, { LegalLink, P, Placeholder, Ul, type LegalSection } from "@/components/LegalLayout";
import { BUSINESS, OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "How refunds and cancellations work when you book an airline ticket through Wicket Travel — fare rules, fees, timeframes and how to request one.",
  alternates: { canonical: "/refunds" },
  robots: { index: true, follow: true },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/refunds`,
    title: "Refund Policy | Wicket Travel",
    description:
      "How refunds and cancellations work when you book a flight through Wicket Travel.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Refund Policy | Wicket Travel",
    description:
      "How refunds and cancellations work when you book a flight through Wicket Travel.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Refund Policy", item: `${SITE_URL}/refunds` },
  ],
};

const LAST_UPDATED = "28 July 2026";

const sections: LegalSection[] = [
  {
    id: "overview",
    heading: "1. Overview",
    content: (
      <P>
        Wicket Travel books flights as an intermediary between you and the
        operating airline. Refunds are governed first and foremost by the
        fare rules the airline attached to your ticket at the time of
        booking — we help you claim what you&apos;re entitled to, but we
        cannot override an airline&apos;s own fare conditions.
      </P>
    ),
  },
  {
    id: "how-refunds-work",
    heading: "2. How refunds work",
    content: (
      <>
        <P>Whether a ticket is refundable depends on the fare type you booked:</P>
        <Ul>
          <li><strong className="text-primary-800">Fully refundable fares</strong> — can be cancelled for a refund, sometimes minus a service or admin fee.</li>
          <li><strong className="text-primary-800">Partially refundable fares</strong> — the airline refunds taxes and part of the fare; the rest is retained per its fare rules.</li>
          <li><strong className="text-primary-800">Non-refundable fares</strong> — typically only unused government taxes and airport charges can be recovered, if anything.</li>
        </Ul>
        <P>
          Your fare type is confirmed at the time of booking. If you&apos;re
          unsure which applies to you, contact us with your booking reference
          and we&apos;ll check the fare rules for you.
        </P>
      </>
    ),
  },
  {
    id: "cancellation-process",
    heading: "3. Cancellation process",
    content: (
      <>
        <P>To cancel a booking or ask about a refund:</P>
        <Ul>
          <li>Contact us by phone, WhatsApp or email with your booking reference and passenger name.</li>
          <li>We&apos;ll check the airline&apos;s fare rules and confirm what refund, if any, applies.</li>
          <li>Where a refund is due, we submit the cancellation to the airline or booking portal on your behalf.</li>
        </Ul>
        <P>
          See our <LegalLink href="/contact">Contact page</LegalLink> for
          every way to reach us.
        </P>
      </>
    ),
  },
  {
    id: "fees",
    heading: "4. Service & admin fees",
    content: (
      <P>
        We may charge a service or administration fee to process a
        cancellation or refund request, separate from anything the airline
        withholds under its own fare rules. Any such fee is{" "}
        <Placeholder>to be confirmed by Wicket Travel Limited</Placeholder>{" "}
        and will always be disclosed to you before you agree to proceed.
      </P>
    ),
  },
  {
    id: "timeframes",
    heading: "5. Timeframes",
    content: (
      <P>
        Once an airline approves a refund, it&apos;s paid back to your
        original payment method. Processing times are set by the airline and
        your card issuer or bank, and typically take{" "}
        <Placeholder>a number of weeks — exact range to be confirmed by Wicket Travel Limited</Placeholder>
        . We&apos;ll keep you updated while a refund is in progress.
      </P>
    ),
  },
  {
    id: "non-refundable-cases",
    heading: "6. Cases that are typically non-refundable",
    content: (
      <>
        <P>The following are generally not refundable, in line with standard airline policy:</P>
        <Ul>
          <li>No-shows — not cancelling before departure and simply not travelling.</li>
          <li>Missing check-in or boarding deadlines set by the airline.</li>
          <li>Visa refusal or travel document issues that are not the airline&apos;s or our fault.</li>
          <li>Promotional or &ldquo;basic&rdquo; fares explicitly marked as non-refundable at the time of booking.</li>
          <li>Any service or admin fee we&apos;ve already charged for work carried out on your booking.</li>
        </Ul>
      </>
    ),
  },
  {
    id: "airline-initiated-changes",
    heading: "7. When the airline cancels or reschedules your flight",
    content: (
      <P>
        If an airline cancels or significantly reschedules your flight, you
        are usually entitled to a choice of a refund, rebooking or credit
        under that airline&apos;s own policy — and, for some UK/EU flights,
        under applicable air passenger rights regulations. We&apos;ll help
        you exercise whichever option the airline offers and, where
        regulations entitle you to more, point you to the airline&apos;s
        process for claiming it.
      </P>
    ),
  },
  {
    id: "how-to-request",
    heading: "8. How to request a refund",
    content: (
      <>
        <P>Contact us with the following so we can act quickly:</P>
        <Ul>
          <li>Your booking reference / PNR.</li>
          <li>The full name(s) of the passenger(s).</li>
          <li>The reason for cancellation, if relevant.</li>
        </Ul>
      </>
    ),
  },
  {
    id: "contact-us",
    heading: "9. Contact us for refund queries",
    content: (
      <P>
        Email: <LegalLink href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</LegalLink> ·{" "}
        Phone/WhatsApp: <LegalLink href={WHATSAPP_URL} external>{BUSINESS.phoneDisplay}</LegalLink>.
        {" "}{BUSINESS.legalName}, {BUSINESS.streetAddress}, {BUSINESS.addressLocality},{" "}
        {BUSINESS.addressRegion}, {BUSINESS.postalCode}, UK.
      </P>
    ),
  },
];

export default function RefundPolicyPage() {
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
          title="Refund Policy"
          lead="How refunds and cancellations work when your flight is booked through Wicket Travel."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Refund Policy" }]}
        />
        <LegalLayout sections={sections} lastUpdated={LAST_UPDATED} />
      </main>
      <Footer />
    </>
  );
}
