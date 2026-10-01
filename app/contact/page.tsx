import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/SocialIcons";
import {
  ALWAYS_OPEN_HOURS,
  BUSINESS,
  OG_BASE,
  ORGANIZATION_ID,
  SITE_URL,
  TWITTER_BASE,
} from "@/lib/seo";
import { PHONE_LINK, WHATSAPP_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call or WhatsApp Wicket Travel on +44 7417 564704, email info@wickettravel.com, or send a message. Real people, 24/7, for anything to do with your flight.",
  alternates: { canonical: "/contact" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/contact`,
    title: "Contact Wicket Travel",
    description:
      "Call, WhatsApp, email or send us a message — Wicket Travel is here to help with your flight booking.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Contact Wicket Travel",
    description:
      "Phone and WhatsApp answered 24/7, email within one business day — reach a real person about your booking.",
  },
};

/* ContactPage node alongside the breadcrumb, carrying the same NAP the page
   shows on screen and pointing back at the homepage's Organization @id. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/contact#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: `${SITE_URL}/contact`,
        },
      ],
    },
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contact#webpage`,
      url: `${SITE_URL}/contact`,
      name: "Contact Wicket Travel",
      description:
        "Phone, WhatsApp, email and postal contact details for Wicket Travel Limited, plus a message form.",
      inLanguage: "en-GB",
      about: { "@id": ORGANIZATION_ID },
      mainEntity: {
        "@type": "ContactPoint",
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        contactType: "customer service",
        areaServed: "GB",
        availableLanguage: ["English", "Hindi", "Urdu", "Arabic"],
        hoursAvailable: ALWAYS_OPEN_HOURS,
      },
    },
  ],
};

const FULL_ADDRESS = `${BUSINESS.streetAddress}, ${BUSINESS.addressLocality}, ${BUSINESS.addressRegion}, ${BUSINESS.postalCode}, UK`;

const SOCIALS = [
  { icon: XIcon, label: "X (Twitter)", href: BUSINESS.sameAs[0] },
  { icon: InstagramIcon, label: "Instagram", href: BUSINESS.sameAs[1] },
  { icon: FacebookIcon, label: "Facebook", href: BUSINESS.sameAs[2] },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main className="flex-1">
        <PageHero
          title="We're here to help, day or night."
          lead="Questions about a fare, an existing booking, or just want to talk to a real person before you pay? Reach us however suits you best."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        />

        <section className="section bg-neutral-000">
          <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Contact details */}
            <div>
              <h2 className="t-h2 text-balance text-primary-800">Talk to a real person</h2>

              {/* `card-hover` is on the three cards that are links, and off the
                  two that are not — a hover affordance on a static panel is a
                  promise the card can't keep. */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a
                  {...PHONE_LINK}
                  className="card card-hover group flex h-full items-start gap-4 p-6"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary-050 text-primary-700 transition-colors duration-200 group-hover:bg-accent-500 group-hover:text-text-on-dark">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block t-label-2 text-primary-800">Call us on WhatsApp</span>
                    <span className="mt-1 block t-body-sm text-text-secondary">{BUSINESS.phoneDisplay}</span>
                    <span className="mt-1 block t-label-3 text-success">Voice or video call, 24/7</span>
                  </span>
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-hover group flex h-full items-start gap-4 p-6"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary-050 text-primary-700 transition-colors duration-200 group-hover:bg-accent-500 group-hover:text-text-on-dark">
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block t-label-2 text-primary-800">WhatsApp us</span>
                    <span className="mt-1 block t-body-sm text-text-secondary">{BUSINESS.phoneDisplay}</span>
                    <span className="mt-1 block t-label-3 text-success">Fastest response</span>
                  </span>
                </a>

                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="card card-hover group flex h-full items-start gap-4 p-6"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary-050 text-primary-700 transition-colors duration-200 group-hover:bg-accent-500 group-hover:text-text-on-dark">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block t-label-2 text-primary-800">Email us</span>
                    <span className="mt-1 block break-all t-body-sm text-text-secondary">{BUSINESS.email}</span>
                    <span className="mt-1 block t-label-3 text-text-secondary">Reply within 1 business day</span>
                  </span>
                </a>

                <div className="card flex h-full items-start gap-4 p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary-050 text-primary-700">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block t-label-2 text-primary-800">Our office</span>
                    <span className="mt-1 block t-body-sm text-text-secondary">{FULL_ADDRESS}</span>
                  </span>
                </div>
              </div>

              <div className="card mt-4 flex items-start gap-4 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary-050 text-primary-700">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block t-label-2 text-primary-800">Support hours</span>
                  <span className="mt-1 block t-body-sm text-text-secondary">
                    Phone &amp; WhatsApp: available 24/7. Email and enquiry
                    forms: answered within 1 business day.
                  </span>
                </span>
              </div>

              {/* Map */}
              <div className="mt-8">
                <div className="overflow-hidden rounded-lg border border-neutral-300/80 shadow-e1">
                  <iframe
                    title="Map showing the Wicket Travel Limited office area in Hounslow, London"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      FULL_ADDRESS
                    )}&z=15&output=embed`}
                    className="h-72 w-full sm:h-80"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FULL_ADDRESS)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                >
                  Open in Google Maps
                </a>
              </div>

              {/* Socials */}
              <div className="mt-8">
                <p className="t-label-2 text-primary-800">Follow us</p>
                <div className="mt-3 flex items-center gap-3">
                  {SOCIALS.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-10 w-10 place-items-center rounded-full bg-primary-050 text-primary-700 transition-colors duration-200 hover:bg-accent-500 hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card p-6 sm:p-8">
              {/* Was `t-h3 t-body-lg` — two type-scale classes on one element,
                  so the later definition in globals.css silently won and the
                  heading rendered at body weight. One class, one style. */}
              <h2 className="t-h3 text-primary-800">Send us a message</h2>
              <p className="t-body-sm mt-2 text-text-secondary">
                Fill in the form and it&apos;ll open in your email app,
                ready to send straight to our team.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
