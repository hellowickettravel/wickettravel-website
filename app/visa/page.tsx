import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  MessageCircle,
  PhoneCall,
  Plus,
  Send,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisaEnquiryForm from "@/components/VisaEnquiryForm";
import { PERKS } from "@/lib/visa";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import {
  AREA_SERVED_UAE,
  AREA_SERVED_UK,
  BUSINESS,
  OG_BASE,
  ORGANIZATION_ID,
  SITE_URL,
  TWITTER_BASE,
} from "@/lib/seo";
import { PHONE_LINK, WHATSAPP_URL } from "@/lib/links";

/**
 * /visa — the dedicated Dubai / UAE visa page.
 *
 * The enquiry form here is the SAME component the homepage banner opens in a
 * modal (components/VisaEnquiryForm.tsx): identical fields, validation and
 * multipart POST to /api/visa-enquiry. The only difference is that it sits
 * inline on the page, where the supporting content around it can do the
 * reassurance work a modal has no room for.
 *
 * The hero is written out rather than reusing <PageHero>: this is a conversion
 * page, so it needs a CTA pair and a photo, which PageHero (a title/lead banner
 * for the static content pages) deliberately does not take. Every token below
 * is PageHero's — same navy gradient, same breadcrumb treatment — so it reads
 * as the same family, not a new one.
 *
 * UAE-only service, so no country picker; and no prices anywhere, matching the
 * rest of the site.
 */

