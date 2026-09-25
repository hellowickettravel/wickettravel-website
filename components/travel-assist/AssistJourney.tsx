import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  BadgeCheck,
  Armchair,
  Headset,
  PenLine,
  PhoneCall,
  PlaneLanding,
  PlaneTakeoff,
  UsersRound,
} from "lucide-react";
import { BUSINESS } from "@/lib/seo";

const STEPS = [
  { icon: PenLine, title: "Post the journey", text: "Route, date and what they need. Two minutes." },
  { icon: UsersRound, title: "We find a flight-mate", text: "Someone already booked on the same flight." },
  { icon: BadgeCheck, title: "Both sides verified", text: "Passport, ticket and phone checked by our team." },
  { icon: PlaneLanding, title: "Gate to arrivals", text: "Check-in, transit, immigration — then to you." },
];

const BOOKING_PERKS = [
  { icon: PlaneTakeoff, text: "Matched on the flight you book" },
  { icon: Armchair, text: "Seats requested together" },
  { icon: Accessibility, text: "Wheelchair & assistance arranged" },
  { icon: Headset, text: "UK agents, 24/7" },
];

/** A stylised boarding-pass stub — illustration only, no real booking data. */
function PassStub({
  role,
  who,
  seat,
  className,
}: {
  role: string;
  who: string;
  seat: string;
  className?: string;
}) {
  return (
    <div className={`w-64 rounded-md bg-neutral-000 shadow-e3 ${className ?? ""}`}>
      <div className="flex items-center justify-between rounded-t-md bg-primary-050 px-4 py-2.5">
        <span className="t-overline text-primary-700">{role}</span>
        <PlaneTakeoff className="h-4 w-4 text-accent-500" />
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between font-mono text-[24px] font-medium leading-[28px] text-primary-800">
          <span>DEL</span>
          <span className="mx-2 h-px flex-1 border-t border-dashed border-primary-200" />
          <span>LHR</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="block t-caption text-text-secondary">Passenger</span>
            <span className="block t-label-2 text-primary-800">{who}</span>
          </div>
          <div className="text-right">
            <span className="block t-caption text-text-secondary">Seat</span>
            <span className="block font-mono text-[20px] font-medium leading-[24px] text-accent-700">{seat}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-dashed border-neutral-300 px-4 py-2 t-caption text-text-secondary">
        Same flight · Wicket Travel
      </div>
    </div>
  );
}

/**
 * How a match happens, then the commercial point of the page: book the
 * tickets with Wicket Travel and the pairing is built in. Four steps, a few
 * words each — the flight line between them does the explaining.
 */
export default function AssistJourney() {
  return (
    <section aria-labelledby="assist-journey-heading" className="section bg-neutral-000">
      <div className="container-page">
        <div className="section-lead text-center">
          <p className="t-overline text-primary-500">How it works</p>
          <h2 id="assist-journey-heading" className="mt-2 t-h2 text-primary-800">
            Matched, checked, and together at the gate
          </h2>
        </div>

        <ol className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">
          {/* The flight line joining the four stops (desktop). */}
          <span
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-7 hidden border-t-2 border-dashed border-primary-100 lg:block"
          />
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative flex flex-col items-center text-center">
              <span className="relative grid h-14 w-14 place-items-center rounded-full bg-primary-800 text-text-on-dark ring-8 ring-neutral-000">
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-accent-500 font-mono text-[12px] font-medium text-text-on-dark">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-5 t-h5 text-primary-800">{title}</h3>
              <p className="mt-1.5 max-w-[15rem] t-body-sm text-text-secondary">{text}</p>
            </li>
          ))}
        </ol>

        {/* The booking hook */}
        <div className="mt-16 overflow-hidden rounded-lg bg-primary-800 md:mt-20">
          <div className="grid items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-6 lg:py-12">
            <div>
              <p className="t-overline text-accent-400">Not booked yet?</p>
              <h3 className="mt-2 t-h2 text-balance text-text-on-dark">
                Book their tickets with us — we&rsquo;ll pair them on the same flight.
              </h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {BOOKING_PERKS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 t-label-2 text-primary-100">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-000/10">
                      <Icon className="h-4 w-4 text-accent-400" aria-hidden="true" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/flights" className="btn btn-primary rounded-full px-7">
                  Search flights
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="btn rounded-full px-7 text-text-on-dark ring-1 ring-neutral-000/30 hover:bg-neutral-000/10 focus-visible:ring-neutral-000/70 focus-visible:ring-offset-primary-800"
                >
                  <PhoneCall className="h-5 w-5" aria-hidden="true" />
                  Call {BUSINESS.phoneDisplay}
                </a>
              </div>
            </div>

            {/* Two stubs, one row apart — "seated together" as a picture. */}
            <div className="relative mx-auto hidden h-80 w-full max-w-md sm:block" aria-hidden="true">
              <PassStub role="Your parent" who="Mum" seat="23A" className="absolute left-0 top-0 -rotate-6" />
              <PassStub role="Companion" who="Verified ✓" seat="23B" className="absolute bottom-0 right-0 rotate-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
