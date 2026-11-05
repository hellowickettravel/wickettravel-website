import LegalPage, { legalMetadata, Term } from "@/components/LegalPage";
import { LegalLink, P, Ul, type LegalSection } from "@/components/LegalLayout";
import { COMPANY } from "@/lib/legal";
import { WHATSAPP_URL } from "@/lib/links";

export const metadata = legalMetadata({
  title: "Parent Travel Assist Terms",
  description:
    "The terms of Parent Travel Assist, Wicket Travel's free introduction service for families and travellers on the same flight: what we check, what we don't, payments between members, safety and reporting.",
  path: "/parent-travel-assist-terms",
});

const mail = <LegalLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</LegalLink>;
const wa = <LegalLink href={WHATSAPP_URL} external>{COMPANY.phoneDisplay}</LegalLink>;

const sections: LegalSection[] = [
  {
    id: "what-it-is",
    heading: "1. What Parent Travel Assist is",
    content: (
      <>
        <P>
          Parent Travel Assist is a free introduction service run by{" "}
          {COMPANY.legalName} (company number {COMPANY.number}). It puts
          families whose relative is flying alone (&ldquo;families&rdquo;) in
          touch with travellers who are already booked on the same flight and
          are willing to help (&ldquo;helpers&rdquo;).
        </P>
        <P>
          <Term>We make introductions only.</Term> We are not a care provider,
          an escort or assistance service, an employment agency or an airline.
          Helpers are members of the public travelling for their own reasons,
          not our staff or agents, and each member travels independently.
          Airport and airline special assistance (such as wheelchairs) must be
          booked with the airline; we can help you request it if we booked your
          flight.
        </P>
      </>
    ),
  },
  {
    id: "who-can-use",
    heading: "2. Who can use it",
    content: (
      <Ul>
        <li>Members must be 18 or over. A family member posts on behalf of the relative who is travelling, with that relative&apos;s agreement.</li>
        <li>Helpers must already hold a confirmed booking on the route and date they post.</li>
        <li>You must give accurate information, use your real name, and keep your post up to date — withdraw it if your plans change.</li>
        <li>You may need a portal account, and we may ask you to verify your identity with photo ID before an introduction.</li>
      </Ul>
    ),
  },
  {
    id: "checks",
    heading: "3. What we check — and what we don't",
    content: (
      <>
        <P>
          A Wicket Travel coordinator reads every post before it goes anywhere,
          speaks to the people involved, confirms that a helper is booked on the
          flight they posted, and talks the family through who their relative
          would travel with before any introduction is made.
        </P>
        <P>
          <Term>This is a human review, not a background check.</Term> We do not
          carry out DBS or criminal-records checks, and we do not supervise
          anyone during the journey. Families make the final decision about
          whether to go ahead, and we will arrange a call between both sides
          first if you would like one.
        </P>
      </>
    ),
  },
  {
    id: "board",
    heading: "4. The community board",
    content: (
      <>
        <P>
          If you ask for your post to appear on the public board, we show only
          a shortened listing: first name and last initial, route, date,
          airline and the amount. Your phone number, email address, surname and
          notes are never shown, and nobody can contact you from a listing —
          every introduction goes through our team.
        </P>
        <P>
          We may edit or decline any post, and remove posts that break these
          terms, look misleading, or whose travel date has passed. Example
          listings marked &ldquo;Example&rdquo; are illustrations, not real
          members.
        </P>
      </>
    ),
  },
  {
    id: "payments",
    heading: "5. Payments between members",
    content: (
      <>
        <P>
          Posting and introductions are free. Any amount a family offers or a
          helper asks for is agreed and paid directly between the two members.
          Wicket Travel does not hold, process, guarantee or take a share of
          that money, and is not a party to any arrangement between members.
        </P>
        <Ul>
          <li>Agree the amount and what it covers before the journey.</li>
          <li>We recommend paying only after the journey, or in part before and part after.</li>
          <li>Never pay anyone who contacts you claiming to be from Wicket Travel and asks for money to &ldquo;secure&rdquo; a match. We never charge for introductions.</li>
        </Ul>
      </>
    ),
  },
  {
    id: "conduct",
    heading: "6. Conduct",
    content: (
      <>
        <P>All members agree to:</P>
        <Ul>
          <li>treat each other with respect, and respect the relative&apos;s wishes, privacy and belongings;</li>
          <li>never ask a relative to carry anything for them, or to hand over documents, money or bank details;</li>
          <li>follow the airline&apos;s and airport&apos;s rules and staff instructions;</li>
          <li>use other members&apos; details only for this journey, and not share them.</li>
        </Ul>
        <P>
          We may suspend or remove anyone who breaks these rules or whom we
          reasonably believe is a risk to others.
        </P>
      </>
    ),
  },
  {
    id: "safety",
    heading: "7. Safety and reporting",
    content: (
      <>
        <P>
          <Term>If anyone is in immediate danger, call 999</Term> (or the local
          emergency number abroad), and tell airline or airport staff.
        </P>
        <P>
          To report a safety concern about a member or a listing, email {mail}{" "}
          with &ldquo;Parent Travel Assist: safety concern&rdquo; in the
          subject, or WhatsApp {wa}. Include the listing reference if you have
          it. We act on safety reports the same day: we pause the listing while
          we look into it, can remove a member from the service, and will share
          information with the police or other authorities where we believe
          someone is at risk.
        </P>
      </>
    ),
  },
  {
    id: "health-data",
    heading: "8. Health and personal information",
    content: (
      <P>
        Details of a relative&apos;s age, health or mobility needs are only
        collected with explicit consent, ticked on the form, and are shared
        only with a matched helper as needed for the journey. Identity
        documents are deleted within 30 days of our verification decision.
        See our <LegalLink href="/privacy">Privacy Policy</LegalLink>.
      </P>
    ),
  },
  {
    id: "liability",
    heading: "9. Our responsibility",
    content: (
      <P>
        We will run the service with reasonable care and skill. Because members
        travel independently and arrange things between themselves, we are not
        responsible for what members do or fail to do, for arrangements or
        payments between them, or for an introduction that doesn&apos;t work
        out. Nothing in these terms limits liability for death or personal
        injury caused by our negligence, for fraud, or anything else that
        cannot be limited by law.
      </P>
    ),
  },
  {
    id: "general",
    heading: "10. General",
    content: (
      <P>
        We may change or pause the service, or update these terms (the date at
        the top shows when). Our general{" "}
        <LegalLink href="/terms">Terms &amp; Conditions</LegalLink> also apply
        to your use of the site; if they conflict, these terms apply to
        Parent Travel Assist. Complaints follow our{" "}
        <LegalLink href="/complaints">complaints procedure</LegalLink>. These
        terms are governed by the law of England and Wales.
      </P>
    ),
  },
];

export default function ParentTravelAssistTermsPage() {
  return (
    <LegalPage
      title="Parent Travel Assist Terms"
      lead="The terms of our free introduction service for families and travellers on the same flight."
      path="/parent-travel-assist-terms"
      sections={sections}
      intro={
        <>
          <p>
            <strong>In short:</strong> we introduce families and travellers on the
            same flight, for free. A coordinator reviews every post, but we
            don&apos;t run DBS checks, and members travel independently.
          </p>
          <p>
            Any payment is agreed and made directly between members. If anyone is
            in danger, call 999; to report a concern, email or WhatsApp us.
          </p>
        </>
      }
    />
  );
}
