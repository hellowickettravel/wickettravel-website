import LegalPage, { legalMetadata, Term } from "@/components/LegalPage";
import { LegalLink, P, Ul, type LegalSection } from "@/components/LegalLayout";
import { COMPANY } from "@/lib/legal";
import { WHATSAPP_URL } from "@/lib/links";

export const metadata = legalMetadata({
  title: "Refund Policy",
  description:
    "How cancellations and refunds work when Wicket Travel books your flight: fare rules, fees, airline-cancelled flights, and when you get your money back.",
  path: "/refunds",
});

const mail = <LegalLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</LegalLink>;

const sections: LegalSection[] = [
  {
    id: "overview",
    heading: "1. How refunds work",
    content: (
      <P>
        We book your flights with the airline on your behalf, so any refund
        comes from the airline under the fare rules of your ticket. We claim
        it for you, and pay it on to you once the airline pays us. The fare
        rules are in your quote; ask us if you want them explained before you
        book.
      </P>
    ),
  },
  {
    id: "fare-types",
    heading: "2. What you can get back",
    content: (
      <>
        <Ul>
          <li>
            <Term>Refundable fares</Term>: the fare and taxes, less any
            cancellation charge in the fare rules.
          </li>
          <li>
            <Term>Non-refundable fares</Term>: usually only the government taxes
            and airport charges that the airline did not have to pay because
            you didn&apos;t fly. Some airlines charge to process even this.
          </li>
          <li>
            <Term>Partly used tickets</Term>: depends on the fare rules; often
            little or nothing is refundable once a journey has started.
          </li>
        </Ul>
        <P>
          Our own service charge covers work already done to book your
          flights, so it is not refunded when you choose to cancel, unless the
          booking was never ticketed.
        </P>
      </>
    ),
  },
  {
    id: "cancel-by-you",
    heading: "3. If you cancel",
    content: (
      <>
        <P>
          Contact us as soon as you know, and before the flight departs:
          WhatsApp{" "}
          <LegalLink href={WHATSAPP_URL} external>{COMPANY.phoneDisplay}</LegalLink>,
          email {mail}, or message us in your booking on the portal. Give your
          booking reference and the names of the travellers cancelling.
        </P>
        <Ul>
          <li>We check the fare rules and tell you, in writing, what you will get back before we cancel anything.</li>
          <li>If we charge a fee to process the cancellation, we tell you the amount first and only charge it if you agree. It is deducted from the refund, never charged separately.</li>
          <li>We cancel with the airline only after you confirm.</li>
        </Ul>
        <P>
          If you simply don&apos;t turn up for a flight (a &ldquo;no-show&rdquo;),
          most fares lose any refund except, sometimes, unused taxes.
        </P>
      </>
    ),
  },
  {
    id: "cancel-by-airline",
    heading: "4. If the airline cancels or changes your flight",
    content: (
      <>
        <P>
          You are entitled to a full refund of the unused ticket if the airline
          cancels your flight or makes a significant schedule change you
          don&apos;t accept. We tell you as soon as the airline tells us, explain
          your options (rebooking, a refund, or a voucher if you prefer one),
          and claim the refund for you.
        </P>
        <Ul>
          <li>We do not charge a service fee for refunds caused by an airline cancellation or schedule change.</li>
          <li>
            Compensation and expenses under UK261/EU261 (for example for long
            delays) are paid by the airline. We will point you to its claim
            process and help where we can.
          </li>
        </Ul>
      </>
    ),
  },
  {
    id: "timeframes",
    heading: "5. When you get your money",
    content: (
      <>
        <P>
          <Term>Our promise:</Term> we pay you within 14 days of receiving the
          refund from the airline, to the original payment method (or, for
          bank transfer payments, to the account you paid from).
        </P>
        <P>
          Airlines set their own processing times, which can be anywhere from a
          few weeks to several months, and longer during widespread
          disruption. We chase the airline for you and keep you updated, and
          you can ask us for a progress update at any time.
        </P>
      </>
    ),
  },
  {
    id: "not-refundable",
    heading: "6. What is not refundable",
    content: (
      <Ul>
        <li>Fares marked non-refundable, apart from any taxes the airline refunds.</li>
        <li>Missed flights, missed check-in and no-shows.</li>
        <li>Refused boarding or entry because of passports, visas, health requirements or conduct.</li>
        <li>Visa fees — see our <LegalLink href="/visa-terms">Visa Service Terms</LegalLink>.</li>
        <li>Our service charge once a booking has been ticketed, when you choose to cancel.</li>
      </Ul>
    ),
  },
  {
    id: "our-mistakes",
    heading: "7. If we made a mistake",
    content: (
      <P>
        If we booked something different from what you agreed, we will fix it
        at no cost to you, or refund you in full if it can&apos;t be fixed.
      </P>
    ),
  },
  {
    id: "card-protection",
    heading: "8. Card protection and chargebacks",
    content: (
      <P>
        Please contact us before raising a chargeback so we can help; a
        chargeback on a ticket the airline has already refunded to us can delay
        your money. Card payments may be protected by section 75 of the Consumer
        Credit Act 1974 (credit cards, over £100) or your card provider&apos;s
        chargeback scheme. Flight-only bookings are not ATOL protected.
      </P>
    ),
  },
  {
    id: "contact",
    heading: "9. Questions and complaints",
    content: (
      <P>
        Email {mail} or WhatsApp{" "}
        <LegalLink href={WHATSAPP_URL} external>{COMPANY.phoneDisplay}</LegalLink>.
        Not happy with how a refund has been handled? Follow our{" "}
        <LegalLink href="/complaints">complaints procedure</LegalLink>.
      </P>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      lead="How cancellations and refunds work when Wicket Travel books your flight."
      path="/refunds"
      sections={sections}
      intro={
        <p>
          <strong>In short:</strong> refunds follow your ticket&apos;s fare
          rules. We tell you what you&apos;ll get back before we cancel, never
          charge a fee you haven&apos;t agreed to, and pay you within 14 days of
          the airline paying us.
        </p>
      }
    />
  );
}
