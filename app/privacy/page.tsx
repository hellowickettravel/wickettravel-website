import LegalPage, { legalMetadata, Term } from "@/components/LegalPage";
import { LegalLink, P, Ul, type LegalSection } from "@/components/LegalLayout";
import { COMPANY, ICO_REGISTRATION } from "@/lib/legal";
import { PORTAL_LOGIN_URL } from "@/lib/links";

export const metadata = legalMetadata({
  title: "Privacy Policy",
  description:
    "How Wicket Travel Limited collects, uses, shares and keeps your personal data when you book a flight, apply for a Dubai visa or use Parent Travel Assist, and your rights under UK GDPR.",
  path: "/privacy",
});

const mail = <LegalLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</LegalLink>;

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "1. Who we are",
    content: (
      <>
        <P>
          Wicket Travel is a trading name of {COMPANY.legalName}, a private
          limited company registered in {COMPANY.jurisdiction} (company number{" "}
          {COMPANY.number}), registered office {COMPANY.registeredOffice}.
          We are the controller of the personal data described in this policy.
        </P>
        <P>
          Questions about your data, or a request to use any of your rights:
          email {mail} with &ldquo;Privacy&rdquo; in the subject, or write to
          us at our registered office.
          {ICO_REGISTRATION
            ? ` We are registered with the Information Commissioner's Office under number ${ICO_REGISTRATION}.`
            : ""}
        </P>
        <P>
          Hotels, car hire and holidays linked from our site are sold by our
          sister company, Wicket Travel Holidays, which has its own privacy
          policy. This policy covers wickettravel.com and our booking portal
          (portal.wickettravel.com).
        </P>
      </>
    ),
  },
  {
    id: "what-we-collect",
    heading: "2. What we collect",
    content: (
      <>
        <P>We collect what you give us, and a small amount of technical data needed to run the site:</P>
        <Ul>
          <li>
            <Term>Flight bookings.</Term> The details an airline needs to issue
            a ticket: each traveller&apos;s name as on their passport, date of
            birth, gender, nationality, passport number and expiry where the
            airline or destination requires them, contact details, travel dates
            and preferences, any special assistance you ask for, the price we
            quoted, your payment record (method, amount, date — not your full
            card number), and the messages and documents in your booking.
          </li>
          <li>
            <Term>Your portal account.</Term> Name, email address, phone number
            and sign-in details for{" "}
            <LegalLink href={PORTAL_LOGIN_URL} external>our booking portal</LegalLink>.
            Passwords are stored only in hashed form by our authentication provider.
          </li>
          <li>
            <Term>Contact and quote requests.</Term> Your name, email address,
            phone number (optional), the topic, route and dates you give, and
            your message.
          </li>
          <li>
            <Term>Dubai visa service.</Term> Your enquiry (visa type, name,
            email, phone and notes). If you go ahead, the details the UAE
            application asks for: travel dates and plans, full name, date and
            place of birth, nationality, gender, marital status, UK address,
            passport details, UK visa or residence permit details, previous
            UAE visas, occupation and employer, who pays for the trip, whether
            you have been refused entry to the UAE or have a criminal
            conviction, and the documents you upload (such as a passport scan
            and photograph).
          </li>
          <li>
            <Term>Parent Travel Assist.</Term> If you post a request or offer:
            your name and contact details, the route, date and airline,
            languages spoken, your notes and amount, and, for a family request,
            your relative&apos;s name, age, your relationship and the help or
            mobility support they need. If you verify your identity: your legal
            name, date of birth, phone number and a photo ID document. If you
            report a safety concern: what you tell us.
          </li>
          <li>
            <Term>Deal emails.</Term> Your email address and a record of when
            and how you agreed to receive them.
          </li>
          <li>
            <Term>WhatsApp and phone.</Term> Your number, name as shown on
            WhatsApp, and our conversation with you.
          </li>
          <li>
            <Term>Technical data.</Term> Our hosting provider records your IP
            address, browser type and the pages requested, to deliver and
            secure the site. We store your cookie choice and your language
            choice on your device. With your consent only, analytics tools
            record how the site is used (see our{" "}
            <LegalLink href="/cookie-policy">Cookie Policy</LegalLink>).
          </li>
        </Ul>
        <P>
          If you give us details about other travellers (for example family
          members, or a parent for Parent Travel Assist), please make sure they
          know you are sharing them with us and point them to this policy.
        </P>
      </>
    ),
  },
  {
    id: "sensitive-data",
    heading: "3. Health, mobility and criminal-record information",
    content: (
      <>
        <P>
          Some of what you may tell us is special category or criminal offence
          data under UK GDPR:
        </P>
        <Ul>
          <li>
            Health and mobility needs, such as a wheelchair request for a
            flight or the support a relative needs on Parent Travel Assist.
          </li>
          <li>
            Whether you have a criminal conviction, which the UAE visa
            application asks.
          </li>
        </Ul>
        <P>
          We only collect this when you choose to give it, and only with your
          explicit consent, which we ask for separately before you give it (UK GDPR Article
          9(2)(a), and for criminal offence data the consent condition in
          Schedule 1 of the Data Protection Act 2018). We use it only to arrange
          the help or application you asked for, share it only with the airline,
          the UAE visa authorities or the matched helper who needs it, and you
          can withdraw your consent at any time by emailing {mail}. If you do,
          we may not be able to continue with that request.
        </P>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    heading: "4. How and why we use it",
    content: (
      <>
        <P>Under UK GDPR we need a lawful basis for each use:</P>
        <Ul>
          <li>
            <Term>To quote for, book and look after your flights</Term> —
            including changes, cancellations, refunds and airline
            notifications (performing our contract with you, or steps you ask
            for before it).
          </li>
          <li>
            <Term>To prepare and submit your visa application</Term> and keep
            you updated (contract; explicit consent for criminal-record
            answers).
          </li>
          <li>
            <Term>To run Parent Travel Assist</Term> — reviewing posts,
            publishing the shortened listing you asked for, introducing
            matches and handling safety reports (contract; explicit consent
            for health and mobility details; our legitimate interest in
            keeping members safe).
          </li>
          <li>
            <Term>To answer your messages and quote requests</Term> (our
            legitimate interest in replying to enquiries, or steps before a
            contract).
          </li>
          <li>
            <Term>To keep booking, payment and accounting records</Term> (legal
            obligation).
          </li>
          <li>
            <Term>To send deal emails</Term> (your consent, which you can
            withdraw at any time).
          </li>
          <li>
            <Term>To keep the site and portal secure</Term>, prevent fraud and
            fix problems (legitimate interests).
          </li>
          <li>
            <Term>To measure how the site is used</Term>, only if you allow
            analytics cookies (consent).
          </li>
          <li>
            <Term>To handle complaints and legal claims</Term> (legitimate
            interests; legal obligation).
          </li>
        </Ul>
        <P>
          We do not make decisions about you by purely automated means, and we
          do not use your data for profiling or targeted advertising.
        </P>
      </>
    ),
  },
  {
    id: "marketing",
    heading: "5. Deal emails and marketing",
    content: (
      <P>
        We only send deal emails if you ticked the opt-in box when you signed
        up. Every email has an unsubscribe link, or you can email {mail}. We
        never send marketing by WhatsApp or text unless you ask us to, and we
        never sell or rent our mailing list. Booking messages (confirmations,
        schedule changes) are not marketing and are sent whether or not you
        have opted in.
      </P>
    ),
  },
  {
    id: "sharing",
    heading: "6. Who we share it with",
    content: (
      <>
        <P>We share personal data only where needed to provide what you asked for:</P>
        <Ul>
          <li>
            <Term>Airlines and their ticketing systems</Term>, to book and issue
            your ticket. Airlines may pass passenger details to border and
            immigration authorities, as the law requires.
          </li>
          <li>
            <Term>UAE immigration authorities</Term>, and any authorised
            application channel we must use, to submit your visa application.
          </li>
          <li>
            <Term>Other Parent Travel Assist members</Term>: only the shortened
            listing you agreed to publish (first name and last initial, route,
            date, airline and amount), and to a matched member only the details
            needed for the introduction you both agreed to.
          </li>
          <li>
            <Term>Our service providers</Term>, who process data for us under
            contract: Netlify (hosting the website), Vercel (hosting the
            portal), Supabase (the
            portal&apos;s database, sign-in and private document storage),
            Resend (delivering emails sent from our website forms), our
            business email provider, WhatsApp (Meta) for chats you start with
            us, our card payment provider and bank for payments, and — only
            with your consent — Google Analytics and Trustpilot&apos;s review
            widget.
          </li>
          <li>
            <Term>Professional advisers, insurers, and authorities</Term> such
            as HMRC or the police, where the law requires it or to protect
            someone&apos;s safety.
          </li>
          <li>
            <Term>Wicket Travel Holidays</Term>, only if you ask us to pass on a
            hotel, car hire or holiday enquiry.
          </li>
        </Ul>
        <P>We do not sell your personal data.</P>
      </>
    ),
  },
  {
    id: "international-transfers",
    heading: "7. International transfers",
    content: (
      <P>
        Some providers (such as Netlify, Vercel, Supabase, Resend, Meta and Google)
        may store or access data outside the UK, for example in the United
        States. We rely on UK adequacy regulations (including the UK–US data
        bridge) or the UK International Data Transfer Agreement or Addendum.
        When you book with an airline based abroad, or apply for a UAE visa,
        your details must go to that country to provide the service you asked
        for.
      </P>
    ),
  },
  {
    id: "retention",
    heading: "8. How long we keep it",
    content: (
      <Ul>
        <li>
          <Term>Bookings</Term> (traveller details, quotes, payment records,
          messages): 6 years after the end of the financial year in which you
          travelled, to meet tax and accounting rules and deal with claims;
          then deleted.
        </li>
        <li>
          <Term>Passport scans and other documents</Term> uploaded for a
          booking: deleted 3 months after your return date (or travel date for
          a one-way trip), unless a claim or dispute is open.
        </li>
        <li>
          <Term>Visa applications</Term> and their documents: deleted 6 months
          after the UAE authorities&apos; decision; payment records are kept
          as booking records.
        </li>
        <li>
          <Term>Parent Travel Assist</Term>: listings come off the board once
          the travel date has passed or you withdraw them; posts and messages
          are deleted 12 months after the travel date. Photo ID documents are
          deleted within 30 days of our verification decision (we keep only the
          result). Safety reports are kept for up to 6 years.
        </li>
        <li>
          <Term>Contact and quote messages</Term> that don&apos;t lead to a
          booking: up to 24 months, then deleted.
        </li>
        <li>
          <Term>Portal accounts</Term>: until you ask us to close yours, or
          after 3 years without a sign-in or booking (bookings themselves are
          kept as above).
        </li>
        <li>
          <Term>Deal emails</Term>: until you unsubscribe. We then keep only
          your email address on a do-not-contact list, so we don&apos;t email
          you again.
        </li>
        <li>
          <Term>Your cookie choice</Term>: 6 months, then we ask again.
          Analytics data, if you allowed it: no more than 14 months.
        </li>
      </Ul>
    ),
  },
  {
    id: "security",
    heading: "9. Keeping it secure",
    content: (
      <P>
        The website and portal use encrypted connections (HTTPS). Documents
        you upload are kept in private storage that only you and our team can
        open, through links that expire. Staff access is limited to what each
        person needs. We never ask for your full card details by WhatsApp or
        email. If a personal data breach is likely to put you at risk, we will
        tell you and the ICO as the law requires.
      </P>
    ),
  },
  {
    id: "your-rights",
    heading: "10. Your rights",
    content: (
      <>
        <P>Under UK data protection law you can ask us to:</P>
        <Ul>
          <li>give you a copy of the personal data we hold about you (access);</li>
          <li>correct anything inaccurate (rectification);</li>
          <li>delete your data where we no longer need it (erasure);</li>
          <li>restrict how we use it, or object to a use based on our legitimate interests;</li>
          <li>give you your data in a portable format;</li>
          <li>stop marketing at any time, and withdraw any consent you gave.</li>
        </Ul>
        <P>
          Email {mail}. It&apos;s free, and we reply within one month (we may
          ask for proof of identity first). Some data we must keep by law, for
          example booking and payment records, and we&apos;ll tell you if that
          applies.
        </P>
      </>
    ),
  },
  {
    id: "children",
    heading: "11. Children",
    content: (
      <P>
        Bookings must be made by an adult (18 or over). We process children&apos;s
        details only as travellers on a booking made by their parent or
        guardian. Our deal emails, portal accounts and Parent Travel Assist
        posts are for adults only.
      </P>
    ),
  },
  {
    id: "complaints",
    heading: "12. Complaints",
    content: (
      <P>
        If you are unhappy with how we have handled your data, please tell us
        first at {mail} so we can put it right. You can also complain to the
        Information Commissioner&apos;s Office:{" "}
        <LegalLink href="https://ico.org.uk/make-a-complaint/" external>
          ico.org.uk/make-a-complaint
        </LegalLink>{" "}
        or 0303 123 1113.
      </P>
    ),
  },
  {
    id: "changes",
    heading: "13. Changes to this policy",
    content: (
      <P>
        We update this policy when what we do changes, and show the date at
        the top. If a change affects how we use data you have already given
        us, we will tell you before it applies.
      </P>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lead="What personal data we collect when you book with Wicket Travel, why, who we share it with, how long we keep it, and your rights."
      path="/privacy"
      sections={sections}
      intro={
        <>
          <p>
            <strong>In short:</strong> we collect what we need to book your
            flights, visas and Parent Travel Assist matches, share it only with
            the airlines, authorities and providers that make that possible,
            never sell it, and delete it on a fixed schedule.
          </p>
          <p>
            Optional cookies stay off unless you allow them. Health,
            mobility and criminal-record details are only taken with your
            explicit consent.
          </p>
        </>
      }
    />
  );
}
