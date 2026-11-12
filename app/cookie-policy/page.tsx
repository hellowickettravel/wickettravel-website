import LegalPage, { legalMetadata, Term } from "@/components/LegalPage";
import { LegalLink, P, Ul, type LegalSection } from "@/components/LegalLayout";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { COMPANY } from "@/lib/legal";
import { CONSENT_COOKIE } from "@/lib/consent";

export const metadata = legalMetadata({
  title: "Cookie Policy",
  description:
    "The cookies and similar technologies used on wickettravel.com, what each one does, how long it lasts, and how to change your choice.",
  path: "/cookie-policy",
});

const linkButton =
  "font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600";

/* Keep this table in step with lib/consent.ts and components/CookieConsent.tsx:
   any new optional tool needs a row here, a category there, and a bump of
   CONSENT_VERSION so everyone is asked again. */
const sections: LegalSection[] = [
  {
    id: "your-choice",
    heading: "1. Your choice",
    content: (
      <>
        <P>
          When you first visit, we ask whether you allow optional cookies. You
          can accept all, reject all, or choose by category. Optional cookies
          stay off until you allow them, and rejecting them doesn&apos;t stop
          you using any part of the site.
        </P>
        <P>
          Change your mind at any time:{" "}
          <CookieSettingsButton className={linkButton} />, or use the
          &ldquo;Cookie settings&rdquo; link at the bottom of every page. We ask
          again after 6 months.
        </P>
      </>
    ),
  },
  {
    id: "necessary",
    heading: "2. Necessary",
    content: (
      <>
        <Ul>
          <li>
            <Term>{CONSENT_COOKIE}</Term> — remembers your cookie choice and when
            you made it. Set by Wicket Travel, kept for 6 months.
          </li>
        </Ul>
        <P>
          This is needed for the site to respect your choice, so it doesn&apos;t
          need consent. Our hosting provider (Netlify) also processes your IP
          address to deliver pages and protect the site, without setting
          cookies.
        </P>
      </>
    ),
  },
  {
    id: "analytics",
    heading: "3. Analytics (optional)",
    content: (
      <>
        <P>
          If we run Google Analytics and you allow analytics, it sets:
        </P>
        <Ul>
          <li><Term>_ga</Term> — a random ID that tells visits from the same browser apart (2 years).</li>
          <li><Term>_ga_&lt;ID&gt;</Term> — keeps track of the current visit (2 years).</li>
        </Ul>
        <P>
          We switch off Google signals and ad personalisation, so this data is
          not used for advertising, and Google keeps it for no more than 14
          months. If you withdraw consent we delete these cookies from our
          domain and reload the page. If analytics is not running, nothing is
          set even when you allow it.
        </P>
      </>
    ),
  },
  {
    id: "reviews-widget",
    heading: "4. Reviews widget (optional)",
    content: (
      <P>
        With your consent we show Trustpilot&apos;s official widget, so our
        rating is always the live one. It loads from Trustpilot&apos;s servers,
        which may set their own cookies under{" "}
        <LegalLink href="https://legal.trustpilot.com/for-everyone/cookie-policy" external>
          Trustpilot&apos;s cookie policy
        </LegalLink>
        . Without consent you see a plain link to our Trustpilot page instead.
      </P>
    ),
  },
  {
    id: "other-servers",
    heading: "5. Images and links to other sites",
    content: (
      <>
        <P>
          Airline logos load from an airline-logo image service (pics.avs.io).
          Like any image on the web, it receives your IP address and browser
          details when your browser fetches a logo; it doesn&apos;t set cookies
          on our site. All our photos are served from our own domain.
        </P>
        <P>
          Our booking portal, WhatsApp, our social media pages and our sister
          company Wicket Travel Holidays are separate sites with their own
          cookie policies. We don&apos;t use advertising or tracking cookies, and
          we don&apos;t run advertising pixels.
        </P>
      </>
    ),
  },
  {
    id: "browser",
    heading: "6. Managing cookies in your browser",
    content: (
      <P>
        You can also block or delete cookies in your browser settings. If you
        delete {CONSENT_COOKIE}, we&apos;ll ask for your choice again. The
        ICO explains more at{" "}
        <LegalLink href="https://ico.org.uk/for-the-public/online/cookies/" external>
          ico.org.uk
        </LegalLink>
        .
      </P>
    ),
  },
  {
    id: "changes",
    heading: "7. Changes and contact",
    content: (
      <P>
        If we add a cookie or tool, we&apos;ll update this page and, where
        consent is needed, ask you again. Questions? Email{" "}
        <LegalLink href={`mailto:${COMPANY.email}`}>{COMPANY.email}</LegalLink>.
        See also our <LegalLink href="/privacy">Privacy Policy</LegalLink>.
      </P>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      lead="The cookies used on wickettravel.com, what each one does, and how to change your choice."
      path="/cookie-policy"
      sections={sections}
      intro={
        <p>
          <strong>In short:</strong> we use one necessary cookie to remember
          your choice. Analytics and the Trustpilot widget load only if you
          allow them. No advertising cookies, ever.
        </p>
      }
    />
  );
}
