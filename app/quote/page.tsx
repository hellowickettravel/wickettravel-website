import type { Metadata } from "next";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import QuoteForm from "@/components/QuoteForm";
import { WHATSAPP_NOTE } from "@/lib/legal";
import { PHONE_LINK, PORTAL_LOGIN_URL } from "@/lib/links";
import { BUSINESS, OG_BASE, SITE_URL, TWITTER_BASE } from "@/lib/seo";

const description =
  "Ask Wicket Travel for a flight quote: tell us your route, dates and travellers, and a consultant sends you flights, the total price and the fare rules. Free, no obligation.";

export const metadata: Metadata = {
  title: "Get a Flight Quote",
  description,
  alternates: { canonical: "/quote" },
  openGraph: { ...OG_BASE, url: `${SITE_URL}/quote`, title: "Get a Flight Quote | Wicket Travel", description },
  twitter: { ...TWITTER_BASE, title: "Get a Flight Quote | Wicket Travel", description },
};

const STEPS = [
  "Tell us your route, dates and who's travelling.",
  "A consultant sends flights, the total price and the fare rules.",
  "Nothing is booked until you accept and pay. The airline issues your e-ticket.",
];

export default function QuotePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHero
          title="Get a flight quote"
          lead="Free and with no obligation. One total price, with the fare rules, before you decide."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Get a quote" }]}
        />
        <section className="section bg-neutral-000">
          <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
            <div className="card relative min-w-0 p-6 sm:p-8">
              <QuoteForm />
            </div>
            <aside className="space-y-6">
              <div className="card p-6">
                <h2 className="t-h4 text-primary-800">How it works</h2>
                <ol className="mt-4 space-y-3">
                  {STEPS.map((s) => (
                    <li key={s} className="flex gap-3 t-body-sm text-text-secondary">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="card p-6">
                <h2 className="t-h4 text-primary-800">Prefer to chat?</h2>
                <p className="mt-2 t-body-sm text-text-secondary">
                  Message us on WhatsApp, any time, day or night.
                </p>
                <a {...PHONE_LINK} className="btn btn-secondary mt-4 h-12 w-full">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {BUSINESS.phoneDisplay}
                </a>
                <p className="mt-3 t-caption text-text-secondary">{WHATSAPP_NOTE}</p>
              </div>
              <div className="card p-6">
                <h2 className="t-h4 text-primary-800">Already booking with us?</h2>
                <p className="mt-2 t-body-sm text-text-secondary">
                  Sign in to the booking portal to see your quotes, tickets and messages.
                </p>
                <a href={PORTAL_LOGIN_URL} className="btn btn-outline mt-4 h-12 w-full">
                  Sign in
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
