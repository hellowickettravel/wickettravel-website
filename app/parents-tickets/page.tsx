import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Eye,
  EyeOff,
  HandHeart,
  Handshake,
  MessageCircle,
  PhoneCall,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AssistFamilyBoard from "@/components/AssistFamilyBoard";
import AssistFamilyHowItWorks from "@/components/AssistFamilyHowItWorks";
import ParentsEnquiryForm from "@/components/ParentsEnquiryForm";
import { Reveal } from "@/components/motion-primitives";
import {
  AREA_SERVED_UK,
  BUSINESS,
  OG_BASE,
  ORGANIZATION_ID,
  SITE_URL,
  TWITTER_BASE,
} from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/links";

/**
 * /parents-tickets — the dedicated home for Assist Family.
 *
 * WHAT THIS PAGE IS NOW. It was a long read: hero, two columns of prose about
 * how it works, a form, then — right at the bottom, past everything — a
 * marquee of listings nobody scrolled to. That order is backwards for this
 * audience. They are already running this service by hand, in WhatsApp
 * groups, where somebody posts "flying LHR→HYD Thursday, anyone need help?"
 * and someone else recognises the route and replies. What brings them to a
 * web page is the same question the group opens with — *who is flying, and
 * when* — so the board now comes first and everything else explains it
 * afterwards. The page reads in the order a visitor's questions actually
 * arrive:
 *
 *   1. who is on here right now?      → the board, searchable and filterable
 *   2. how does this actually work?   → the two lanes, side by side
 *   3. how do I get on it?            → the form
 *   4. can I trust it with my mother? → money, privacy and vetting, plainly
 *
 * The live listings are the product, so they are the hero's neighbour, not
 * its footnote. Everything about the board itself — the search, the two
 * facing columns, the departures rail, and what happens when the feed is
 * empty — lives in components/AssistFamilyBoard.tsx.
 *
 * The one thing this page has to get right is the privacy mechanic, so it is
 * stated in three separate places rather than once: in both "how it works"
 * lanes, beside the consent checkbox itself, and in the FAQ. A visitor who
 * reads only one of the three still learns that nothing is published unless
 * they tick the box, and that a person here makes every introduction.
 *
 * The only money anywhere on this page is the amount a poster sets themselves
 * (£0–100, the API's own range) — Wicket Travel neither charges for this nor
 * takes a cut, and no company price appears.
 */

/* The route stays /parents-tickets on purpose — it's already in the sitemap,
   JSON-LD @id chain and llms.txt with real indexing history, and changing the
   URL itself would need a 301 redirect to avoid throwing that away.
   Component/file names, the enquiry_type API contract and the
   /api/parent-ticket relay are untouched for the same reason: they're wired
   to the live portal backend, not display copy. */
export const metadata: Metadata = {
  title: "Assist Family",
  description:
    "See who's flying your route today. Assist Family is the board where families whose elderly relative is flying alone meet travellers already going the same way. Free to post, contact details never published.",
  alternates: { canonical: "/parents-tickets" },
  openGraph: {
    ...OG_BASE,
    url: `${SITE_URL}/parents-tickets`,
    title: "Assist Family | Who's flying your route today?",
    description:
      "Search the board by airport, date, airline or language. Families asking for a companion on one side, travellers already booked on the other — a coordinator makes every introduction.",
  },
  twitter: {
    ...TWITTER_BASE,
    title: "Assist Family | Who's flying your route today?",
    description:
      "The board where families flying an elderly relative alone meet travellers already on that route. Searchable, filterable, and nothing published unless you ask.",
  },
};