export const metadata: Metadata = {
  title: "Dubai Visa Help",
  description:
    "UAE tourist and visit visa help from the UK. Eligibility checked first, documents reviewed by a visa expert, and a real person calls you back within 2 hours.",
  alternates: { canonical: "/visa" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/visa`,
    title: "Dubai Visa Help | UAE Tourist & Visit Visas — Wicket Travel",
    description:
      "Applying for a UAE tourist or visit visa from the UK? Wicket Travel checks your eligibility, reviews your documents and calls you back within 2 hours.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Dubai Visa Help | UAE Tourist & Visit Visas",
    description:
      "UAE tourist and visit visas handled end to end from the UK — no embassy appointment, and a callback within 2 hours.",
  },
};

const VISA_FAQ = [
  {
    question: "How long does a Dubai visa take to process?",
    answer:
      "Most UAE tourist and visit visa applications are processed within a few working days once your documents have passed our review. Processing times are set by the UAE authorities rather than by us, so instead of quoting a headline number your visa expert gives you a realistic window for your specific case on the callback — and keeps you updated until the visa is issued.",
  },
  {
    question: "What documents do I need for a UAE tourist visa?",
    answer:
      "Typically a passport valid for at least six months from your travel date, a clear passport-style photograph, proof of your UK status if you are not a British passport holder (for example a BRP or share code), and your travel and accommodation details. You do not send anything through this form — your expert confirms the exact list for your case on the callback, then reviews each document before anything is submitted.",
  },
  {
    question: "What is the difference between a tourist visa and a visit visa?",
    answer:
      "A tourist visa covers a short leisure trip and is issued for a fixed stay, usually 30 or 60 days. A visit visa is normally used when you are visiting family or friends in the UAE, or staying longer, and generally involves a host or sponsor in the country. If you are not sure which one fits, choose \"Not sure yet\" on the enquiry form — working that out is part of the eligibility check.",
  },
  {
    question: "I have been refused a UAE visa before. Can you still help?",
    answer:
      "Yes, and please tell us in the notes when you enquire. A previous refusal does not automatically rule out a new application, but it does change how the application should be prepared and presented. Because we check eligibility before you pay, you will know where you stand before committing to an application that is unlikely to succeed.",
  },
  {
    question: "Do I have to apply in person or visit an embassy?",
    answer:
      "No. UAE tourist and visit visas are handled electronically, so there is no embassy appointment and no travelling to an office. Everything is done remotely with your Wicket Travel visa expert by phone, WhatsApp and email, and the approved visa arrives by email.",
  },
  {
    question: "Can you arrange visas for my family or a group?",
    answer:
      "Yes. Mention how many travellers you are applying for in the notes on the enquiry form and your expert will handle the whole group together on a single callback, so you are not repeating the same details application by application.",
  },
];

const STEPS = [
  {
    icon: Send,
    step: "01",
    title: "Send your enquiry",
    body: "One short form — visa type, your name and how to reach you. No account, no documents and no payment at this stage.",
  },
  {
    icon: ClipboardCheck,
    step: "02",
    title: "Eligibility & document review",
    body: "A UAE visa expert checks whether your case qualifies and reviews every document before anything is submitted.",
  },
  {
    icon: PhoneCall,
    step: "03",
    title: "A real person calls you back",
    body: "Within 2 hours. They confirm your details, answer your questions and tell you exactly what to send next.",
  },
  {
    icon: BadgeCheck,
    step: "04",
    title: "Your visa is processed",
    body: "We prepare and submit the application, keep you posted on progress, and send the approved visa straight to your inbox.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/visa#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Dubai Visa",
          item: `${SITE_URL}/visa`,
        },
      ],
    },
    {
      /* `areaServed` carries both countries deliberately: the applicant is in
         the UK, the visa is for the UAE, and the service only makes sense as
         the pair. No processing time, fee or approval rate is asserted —
         those are set by the UAE authorities, as the page copy itself says. */
      "@type": "Service",
      "@id": `${SITE_URL}/visa#service`,
      name: "UAE tourist and visit visa assistance",
      serviceType: "Visa application assistance",
      url: `${SITE_URL}/visa`,
      description:
        "Wicket Travel prepares and submits Dubai and UAE tourist and visit visa applications for travellers in the UK — eligibility checked before you commit, every document reviewed by a specialist, and the application handled remotely with no embassy appointment.",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: [AREA_SERVED_UK, AREA_SERVED_UAE],
      audience: {
        "@type": "Audience",
        audienceType: "UK-based travellers applying for a UAE visa",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${SITE_URL}/visa#enquiry`,
        servicePhone: {
          "@type": "ContactPoint",
          telephone: BUSINESS.phone,
          contactType: "customer service",
          areaServed: "GB",
          availableLanguage: ["English", "Hindi", "Urdu", "Arabic"],
        },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/visa#faq`,
      mainEntity: VISA_FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function VisaPage() {
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
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900 py-12 sm:py-16">
          <div className="container-page relative">
            <Reveal>
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 t-label-3 text-primary-200">
                  <li>
                    <Link
                      href="/"
                      className="rounded-xs transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight
                      className="h-3.5 w-3.5 text-primary-500"
                      aria-hidden="true"
                    />
                    <span aria-current="page" className="text-text-on-dark">
                      Dubai Visa
                    </span>
                  </li>
                </ol>
              </nav>
            </Reveal>

            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
              <Reveal>
                <h1 className="t-h1 max-w-2xl text-text-on-dark">
                  Your UAE tourist or visit visa, handled by real people.
                </h1>
                <p className="t-body-lg mt-4 max-w-xl text-primary-100">
                  Wicket Travel prepares and submits Dubai and UAE visa
                  applications for travellers in the UK — eligibility checked
                  first, documents reviewed by a specialist, and a real person
                  on the phone from start to finish.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#enquiry"
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-accent-500 px-8 py-4 t-label-1 text-text-on-dark shadow-e2 shadow-accent-500/30 transition-colors hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                  >
                    Start your visa enquiry
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a
                    {...PHONE_LINK}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-000/20 bg-neutral-000/5 px-8 py-4 t-label-2 text-text-on-dark transition-colors hover:bg-neutral-000/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                  >
                    <PhoneCall className="h-4 w-4" aria-hidden="true" />
                    {BUSINESS.phoneDisplay}
                  </a>
                </div>

                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-000/5 px-4 py-2 t-label-3 text-primary-100 ring-1 ring-neutral-000/10">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  We handle UAE visas today — more destinations coming soon.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="hidden lg:block">
                <div className="relative h-80 w-[26rem] overflow-hidden rounded-lg ring-1 ring-neutral-000/15">
                  <Image
                    src="/cities/dubai.jpg"
                    alt="The Dubai skyline at dusk"
                    fill
                    sizes="416px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Why Wicket Travel — trust strip, not another card grid ────── */}
        <section
          aria-labelledby="visa-why-heading"
          className="section bg-neutral-000"
        >
          <div className="container-page">
            <Reveal className="section-lead text-center">
              <h2 id="visa-why-heading" className="t-h2 text-primary-800">
                Why travellers hand us their Dubai visa
              </h2>
              <p className="t-body mt-4 text-text-secondary">
                Three promises that decide whether a visa application is worth
                starting at all — checked before you commit, not after.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mx-auto mt-10 max-w-4xl">
              <ul className="card grid divide-y divide-neutral-300 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {PERKS.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-3 px-6 py-6 sm:flex-col sm:items-center sm:px-8 sm:text-center"
                  >
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 text-accent-500 sm:h-6 sm:w-6"
                      aria-hidden="true"
                    />
                    <span className="t-label-1 text-primary-800 sm:mt-3">
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section
          aria-labelledby="visa-steps-heading"
          className="section bg-sand-500"
        >
          <div className="container-page">
            <Reveal className="section-lead text-center">
              <h2 id="visa-steps-heading" className="t-h2 text-primary-800">
                How your visa application works
              </h2>
              <p className="t-body mt-4 text-text-on-sand">
                Four steps, one expert, no forms to chase. You never send a
                document into a void — a person reviews every one.
              </p>
            </Reveal>

            <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(({ icon: Icon, step, title, body }) => (
                <StaggerItem key={step} className="h-full">
                  <div className="card h-full p-8">
                    <span className="grid h-12 w-12 place-items-center rounded-md bg-primary-050 text-primary-700">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div className="mt-6 t-overline text-accent-600">
                      Step {step}
                    </div>
                    <h3 className="t-h3 mt-2 text-primary-800">{title}</h3>
                    <p className="t-body-sm mt-2 text-text-secondary">{body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── The real enquiry form, inline ────────────────────────────── */}
        <section
          id="enquiry"
          aria-labelledby="visa-form-heading"
          className="section scroll-mt-16 bg-neutral-000"
        >
          <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-12">
            <Reveal>
              <div className="card overflow-hidden">
                <div className="bg-primary-800 px-6 py-6 sm:px-8">
                  <h2
                    id="visa-form-heading"
                    className="t-h3 text-text-on-dark"
                  >
                    Start your Dubai visa enquiry
                  </h2>
                  <p className="mt-2 flex items-center gap-2 t-body-sm text-primary-100">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Our expert contacts you within 2 hours.
                  </p>
                </div>
                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  <VisaEnquiryForm idPrefix="vp" />
                </div>
              </div>
            </Reveal>

            {/* Supporting column — the reassurance a modal has no room for. */}
            <Reveal delay={0.1} className="lg:sticky lg:top-24">
              <div className="card p-6 sm:p-8">
                <h3 className="t-h4 text-primary-800">What happens next</h3>
                <ol className="mt-4 space-y-4">
                  {[
                    "We read your enquiry and check the basics against UAE requirements.",
                    "A visa expert calls you back within 2 hours on the number you give us.",
                    "They confirm the exact documents for your case — nothing is uploaded here.",
                  ].map((line, i) => (
                    <li key={line} className="flex gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-050 t-label-3 text-primary-700">
                        {i + 1}
                      </span>
                      <span className="t-body-sm text-text-secondary">
                        {line}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="card mt-4 p-6 sm:p-8">
                <h3 className="t-h4 text-primary-800">
                  Would rather just talk?
                </h3>
                <p className="t-body-sm mt-2 text-text-secondary">
                  Our team answers 24/7 — call or message and we can take your
                  visa enquiry over the phone instead.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <a
                    {...PHONE_LINK}
                    className="btn btn-secondary w-full"
                  >
                    <PhoneCall className="h-4 w-4" aria-hidden="true" />
                    {BUSINESS.phoneDisplay}
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline w-full"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Message us on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Visa FAQ — same native <details> accordion as components/Faq ── */}
        <section
          id="visa-faq"
          aria-labelledby="visa-faq-heading"
          className="section scroll-mt-16 bg-sand-500"
        >
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 id="visa-faq-heading" className="t-h2 text-primary-800">
                Dubai visa questions, answered
              </h2>
              <p className="t-body mt-4 text-text-on-sand">
                The things travellers ask us most before starting a UAE tourist
                or visit visa application.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl divide-y divide-neutral-300 overflow-hidden rounded-lg border border-neutral-300/80 bg-neutral-000 shadow-e1">
              {VISA_FAQ.map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-6 text-left font-bold text-primary-800 transition-colors hover:bg-primary-050/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden">
                    <span className="t-body">{item.question}</span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-050 text-primary-700 transition-all duration-200 group-open:rotate-45 group-open:bg-accent-500 group-open:text-text-on-dark">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-text-secondary">
                    <p className="t-body-sm">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="#enquiry"
                className="btn btn-primary px-8 py-4"
              >
                Start your visa enquiry
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              {/* Internal link to the flight funnel — most visitors here are
                  flying to Dubai, and nothing else on this page pointed at it. */}
              <p className="t-body-sm mt-6 text-text-on-sand">
                Still need the flight?{" "}
                <Link
                  href="/flights"
                  className="t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                >
                  Search fares to Dubai from the UK
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
