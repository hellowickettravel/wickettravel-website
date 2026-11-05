import LegalPage, { legalMetadata, Term } from "@/components/LegalPage";
import { LegalLink, P, Ul, type LegalSection } from "@/components/LegalLayout";
import { COMPANY } from "@/lib/legal";
import { WHATSAPP_URL } from "@/lib/links";

export const metadata = legalMetadata({
  title: "Complaints Procedure",
  description:
    "How to complain to Wicket Travel, how quickly we respond, and where to go if you are not satisfied with our answer.",
  path: "/complaints",
});

const mail = <LegalLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</LegalLink>;

const sections: LegalSection[] = [
  {
    id: "how-to-complain",
    heading: "1. How to complain",
    content: (
      <>
        <P>
          Most problems are fastest to fix while you&apos;re still in touch
          with the person handling your booking, so tell them first. If
          that doesn&apos;t resolve it, make a formal complaint:
        </P>
        <Ul>
          <li>
            <Term>Email</Term> {mail} with &ldquo;Complaint&rdquo; in the
            subject line; or
          </li>
          <li>
            <Term>WhatsApp</Term>{" "}
            <LegalLink href={WHATSAPP_URL} external>{COMPANY.phoneDisplay}</LegalLink>{" "}
            and say you want to make a formal complaint; or
          </li>
          <li>
            <Term>Write</Term> to Complaints, {COMPANY.legalName},{" "}
            {COMPANY.registeredOffice}.
          </li>
        </Ul>
        <P>
          Please include your name, booking reference (if you have one), what
          went wrong, what you would like us to do, and any documents or
          screenshots that help. If you need help making a complaint, or would
          like us to communicate in a different way, just tell us.
        </P>
      </>
    ),
  },
  {
    id: "what-happens-next",
    heading: "2. What happens next",
    content: (
      <Ul>
        <li>
          <Term>Within 2 working days</Term> we acknowledge your complaint and
          tell you who is handling it.
        </li>
        <li>
          <Term>Within 14 days</Term> we send you a full written response,
          explaining what we found and what we will do. If we need longer,
          for example because we are waiting on an airline, we tell you why
          and when to expect an answer, and keep you updated at least every
          14 days.
        </li>
        <li>
          <Term>Within 8 weeks</Term> at the latest you will have our final
          response.
        </li>
      </Ul>
    ),
  },
  {
    id: "escalation",
    heading: "3. If you are not satisfied",
    content: (
      <>
        <P>
          If you are unhappy with our response, ask for it to be reviewed by a
          director of {COMPANY.legalName}. Reply to our response saying so; a
          director who was not involved in the first answer will review it and
          reply within 14 days.
        </P>
        <P>If you are still not satisfied after our final response:</P>
        <Ul>
          <li>
            <Term>Your card provider.</Term> If you paid by card, you may be
            able to claim from your card provider (section 75 for credit card
            payments over £100, or chargeback).
          </li>
          <li>
            <Term>The airline.</Term> Complaints about a flight itself (delays,
            cancellations, baggage, denied boarding) are for the airline. If
            the airline doesn&apos;t resolve them, you can escalate to the
            airline&apos;s approved ADR scheme or the Civil Aviation Authority:{" "}
            <LegalLink href="https://www.caa.co.uk/passengers-and-public/resolving-travel-problems/" external>
              caa.co.uk
            </LegalLink>
            . We will help you prepare your claim.
          </li>
          <li>
            <Term>Your data.</Term> For a complaint about how we handle personal
            data, you can contact the Information Commissioner&apos;s Office at{" "}
            <LegalLink href="https://ico.org.uk/make-a-complaint/" external>ico.org.uk</LegalLink>.
          </li>
          <li>
            <Term>Free advice.</Term> Citizens Advice consumer helpline,{" "}
            <LegalLink href="https://www.citizensadvice.org.uk/consumer/" external>
              citizensadvice.org.uk
            </LegalLink>{" "}
            or 0808 223 1133.
          </li>
          <li>
            <Term>The courts.</Term> You can bring a claim through the small
            claims track:{" "}
            <LegalLink href="https://www.gov.uk/make-money-claim" external>gov.uk/make-money-claim</LegalLink>.
          </li>
        </Ul>
        <P>
          {COMPANY.legalName} is not currently a member of an alternative dispute
          resolution scheme for travel agents. Using this procedure does not
          affect your legal rights.
        </P>
      </>
    ),
  },
  {
    id: "safety",
    heading: "4. Safety concerns on Parent Travel Assist",
    content: (
      <P>
        A safety concern about a Parent Travel Assist member is not a normal
        complaint: report it straight away by WhatsApp or email with
        &ldquo;Safety&rdquo; in the subject, and we act on it the same day.
        If anyone is in immediate danger, call 999. See our{" "}
        <LegalLink href="/parent-travel-assist-terms#safety">
          Parent Travel Assist Terms
        </LegalLink>
        .
      </P>
    ),
  },
  {
    id: "records",
    heading: "5. How we use what you tell us",
    content: (
      <P>
        We keep a record of every complaint and our response, use what we
        learn to improve our service, and handle your details as set out in
        our <LegalLink href="/privacy">Privacy Policy</LegalLink>.
      </P>
    ),
  },
];

export default function ComplaintsPage() {
  return (
    <LegalPage
      title="Complaints Procedure"
      lead="How to complain, how quickly we respond, and where to go if you're still not satisfied."
      path="/complaints"
      sections={sections}
      intro={
        <p>
          <strong>Our commitment:</strong> we acknowledge every complaint within 2
          working days and send a full written response within 14 days.
        </p>
      }
    />
  );
}
