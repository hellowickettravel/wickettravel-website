import LegalPage, { legalMetadata, Term } from "@/components/LegalPage";
import { LegalLink, P, Ul, type LegalSection } from "@/components/LegalLayout";
import { COMPANY } from "@/lib/legal";
import { PORTAL_LOGIN_URL, WHATSAPP_URL } from "@/lib/links";

export const metadata = legalMetadata({
  title: "Terms & Conditions",
  description:
    "The terms that apply when Wicket Travel Limited books flights for you: how bookings work, prices and payment, tickets, changes, cancellations, refunds, financial protection and complaints.",
  path: "/terms",
});

const mail = <LegalLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</LegalLink>;

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "1. Who we are",
    content: (
      <P>
        Wicket Travel is a trading name of {COMPANY.legalName}, a private
        limited company registered in {COMPANY.jurisdiction} (company number{" "}
        {COMPANY.number}), registered office {COMPANY.registeredOffice}, IATA
        TIDS registration {COMPANY.iataTids}. &ldquo;We&rdquo;, &ldquo;us&rdquo;
        and &ldquo;our&rdquo; mean {COMPANY.legalName}. Contact us at {mail} or
        on WhatsApp at{" "}
        <LegalLink href={WHATSAPP_URL} external>{COMPANY.phoneDisplay}</LegalLink>.
      </P>
    ),
  },
  {
    id: "these-terms",
    heading: "2. These terms",
    content: (
      <>
        <P>
          These terms apply when you use wickettravel.com or our booking portal,
          and whenever we book a flight for you. Please read them before you
          pay. Other terms also apply where relevant:
        </P>
        <Ul>
          <li>the airline&apos;s conditions of carriage and fare rules, for your flights;</li>
          <li>our <LegalLink href="/visa-terms">Visa Service Terms</LegalLink>, if you use our Dubai visa service;</li>
          <li>our <LegalLink href="/parent-travel-assist-terms">Parent Travel Assist Terms</LegalLink>, if you post on or use the board;</li>
          <li>our <LegalLink href="/refunds">Refund Policy</LegalLink> and <LegalLink href="/privacy">Privacy Policy</LegalLink>.</li>
        </Ul>
        <P>
          Nothing in these terms affects your statutory rights as a consumer.
        </P>
      </>
    ),
  },
  {
    id: "how-bookings-work",
    heading: "3. How bookings work",
    content: (
      <>
        <P>
          We are a travel agent. We book flights on your behalf with the
          airline (directly or through the airline&apos;s authorised ticketing
          systems). We are not an airline: the airline issues your ticket and
          is responsible for operating your flight.
        </P>
        <Ul>
          <li>
            <Term>1. Your request.</Term> You tell us your route, dates and
            travellers through the flight search and{" "}
            <LegalLink href={PORTAL_LOGIN_URL} external>our booking portal</LegalLink>,
            by WhatsApp, phone or email. A request is not a booking and does not
            hold a seat or a price.
          </li>
          <li>
            <Term>2. Our quote.</Term> A consultant sends you the flights, the
            total price for all travellers and the main fare rules (baggage,
            changes and refunds).
          </li>
          <li>
            <Term>3. Your agreement and payment.</Term> We book only once you
            accept the quote and pay. Your contract with us is formed when we
            confirm we have received your payment.
          </li>
          <li>
            <Term>4. Ticketing.</Term> We book and ticket the flights and send
            you the e-ticket with its booking reference (PNR) and ticket
            number through the portal and by email.
          </li>
        </Ul>
        <P>
          Hotels, car hire and holidays shown on our site are sold by our sister
          company, Wicket Travel Holidays, under its own terms. We are not a
          party to those bookings.
        </P>
      </>
    ),
  },
  {
    id: "prices-and-payment",
    heading: "4. Prices, fees and payment",
    content: (
      <>
        <Ul>
          <li>
            <Term>One total price.</Term> The price we quote is the total you
            pay us, in pounds sterling, and includes airline fares, taxes and
            charges and our own service charge. Nothing is added at checkout and
            we do not charge card surcharges.
          </li>
          <li>
            <Term>Prices can change until ticketing.</Term> Airlines change
            fares as seats sell. If the fare rises before we can ticket, we tell
            you the new price and only go ahead if you agree; if you don&apos;t,
            we refund anything you have paid for that booking in full.
          </li>
          <li>
            <Term>How to pay.</Term> By card, or by bank transfer to{" "}
            {COMPANY.legalName}&apos;s business account. If we agree to take a
            deposit, we tell you the balance and the date it is due; the
            booking is not ticketed until it is paid in full.
          </li>
          <li>
            <Term>Protect yourself from fraud.</Term> We will never ask you to
            pay a personal account or change our bank details by message. If
            in doubt, call us on {COMPANY.phoneDisplay} before you pay.
          </li>
          <li>
            <Term>Extras.</Term> Seats, extra bags, meals and other airline
            extras are only included if they are listed in your quote.
          </li>
        </Ul>
      </>
    ),
  },
  {
    id: "tickets",
    heading: "5. Tickets and confirmation",
    content: (
      <>
        <P>
          We aim to issue tickets on the same day your payment clears. Your
          booking is confirmed only when you receive an e-ticket number; a
          booking reference alone is not a ticket.
        </P>
        <P>
          Please check every name, date and flight on your quote and e-ticket
          straight away, and tell us of any mistake. Names must match each
          traveller&apos;s passport exactly. Airlines may charge to correct a
          name, or require a new ticket; we pass on what the airline charges
          if the error was in the details you gave us, and cover it ourselves
          if the mistake was ours.
        </P>
      </>
    ),
  },
  {
    id: "your-responsibilities",
    heading: "6. Your responsibilities",
    content: (
      <>
        <Ul>
          <li>Give us accurate details for every traveller.</li>
          <li>
            Hold a valid passport, any visa, transit visa or electronic travel
            authorisation, and meet the health and entry rules of every country
            on your trip. Check{" "}
            <LegalLink href="https://www.gov.uk/foreign-travel-advice" external>
              gov.uk foreign travel advice
            </LegalLink>
            .
          </li>
          <li>Check in and reach the gate by the airline&apos;s deadlines, and follow its baggage rules.</li>
          <li>Tell us about any special assistance needs when you request a quote.</li>
          <li>Take out suitable travel insurance when you book. We strongly recommend it.</li>
        </Ul>
        <P>
          We are not responsible if you are refused boarding or entry because
          of your documents, health or conduct, or if you miss a flight.
        </P>
      </>
    ),
  },
  {
    id: "changes-by-you",
    heading: "7. Changing or cancelling your booking",
    content: (
      <>
        <P>
          Contact us with your booking reference. We ask the airline for you,
          and what is possible and what it costs depends on your fare rules.
          Many cheaper fares cannot be changed or refunded.
        </P>
        <Ul>
          <li>
            You pay any airline change fee, fare difference or cancellation
            charge.
          </li>
          <li>
            If we charge our own service fee for making a change or
            cancellation, we tell you the amount before we act and only charge
            it if you agree.
          </li>
          <li>
            If you don&apos;t take an outbound flight, the airline may cancel
            the rest of your journey. Tell us before departure if your plans
            change.
          </li>
        </Ul>
        <P>
          The 14-day cancellation right under the Consumer Contracts
          Regulations does not apply to flights booked for a specific date
          (regulation 28(1)(b)), so a change or cancellation follows your fare
          rules.
        </P>
      </>
    ),
  },
  {
    id: "changes-by-airline",
    heading: "8. If the airline changes or cancels your flight",
    content: (
      <P>
        Airlines can change schedules. When an airline tells us of a change,
        we tell you as soon as we can and help you choose between the options
        it offers — accepting the change, rebooking, or a refund. For flights
        covered by UK or EU air passenger rights (UK261/EU261), the airline
        owes you care, rerouting or a refund and sometimes compensation; we
        will point you to the airline&apos;s claim process and help where we can.
        Compensation is paid by the airline, not by us.
      </P>
    ),
  },
  {
    id: "refunds",
    heading: "9. Refunds",
    content: (
      <P>
        Refunds follow the airline&apos;s fare rules and our{" "}
        <LegalLink href="/refunds">Refund Policy</LegalLink>. We pay refunds to
        the person who paid, by the original payment method, within 14 days of
        receiving the money from the airline.
      </P>
    ),
  },
  {
    id: "financial-protection",
    heading: "10. Financial protection (ATOL)",
    content: (
      <>
        <P>
          {COMPANY.legalName} does not hold an ATOL licence, and we do not sell
          package holidays or flight-inclusive packages. Flight-only bookings
          made with us are not ATOL protected.
        </P>
        <P>
          If you pay by credit card and the booking costs more than £100, you
          may have protection under section 75 of the Consumer Credit Act
          1974. Debit and credit card payments may also be covered by your
          card provider&apos;s chargeback scheme. Bank transfers have no
          such protection. Travel insurance that covers airline failure gives
          additional protection.
        </P>
      </>
    ),
  },
  {
    id: "liability",
    heading: "11. Our responsibility to you",
    content: (
      <>
        <P>
          We will make your booking with reasonable care and skill, as quoted
          and agreed. If we fail to, we will put it right or refund the cost of
          our error.
        </P>
        <P>
          Your flights are provided by the airline. We are not responsible for
          the airline&apos;s acts or omissions, such as delays, cancellations,
          overbooking, lost baggage or in-flight service; these are governed by
          the airline&apos;s conditions of carriage and the law that applies to
          it. We are not liable for losses that were not foreseeable, or for
          events beyond our reasonable control (such as strikes, severe
          weather, airspace closures or airline failure).
        </P>
        <P>
          Nothing in these terms limits our liability for death or personal
          injury caused by our negligence, for fraud, or for anything else
          that cannot be limited by law.
        </P>
      </>
    ),
  },
  {
    id: "using-the-site",
    heading: "12. Using our site and portal",
    content: (
      <Ul>
        <li>You must be 18 or over to make a booking or open a portal account.</li>
        <li>Keep your portal sign-in details private; you are responsible for activity on your account.</li>
        <li>Don&apos;t submit false information, scrape or copy our content, or try to disrupt or gain unauthorised access to the site or portal.</li>
        <li>Information on our site (routes, airlines, flying times, entry rules) is general guidance and can change; your quote and the airline&apos;s rules are what count.</li>
      </Ul>
    ),
  },
  {
    id: "content",
    heading: "13. Content and trademarks",
    content: (
      <P>
        The Wicket Travel name, logo, site design and text belong to{" "}
        {COMPANY.legalName}. Airline names and logos belong to their owners
        and are used only to identify their services. Photos are used under
        the licences listed on our{" "}
        <LegalLink href="/photo-credits">photo credits</LegalLink> page.
      </P>
    ),
  },
  {
    id: "complaints",
    heading: "14. Complaints",
    content: (
      <P>
        If something goes wrong, tell us — see our{" "}
        <LegalLink href="/complaints">complaints procedure</LegalLink> for how
        we handle it, our response times and where to go if you&apos;re still
        not satisfied.
      </P>
    ),
  },
  {
    id: "law",
    heading: "15. Law and changes",
    content: (
      <>
        <P>
          These terms are governed by the law of England and Wales, and the
          courts of England and Wales have jurisdiction. If you live in
          Scotland or Northern Ireland, you can also bring proceedings in your
          local courts.
        </P>
        <P>
          We may update these terms; the date at the top shows when. The terms
          that apply to your booking are the ones in force when you paid.
        </P>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      lead="The terms that apply when Wicket Travel books flights for you."
      path="/terms"
      sections={sections}
      intro={
        <>
          <p>
            <strong>In short:</strong> we are a travel agent. We quote you one
            total price with the fare rules, book only once you agree and pay,
            and the airline issues your ticket and flies you under its own
            conditions.
          </p>
          <p>
            Changes and refunds follow the airline&apos;s fare rules, and we
            pass refunds on within 14 days of receiving them. We don&apos;t
            hold an ATOL licence, so flight-only bookings are not ATOL protected.
          </p>
        </>
      }
    />
  );
}
