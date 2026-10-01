import { Star } from "lucide-react";
import { BUSINESS } from "@/lib/seo";
import { cn } from "@/lib/cn";

/**
 * Homepage reviews: two rows of real Trustpilot reviews sliding past in
 * opposite directions, in Trustpilot's own green so the source is
 * recognisable at a glance.
 *
 * THE REVIEWS ARE REAL. They are the reviews published on
 * trustpilot.com/review/wickettravel.com, carried over from the original
 * homepage section (components/Testimonials.tsx, removed in 096d5eb):
 * names and star ratings as published, wording shortened for the card.
 * Because they are real people's reviews, names are never swapped for
 * placeholders and wording is only ever trimmed, never added to. One
 * excerpt used to end "…and ATOL peace of mind"; the company holds an IATA
 * TIDS number, not an ATOL licence (MEMORY.md), so that clause is trimmed
 * rather than republished as a claim.
 *
 * WHAT IT DOESN'T CLAIM. There is no review count and no score here: the
 * figure the rest of the site publishes (lib/seo.ts) is still waiting on
 * the client to reconcile with the live profile. "Excellent" is the label
 * Trustpilot gives the live profile's score. No "Verified" badges either:
 * that word means something specific on Trustpilot, and it isn't ours to
 * apply. Nothing imitates Trustpilot's logo; the name is set in type.
 *
 * NO JAVASCRIPT. A server component: the motion is the site's existing CSS
 * marquee (app/globals.css, `.marquee-track`), which moves only
 * `transform`. Each track holds two copies of its row and slides by half
 * its width, so the loop is seamless; the second copy is aria-hidden so a
 * screen reader hears each review once. Hover or keyboard focus pauses it.
 * With reduced motion, `.reviews-marquee` turns into a still, swipeable
 * row and the duplicate is dropped.
 */

const TRUSTPILOT_URL =
  BUSINESS.sameAs.find((url) => url.includes("trustpilot.com")) ??
  "https://www.trustpilot.com/review/wickettravel.com";

/** Trustpilot's brand green. It carries graphics only (the star boxes,
 *  whose rating is also announced as text) and never body text: white on
 *  it is 2.6:1. */
const TP_GREEN = "#00b67a";

type Review = { name: string; rating: number; text: string };

const REVIEWS: Review[] = [
  { name: "Kumar P", rating: 5, text: "My third booking in three months — always the cheapest price and excellent, responsive service." },
  { name: "Mr Sunil Buditi", rating: 5, text: "Available 24/7 with quick WhatsApp replies. Booked instantly and got my PNR by email." },
  { name: "Siddique Shaik", rating: 5, text: "Amazing time booking my tickets — the team's response was perfect." },
  { name: "Ganesh Kuppala", rating: 5, text: "Professional and responsive. Found me better routes and more affordable fares." },
  { name: "Venu", rating: 5, text: "Accurate, clear flight information. Simple and hassle-free from start to finish." },
  { name: "Swati Pardeshi-Chowdary", rating: 5, text: "Excellent personalised service and the best rates I could find." },
  { name: "Raj Tiwari", rating: 4, text: "Wonderful flight booking services — I'd happily recommend them." },
  { name: "Venkatesh Krishna Murthy", rating: 5, text: "Amazing service with the best prices." },
  { name: "Mr Venkata Vudathu", rating: 5, text: "Good service and great support." },
  { name: "Mr A", rating: 5, text: "Supportive and prompt customer service — would recommend." },
  { name: "Ashok", rating: 5, text: "Responsive even at 11 PM, and cheaper than the airline website." },
  { name: "Chinna", rating: 5, text: "Trusted tickets — they took care of schedule changes and cancellations for me." },
];

/* The second row runs the other way and starts half-way through the list,
   so the same review is never stacked above itself. */
const ROW_A = REVIEWS;
const ROW_B = [...REVIEWS.slice(6), ...REVIEWS.slice(0, 6)];