const FAQ = [
  {
    question: "How are helpers checked before a match is made?",
    answer:
      "Every post — from both sides — is read by a Wicket Travel coordinator before anything happens with it. We speak to the traveller, confirm they are genuinely booked on the route they have posted, and talk the family through who they would be travelling with before any introduction is made. We are honest about the limits of that: this is a human review by our team, not a criminal-records or DBS check, and we do not claim to have vetted anyone beyond it. Families always make the final call themselves, and we will happily arrange a phone call between both sides before anyone commits.",
  },
  {
    question: "How does the payment work between the two of you?",
    answer:
      "Directly, and entirely between the two of you. The family names the amount they are offering when they post (or the traveller names what they are asking), and the two sides confirm it between themselves once we have introduced them. Wicket Travel does not hold the money, process it, add to it or take a cut of it — there is no fee to post on this board and no charge for the introduction. If an amount is not right for you, say so before you agree; nobody is committed to anything until both sides are happy.",
  },
  {
    question: "What happens if nobody is flying that route yet?",
    answer:
      "Your post stays with our team and we keep looking — routes fill up as people book, so a quiet week is normal rather than a dead end. If you asked for it to appear on the community board, it also stays visible there so a traveller can find it directly. If your dates get close and we still have nobody suitable, we will tell you plainly rather than leaving you waiting, and we can look at airline-operated assistance for the flight instead.",
  },
  {
    question: "Is any of my information ever made public?",
    answer:
      "Only if you tick the community-board box, and even then only a shortened version: your first name and last initial, the route, the travel date and airline, any languages, the amount, and the short description of what is needed or offered — enough for a traveller to recognise their own flight, and no more. Your phone number, email address, surname, your relative's name and anything you wrote in the notes are never published; the feed on this page is built from the same shortened data whether you are a stranger or the person who posted it. Leave the box unticked and nothing at all appears publicly. Either way nobody can contact you off a listing, and no contact details are exchanged until both sides have agreed.",
  },
  {
    question: "Why not just use a WhatsApp group?",
    answer:
      "Plenty of people do, and this board exists because those groups work — it is the same idea with the parts that go wrong taken out. In a group, a request scrolls out of sight within an hour, only the people already in that one group ever see it, everybody's phone number is visible to everybody else by default, and nobody checks that the person replying is really on the flight. Here a post stays searchable by route and date until it is matched or withdrawn, it is visible to every family and traveller on the board rather than one chat, no contact detail is ever published, and a coordinator confirms the traveller's booking before an introduction is made. If your group already works for you, keep it — post here as well and you are simply in front of more people.",
  },
  {
    question: "How do I change or remove my post?",
    answer:
      "Call or WhatsApp us on the number on this page with the reference you were given when you posted, and we will update it or take it down. There is no account to log into and no self-service dashboard — the same person who reads your post is the one who edits or removes it, usually the same day. Withdrawing a post at any point, for any reason, is completely fine and nothing is charged.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/parents-tickets#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Assist Family",
          item: `${SITE_URL}/parents-tickets`,
        },
      ],
    },
    {
      /* Describes the introduction service Wicket Travel actually runs — the
         coordination and the match. Deliberately no `offers` node: the only
         money involved is the amount a family or traveller sets between
         themselves, which is not a Wicket Travel price and must not be
         published as one. */
      "@type": "Service",
      "@id": `${SITE_URL}/parents-tickets#service`,
      name: "Assist Family travel companion matching",
      serviceType: "Travel companion introduction service",
      url: `${SITE_URL}/parents-tickets`,
      description:
        "Wicket Travel connects families whose elderly relative is flying alone with travellers already booked on the same route. A coordinator reads every post by hand and makes every introduction; contact details are never published, and no personal detail appears publicly unless the poster asks for it.",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: AREA_SERVED_UK,
      audience: {
        "@type": "Audience",
        audienceType:
          "Families of elderly passengers flying alone, and travellers willing to accompany them",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${SITE_URL}/parents-tickets#post-to-the-board`,
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
      "@id": `${SITE_URL}/parents-tickets#faq`,
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function ParentsTicketsPage() {
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
        <section className="relative overflow-hidden bg-primary-800 py-12 sm:py-16">
          {/* Photograph as a full-bleed backdrop rather than a cropped inset:
              the picture is the emotional argument for the whole page, and at
              10% it never competes with the type in front of it. */}
          <div aria-hidden="true" className="absolute inset-0">
            <Image
              src="/support/airport-companion.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/85 to-primary-800/70" />
          </div>

          <div className="container-page relative">
            <nav aria-label="Breadcrumb" className="hero-rise">
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
                    Assist Family
                  </span>
                </li>
              </ol>
            </nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-16">
              <div>
                <p className="hero-rise t-overline text-accent-400">
                  The Assist Family board
                </p>
                <h1 className="hero-rise hero-rise-2 t-h1 mt-3 max-w-2xl text-balance text-text-on-dark">
                  Someone is already flying your route. Find them.
                </h1>
                <p className="hero-rise hero-rise-3 t-body-lg mt-4 max-w-xl text-pretty text-primary-100">
                  Families whose elderly relative is flying alone post the
                  journey. Travellers already booked on that route post the
                  flight. A coordinator here reads both and makes the
                  introduction — no contact detail is ever published.
                </p>

                <div className="hero-rise hero-rise-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#board"
                    className="inline-flex items-center justify-center gap-3 rounded-sm bg-accent-500 px-8 py-4 t-button text-text-on-dark shadow-e2 transition-colors hover:bg-accent-600 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                  >
                    <Search className="h-5 w-5" aria-hidden="true" />
                    Search the board
                  </a>
                  <a
                    href="#post-to-the-board"
                    className="inline-flex items-center justify-center gap-2 rounded-sm border border-neutral-000/25 bg-neutral-000/5 px-8 py-4 t-button text-text-on-dark transition-colors hover:bg-neutral-000/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-000/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
                  >
                    Post your journey
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Three promises, as a stack rather than a row of badges — on a
                  page about handing over a parent, these are the copy, not
                  decoration. */}
              <ul className="hero-rise hero-rise-4 space-y-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Contact details never published",
                    body: "First name and last initial only. Nobody can message you off a card.",
                  },
                  {
                    icon: BadgeCheck,
                    title: "Every post read by a person",
                    body: "A coordinator confirms the traveller is really booked on that flight.",
                  },
                  {
                    icon: HandHeart,
                    title: "Free to post, no cut taken",
                    body: "Any amount is set by you and paid directly between the two of you.",
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-3 rounded-md border border-neutral-000/15 bg-neutral-000/5 px-4 py-3"
                  >
                    <item.icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-400"
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block t-label-2 text-text-on-dark">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block t-caption text-primary-200">
                        {item.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── The board — first, because it is the product ─────────────── */}
        <section
          id="board"
          aria-labelledby="parents-board-heading"
          className="section scroll-mt-16 bg-neutral-000"
        >
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h2
                  id="parents-board-heading"
                  className="t-h2 text-primary-800"
                >
                  Who&rsquo;s flying, and when
                </h2>
                <p className="t-body mt-3 text-text-secondary">
                  {/* No "on the left / on the right": the two columns stack
                      below xl, where that would be a lie. */}
                  Search by airport, date, airline or language — families
                  asking on one side, travellers already booked on the other.
                  Recognise your own flight? Ask us for the introduction.
                </p>
              </div>
              <a
                href="#post-to-the-board"
                className="btn btn-primary shrink-0 px-6"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add your journey
              </a>
            </div>

            <div className="mt-8">
              <AssistFamilyBoard showColumnLinks />
            </div>
          </div>
        </section>

        {/* ── Why a board and not a group chat ─────────────────────────── */}
        <section
          aria-labelledby="parents-why-heading"
          className="bg-primary-800 py-12 md:py-16"
        >
          <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="t-overline text-accent-400">Why this exists</p>
              <h2
                id="parents-why-heading"
                className="t-h3 mt-3 text-text-on-dark"
              >
                It&rsquo;s the WhatsApp group, without the parts that go wrong
              </h2>
              <p className="t-body mt-4 text-primary-100">
                Families have been arranging this by hand for years — someone
                posts &ldquo;flying Thursday, anyone need help?&rdquo; and
                hopes the right person is still scrolling. Here the post stays
                searchable by route and date until it&rsquo;s matched, everyone
                on the board sees it rather than one chat, and not a single
                phone number is on display.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3 lg:w-[30rem]">
              {[
                { icon: Search, text: "Searchable by route and date, not buried in a scroll" },
                { icon: EyeOff, text: "No phone numbers on show, to anyone, ever" },
                { icon: BadgeCheck, text: "A coordinator checks the flight is real" },
              ].map((item) => (
                <li
                  key={item.text}
                  className="rounded-md border border-neutral-000/15 bg-neutral-000/5 p-4"
                >
                  <item.icon
                    className="h-5 w-5 text-accent-400"
                    aria-hidden="true"
                  />
                  <p className="t-body-sm mt-3 text-primary-100">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── How it works — two lanes ─────────────────────────────────── */}
        <section
          id="how-it-works"
          aria-labelledby="parents-how-heading"
          className="section scroll-mt-16 bg-sand-500"
        >
          <div className="container-page">
            <Reveal className="section-lead text-center">
              <h2 id="parents-how-heading" className="t-h2 text-primary-800">
                Two sides, one board
              </h2>
              <p className="t-body mt-4 text-text-on-sand">
                Families post the journey they need covered. Travellers post the
                one they are already taking. Our team is what joins the two —
                and the only thing that ever exchanges a contact detail.
              </p>
            </Reveal>

            <div className="mt-12">
              <AssistFamilyHowItWorks />
            </div>
          </div>
        </section>

        {/* ── The form ─────────────────────────────────────────────────── */}
        <section
          id="post-to-the-board"
          aria-labelledby="parents-form-heading"
          className="section scroll-mt-16 bg-neutral-000"
        >
          <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-12">
            <Reveal>
              <div className="card overflow-hidden">
                <div className="bg-primary-800 px-6 py-6 sm:px-8">
                  <h2
                    id="parents-form-heading"
                    className="t-h3 text-text-on-dark"
                  >
                    Post to the board
                  </h2>
                  <p className="mt-2 flex items-center gap-2 t-body-sm text-primary-100">
                    <Handshake
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    One form, either side. A coordinator reads every post by
                    hand.
                  </p>
                </div>
                <div className="px-6 py-6 sm:px-8 sm:py-8">
                  <ParentsEnquiryForm />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:sticky lg:top-24">
              <div className="card p-6 sm:p-8">
                <h3 className="t-h4 text-primary-800">
                  What is public, and what is not
                </h3>

                {/* Two short lists beat three paragraphs here: the question a
                    visitor is holding is literally "which of my details show
                    up?", and that is a list. The long-form version is in the
                    FAQ for anyone who wants it. */}
                <p className="mt-5 flex items-center gap-2 t-label-3 text-primary-800">
                  <Eye className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                  Shown — only if you tick the box
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {[
                    "First name + initial",
                    "Route",
                    "Date",
                    "Airline",
                    "Languages",
                    "Amount",
                  ].map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-primary-050 px-3 py-1 t-caption text-primary-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 flex items-center gap-2 t-label-3 text-primary-800">
                  <EyeOff className="h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                  Never shown, to anyone
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {[
                    "Phone number",
                    "Email",
                    "Surname",
                    "Their relative's name",
                    "Your notes",
                  ].map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-neutral-100 px-3 py-1 t-caption text-text-secondary line-through decoration-neutral-400"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 flex gap-2 border-t border-neutral-200 pt-4 t-body-sm text-text-secondary">
                  <Handshake className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
                  Nobody can message you off a listing. Introductions happen
                  through us, once both sides have agreed.
                </p>
              </div>

              <div className="card mt-4 p-6 sm:p-8">
                <h3 className="t-h4 text-primary-800">
                  Would rather just talk it through?
                </h3>
                <p className="t-body-sm mt-2 text-text-secondary">
                  Our team answers 24/7 and can take the whole thing over the
                  phone — no form, no account.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <a
                    href={`tel:${BUSINESS.phone}`}
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

        {/* ── Trust & verification FAQ ─────────────────────────────────── */}
        <section
          id="faq"
          aria-labelledby="parents-faq-heading"
          className="section scroll-mt-16 bg-sand-500"
        >
          <div className="container-page">
            <div className="section-lead text-center">
              <h2 id="parents-faq-heading" className="t-h2 text-primary-800">
                Trust, money and privacy
              </h2>
              <p className="t-body mt-4 text-text-on-sand">
                The questions people ask before they hand a family
                member&rsquo;s journey to someone else — answered plainly,
                including where our checks stop.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl divide-y divide-neutral-300 overflow-hidden rounded-lg border border-neutral-300/80 bg-neutral-000 shadow-e1">
              {FAQ.map((item) => (
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
              <a href="#post-to-the-board" className="btn btn-primary px-8 py-4">
                Post to the board
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              {/* Internal link to the flight funnel — the ticket itself still
                  has to be booked, and nothing else on this page pointed at it. */}
              <p className="t-body-sm mt-6 text-text-on-sand">
                Their ticket not booked yet?{" "}
                <Link
                  href="/flights"
                  className="t-label-2 text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
                >
                  Search flights from the UK
                </Link>{" "}
                first, then post the journey here.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
