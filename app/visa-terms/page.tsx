import LegalPage, { legalMetadata, Term } from "@/components/LegalPage";
import { LegalLink, P, Ul, type LegalSection } from "@/components/LegalLayout";
import { COMPANY } from "@/lib/legal";
import { WHATSAPP_URL } from "@/lib/links";

export const metadata = legalMetadata({
  title: "Visa Service Terms",
  description:
    "The terms of Wicket Travel's Dubai and UAE visa application service: what we do, fees, refunds if a visa is refused, document handling and processing times.",
  path: "/visa-terms",
});

const mail = <LegalLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</LegalLink>;

/* The refund rule in §5 must match the visa FAQ in app/visa/page.tsx
   ("Cost / what if refused?") word for word in substance. */
const sections: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "1. Who we are — and who we are not",
    content: (
      <>
        <P>
          This service is provided by {COMPANY.legalName} (company number{" "}
          {COMPANY.number}), trading as Wicket Travel, a private travel agent.
        </P>
        <P>
          <Term>We are not the UAE government</Term>, an embassy, or an official
          visa website, and we are not affiliated with the UAE immigration
          authorities. You can apply for a UAE visa yourself through official
          channels, or through an airline that offers visas to its passengers;
          our fee is for the help we give with your application.
        </P>
      </>
    ),
  },
  {
    id: "what-we-do",
    heading: "2. What our service includes",
    content: (
      <>
        <Ul>
          <li>Checking which visa suits your trip, nationality and UK residence status.</li>
          <li>Checking your answers and documents for completeness before submission.</li>
          <li>Submitting your application through an authorised channel and paying the government fee on your behalf.</li>
          <li>Keeping you updated, and sending you the visa if it is issued.</li>
        </Ul>
        <P>
          These terms sit alongside our general{" "}
          <LegalLink href="/terms">Terms &amp; Conditions</LegalLink>. Flights
          booked with us are covered by those terms, not by these.
        </P>
      </>
    ),
  },
  {
    id: "no-guarantee",
    heading: "3. No guarantee of approval",
    content: (
      <P>
        Every visa is decided by the UAE authorities, who can refuse an
        application, ask for more documents, or take longer than usual, without
        giving reasons. We cannot guarantee that a visa will be granted or
        issued by a particular date. A visa also doesn&apos;t guarantee entry:
        the final decision is made by immigration officers on arrival. Please
        don&apos;t book non-refundable travel until your visa is issued, unless
        you accept that risk.
      </P>
    ),
  },
  {
    id: "fees",
    heading: "4. Fees and payment",
    content: (
      <>
        <P>Before you pay, we confirm in writing:</P>
        <Ul>
          <li><Term>the government fee</Term> — set by the UAE authorities, paid on to them in full; and</li>
          <li><Term>our service fee</Term> — for checking, preparing and submitting your application.</li>
        </Ul>
        <P>
          Nothing else is added. We start work once you have agreed the total
          and paid. Fees are per applicant, in pounds sterling.
        </P>
      </>
    ),
  },
  {
    id: "refunds",
    heading: "5. Cancellations and refunds",
    content: (
      <Ul>
        <li>
          <Term>Before we submit your application:</Term> you can cancel for a
          full refund of everything you paid.
        </li>
        <li>
          <Term>After submission:</Term> the government fee is not refundable,
          because it has been paid to the UAE authorities. Our service fee is
          not refunded if the application is refused, because the work has been
          done.
        </li>
        <li>
          <Term>If we make a mistake</Term> that causes a refusal or delay — for
          example, submitting information different from what you gave us — we
          will re-submit at our cost, or refund our service fee and any
          government fee lost because of our error.
        </li>
      </Ul>
    ),
  },
  {
    id: "your-responsibilities",
    heading: "6. Your responsibilities",
    content: (
      <Ul>
        <li>Give complete and truthful answers. False or misleading information can lead to refusal and a ban, and we will stop work on the application.</li>
        <li>Send clear copies of the documents we ask for, and tell us at once if anything changes.</li>
        <li>Make sure your passport is valid for at least 6 months from your arrival date, or as the UAE requires at the time.</li>
        <li>Check your visa when you receive it, and follow its conditions (length of stay, entry deadline).</li>
      </Ul>
    ),
  },
  {
    id: "timings",
    heading: "7. Processing times",
    content: (
      <P>
        We aim to call you back the same day you enquire, and to submit as soon
        as we have everything we need. Processing times after
        submission are set by the UAE authorities and vary; we tell you the
        current typical time when we quote, but it is not a promise.
      </P>
    ),
  },
  {
    id: "documents",
    heading: "8. Your documents and data",
    content: (
      <P>
        Please upload documents through our secure form or portal rather than
        sending them by email or WhatsApp. They are kept in private storage, used
        only for your application, shared only with the UAE authorities and the
        authorised channel we submit through, and deleted 6 months after the
        decision. Your answer about criminal convictions is only collected with
        your explicit consent. See our <LegalLink href="/privacy">Privacy Policy</LegalLink>.
      </P>
    ),
  },
  {
    id: "liability",
    heading: "9. Our responsibility",
    content: (
      <P>
        We will provide the service with reasonable care and skill. We are not
        responsible for the authorities&apos; decisions or timings, or for
        travel or other costs if a visa is refused or delayed, except where
        the refusal or delay was caused by our error (§5). Nothing here limits
        liability that cannot be limited by law, or your statutory rights.
      </P>
    ),
  },
  {
    id: "contact",
    heading: "10. Contact and complaints",
    content: (
      <P>
        Email {mail} or WhatsApp{" "}
        <LegalLink href={WHATSAPP_URL} external>{COMPANY.phoneDisplay}</LegalLink>.
        If you are unhappy with our service, follow our{" "}
        <LegalLink href="/complaints">complaints procedure</LegalLink>. These
        terms are governed by the law of England and Wales.
      </P>
    ),
  },
];

export default function VisaTermsPage() {
  return (
    <LegalPage
      title="Visa Service Terms"
      lead="The terms of our Dubai and UAE visa application service."
      path="/visa-terms"
      sections={sections}
      intro={
        <>
          <p>
            <strong>Wicket Travel is a private company, not the UAE government
            or an official visa website.</strong> We help you apply; the UAE
            authorities decide every application, and we can&apos;t guarantee
            approval.
          </p>
          <p>
            You see the government fee and our service fee in writing before you
            pay. Cancel before we submit and you get a full refund.
          </p>
        </>
      }
    />
  );
}
