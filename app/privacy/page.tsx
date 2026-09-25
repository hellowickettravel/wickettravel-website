import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LegalLayout, { LegalLink, P, Placeholder, Ul, type LegalSection } from "@/components/LegalLayout";
import { BUSINESS, OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Wicket Travel Limited collects, uses and protects your personal data when you enquire about or book a flight, under UK GDPR.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/privacy`,
    title: "Privacy Policy | Wicket Travel",
    description:
      "How Wicket Travel Limited collects, uses and protects your personal data under UK GDPR.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Privacy Policy | Wicket Travel",
    description:
      "How Wicket Travel Limited collects, uses and protects your personal data under UK GDPR.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE_URL}/privacy` },
  ],
};

const LAST_UPDATED = "28 July 2026";

const sections: LegalSection[] = [
  {
    id: "introduction",
    heading: "1. Introduction",
    content: (
      <>
        <P>
          This policy explains how {BUSINESS.legalName} (company registration
          {" "}{BUSINESS.registration}, &ldquo;Wicket Travel&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, shares and
          protects your personal data when you visit wickettravel.com, submit
          an enquiry, or book a flight through us. We are the data controller
          for the personal data described in this policy.
        </P>
        <P>
          We are a UK flight ticket booking service — we compare and book
          airline tickets. Hotels and car rentals shown on our site are
          provided by our sister brand,{" "}
          <LegalLink href="https://www.wickettravelholidays.com/" external>
            Wicket Travel Holidays
          </LegalLink>
          , which is a separate business with its own privacy policy — please
          check that site directly for how it handles your data.
        </P>
        <P>
          This is a template privacy policy prepared for Wicket Travel using
          the business details we were given. It is designed to cover the
          enquiry and booking flows currently on this site, but it must be
          reviewed by a qualified legal professional before it is treated as
          final.
        </P>
      </>
    ),
  },
  {
    id: "information-we-collect",
    heading: "2. Information we collect",
    content: (
      <>
        <P>We collect personal data you give us directly, including:</P>
        <Ul>
          <li>
            <strong className="text-primary-800">Flight enquiries &amp; bookings</strong> — name,
            contact details, travel dates and routes, passenger and passport
            details, and any information you give our team while arranging a
            booking.
          </li>
          <li>
            <strong className="text-primary-800">Contact form submissions</strong> — your name,
            email address, phone number and the content of your message.
          </li>
          <li>
            <strong className="text-primary-800">Visa enquiry forms</strong> — the details our Dubai
            visa enquiry form asks for, which can include passport, nationality,
            employment and travel history information, plus any documents you
            upload (e.g. passport scans).
          </li>
          <li>
            <strong className="text-primary-800">Parents Travel Assist enquiries</strong> — details you
            submit when asking us to help find a flight for a visiting parent
            or family member, and the contact details of the person raising
            the enquiry.
          </li>
          <li>
            <strong className="text-primary-800">Technical data</strong> — IP address, browser and
            device type, pages visited and how you use our site, collected
            automatically via cookies and similar technologies (see{" "}
            <a href="#cookies" className="font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600">
              Cookies
            </a>{" "}
            below).
          </li>
        </Ul>
        <P>
          We do not directly collect or store full card payment details —
          payments are handled by our payment processor and/or the booking
          portal, which have their own security and privacy safeguards.
        </P>
      </>
    ),
  },
  {
    id: "how-we-use-your-information",
    heading: "3. How and why we use your information",
    content: (
      <>
        <P>We use your personal data to:</P>
        <Ul>
          <li>Find fares, process enquiries and complete flight bookings on your behalf.</li>
          <li>Respond to contact form, visa and Parents Travel Assist enquiries.</li>
          <li>Communicate with you about your booking, including changes made by an airline.</li>
          <li>Provide customer support by phone, WhatsApp and email.</li>
          <li>Improve our website and services, and keep our systems secure.</li>
          <li>Meet our legal, accounting and regulatory obligations.</li>
          <li>
            With your consent, send you offers or updates — you can opt out
            at any time.
          </li>
        </Ul>
        <P>Our lawful bases for these uses, under UK GDPR, are typically:</P>
        <Ul>
          <li><strong className="text-primary-800">Contract</strong> — to take the steps you ask for before, and to perform, a booking.</li>
          <li><strong className="text-primary-800">Legitimate interests</strong> — to run, secure and improve our business and respond to enquiries.</li>
          <li><strong className="text-primary-800">Consent</strong> — for optional marketing communications, which you can withdraw at any time.</li>
          <li><strong className="text-primary-800">Legal obligation</strong> — where we must keep or share records, e.g. for tax purposes.</li>
        </Ul>
      </>
    ),
  },
  {
    id: "cookies",
    heading: "4. Cookies",
    content: (
      <>
        <P>
          We use cookies and similar technologies (including your browser&apos;s
          local storage) for essential site functions — such as remembering
          your cookie choice and your preferred language — and to understand
          how our site is used so we can improve it.
        </P>
        <P>
          You&apos;ll see a cookie banner on your first visit where you can
          accept or reject non-essential cookies. If we introduce analytics or
          advertising cookies in future, this policy and that banner will be
          updated so you can make an informed choice.
        </P>
      </>
    ),
  },
  {
    id: "sharing-your-information",
    heading: "5. Who we share your information with",
    content: (
      <>
        <P>We share personal data only where it&apos;s needed to deliver our service:</P>
        <Ul>
          <li><strong className="text-primary-800">Airlines &amp; travel partners</strong> — to issue and manage your ticket.</li>
          <li><strong className="text-primary-800">Our booking portal</strong> — the secure system we and our team use to process bookings and enquiries.</li>
          <li><strong className="text-primary-800">Payment processors</strong> — to take payment securely; we do not store full card details ourselves.</li>
          <li><strong className="text-primary-800">IT, hosting and support providers</strong> — who process data on our behalf, under contract.</li>
          <li><strong className="text-primary-800">Regulators or authorities</strong> — where we are legally required to.</li>
        </Ul>
        <P>
          We do not sell your personal data. If you enquire about a hotel or
          car rental, that enquiry is passed to our sister brand, Wicket
          Travel Holidays, to action.
        </P>
      </>
    ),
  },
  {
    id: "international-transfers",
    heading: "6. International transfers",
    content: (
      <P>
        Some airlines and partners we share data with are based outside the
        UK or European Economic Area. Where this happens, we take steps to
        ensure your data is protected to a standard consistent with UK GDPR,
        such as relying on the receiving party&apos;s own regulatory
        obligations or standard contractual clauses.
      </P>
    ),
  },
  {
    id: "data-retention",
    heading: "7. Data retention",
    content: (
      <>
        <P>
          We keep personal data for as long as needed to provide our service,
          meet legal and accounting obligations, and resolve any disputes.
          Exact retention periods depend on the type of data and are{" "}
          <Placeholder>to be confirmed by Wicket Travel Limited</Placeholder>{" "}
          — for example, booking records may need to be kept for a set number
          of years for tax purposes, while an unactioned enquiry may be
          deleted much sooner.
        </P>
        <P>
          When data is no longer needed, we delete or anonymize it in line
          with our internal data-retention schedule.
        </P>
      </>
    ),
  },
  {
    id: "your-rights",
    heading: "8. Your rights under UK GDPR",
    content: (
      <>
        <P>You have the right to:</P>
        <Ul>
          <li>Ask what personal data we hold about you and receive a copy (access).</li>
          <li>Have inaccurate data corrected (rectification).</li>
          <li>Ask us to delete your data in certain circumstances (erasure).</li>
          <li>Ask us to restrict how we use your data (restriction).</li>
          <li>Receive certain data in a portable format (portability).</li>
          <li>Object to processing based on legitimate interests or for marketing (objection).</li>
          <li>Withdraw consent at any time, where we rely on it.</li>
        </Ul>
        <P>
          To exercise any of these rights, contact us using the details
          below. We may need to verify your identity before acting on a
          request.
        </P>
      </>
    ),
  },
  {
    id: "children",
    heading: "9. Children's information",
    content: (
      <P>
        Our services are intended for adults arranging travel. Our Parents
        Tickets form collects details from the adult submitting the enquiry
        about their parent or family member&apos;s travel — it is not aimed
        at, and should not be used to collect data directly from, children.
      </P>
    ),
  },
  {
    id: "how-to-complain",
    heading: "10. How to contact us or complain",
    content: (
      <>
        <P>
          If you have a concern about how we&apos;ve handled your personal
          data, please contact us first at{" "}
          <LegalLink href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</LegalLink>{" "}
          so we can try to put it right.
        </P>
        <P>
          You also have the right to complain to the UK&apos;s data
          protection regulator, the{" "}
          <LegalLink href="https://ico.org.uk/make-a-complaint/" external>
            Information Commissioner&apos;s Office (ICO)
          </LegalLink>
          , at ico.org.uk or by calling 0303 123 1113.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    heading: "11. Changes to this policy",
    content: (
      <P>
        We may update this policy from time to time, for example as our
        services change. The &ldquo;last updated&rdquo; date at the top of
        this page shows when it was last revised. We encourage you to review
        it periodically.
      </P>
    ),
  },
  {
    id: "contact-us",
    heading: "12. Contact us",
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

export default function PrivacyPolicyPage() {
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
          title="Privacy Policy"
          lead="How we collect, use and protect your personal data — in plain English, under UK GDPR."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        />
        <LegalLayout sections={sections} lastUpdated={LAST_UPDATED} />
      </main>
      <Footer />
    </>
  );
}