/** Trustpilot-style rating: white stars on solid green squares. */
function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const box = size === "lg" ? "h-7 w-7 sm:h-8 sm:w-8" : "h-5 w-5";
  const star = size === "lg" ? "h-[18px] w-[18px] sm:h-5 sm:w-5" : "h-3.5 w-3.5";
  return (
    <span className="flex gap-[3px]" role="img" aria-label={`Rated ${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn("grid place-items-center rounded-[3px]", box, i >= rating && "bg-neutral-300")}
          style={i < rating ? { backgroundColor: TP_GREEN } : undefined}
        >
          <Star className={cn(star, "fill-neutral-000 text-neutral-000")} aria-hidden="true" />
        </span>
      ))}
    </span>
  );
}

/** "Trustpilot" set in type beside a green star — a source line, not a logo. */
function TrustpilotWord({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-sans font-bold text-primary-800", className)}>
      <Star className="h-[1.1em] w-[1.1em]" style={{ color: TP_GREEN, fill: TP_GREEN }} aria-hidden="true" />
      Trustpilot
    </span>
  );
}

function initials(name: string): string {
  const parts = name.replace(/^(mr|mrs|ms|dr)\s+/i, "").split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full w-[280px] shrink-0 flex-col rounded-lg bg-neutral-000 p-5 shadow-e1 ring-1 ring-primary-900/[0.06] sm:w-[340px] sm:p-6">
      <Stars rating={review.rating} />
      <blockquote className="mt-4 flex-1 t-body text-text-primary">
        <p className="line-clamp-4">&ldquo;{review.text}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-neutral-200 pt-4">
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-sans text-[13px] font-extrabold text-primary-800"
          style={{ backgroundColor: "rgb(0 182 122 / 0.14)" }}
        >
          {initials(review.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate t-label-2 text-primary-800">{review.name}</span>
          <span className="block t-caption text-text-secondary">
            Review on <TrustpilotWord className="text-[12px]" />
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function Row({
  reviews,
  reverse,
  duration,
  label,
  decorative,
}: {
  reviews: Review[];
  reverse?: boolean;
  duration: string;
  label?: string;
  /** The second row repeats the first row's reviews, so assistive tech
   *  skips it entirely (and reduced motion drops it). */
  decorative?: boolean;
}) {
  const copy = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5"
      aria-hidden={hidden || undefined}
      data-marquee-copy={hidden ? "" : undefined}
    >
      {reviews.map((r) => (
        <li key={r.name} className="flex">
          <ReviewCard review={r} />
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className="reviews-marquee marquee"
      role={decorative ? undefined : "region"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      data-decorative={decorative ? "" : undefined}
    >
      <div
        className="marquee-track py-2"
        style={
          {
            "--marquee-duration": duration,
            animationDirection: reverse ? "reverse" : undefined,
          } as React.CSSProperties
        }
      >
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}

export default function Reviews() {
  return (
    <section
      aria-labelledby="reviews-title"
      className="overflow-hidden py-16 md:py-24"
      // A whisper of Trustpilot green over white: enough to tie the section
      // to the source without turning the page green.
      style={{ backgroundImage: "linear-gradient(180deg, rgb(0 182 122 / 0.07), rgb(0 182 122 / 0.02))" }}
    >
      <div className="container-page">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 id="reviews-title" className="t-h2 text-balance text-primary-800">
              Travellers love booking with us
            </h2>
            <p className="t-body-lg mt-4 text-pretty text-text-secondary">
              Real reviews from real customers on Trustpilot — the fares, the
              late-night WhatsApp replies and the help when plans change.
            </p>
          </div>

          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full shrink-0 items-center gap-4 rounded-lg bg-neutral-000 p-4 shadow-e2 ring-1 ring-primary-900/[0.06] transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 sm:w-auto sm:p-5"
            aria-label="Read our reviews on Trustpilot (opens in a new tab)"
          >
            <span className="flex flex-col gap-2">
              <span className="flex items-baseline gap-2">
                <span className="t-h4 text-primary-800">Excellent</span>
              </span>
              <Stars rating={5} size="lg" />
            </span>
            <span aria-hidden="true" className="h-14 w-px bg-neutral-200" />
            <span className="flex flex-col gap-1">
              <TrustpilotWord className="text-[18px]" />
              <span className="inline-flex items-center gap-1 t-label-3 text-text-secondary transition-colors group-hover:text-primary-800">
                Read all reviews
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className="reviews-fade mt-10 space-y-4 sm:mt-12 sm:space-y-5">
        <Row reviews={ROW_A} duration="90s" label="Customer reviews from Trustpilot" />
        <Row reviews={ROW_B} reverse duration="105s" decorative />
      </div>
    </section>
  );
}
