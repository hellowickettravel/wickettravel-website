import Image from "next/image";
import Link from "next/link";
import { Accessibility, Armchair, ArrowRight, Headset, PhoneCall, PlaneTakeoff } from "lucide-react";
import { BUSINESS } from "@/lib/seo";

const STEPS = [
  {
    photo: "/parents-travel-assist/step-post.jpg",
    alt: "A woman in a sari posting on her phone",
    title: "Post the trip",
    text: "Route, date and what they need — two minutes on your phone.",
  },
  {
    photo: "/parents-travel-assist/step-flight.jpg",
    alt: "Passengers seated in an aircraft cabin",
    title: "We find a flight-mate",
    text: "A traveller already booked on that same flight.",
  },
  {
    photo: "/parents-travel-assist/step-verify.jpg",
    alt: "A traveller holding a boarding pass and phone",
    title: "Both sides verified",
    text: "Passport, booking and phone checked by our team.",
  },
  {
    photo: "/parents-travel-assist/step-arrive.jpg",
    alt: "A mother and daughter embracing in an airport terminal",
    title: "Safe into your arms",
    text: "Check-in, transit, immigration — then handed over to you.",
  },
];

const BOOKING_PERKS = [
  { icon: PlaneTakeoff, text: "Matched on the flight you book" },
  { icon: Armchair, text: "Seats requested together" },
  { icon: Accessibility, text: "Wheelchair & assistance arranged" },
  { icon: Headset, text: "UK agents, 24/7" },
];

/** A stylised boarding-pass stub — illustration only, no real booking data. */
function PassStub({ role, who, seat, className }: { role: string; who: string; seat: string; className?: string }) {
  return (
    <div className={`w-60 rounded-md bg-neutral-000 shadow-e3 ${className ?? ""}`}>
      <div className="flex items-center justify-between rounded-t-md bg-primary-050 px-4 py-2.5">
        <span className="t-overline text-primary-700">{role}</span>
        <PlaneTakeoff className="h-4 w-4 text-accent-500" />
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between font-mono text-[22px] font-medium leading-[28px] text-primary-800">
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
    </div>
  );
}

/**
 * How a match happens, as four photographs, then the commercial point of the
 * page: book the tickets with Wicket Travel and the pairing is built in.
 * On phones the steps become a swipeable row instead of a tall stack.
 */
export default function AssistJourney() {
  return (
    <section aria-labelledby="assist-journey-heading" className="section bg-neutral-000">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="t-overline text-primary-500">How it works</p>
          <h2 id="assist-journey-heading" className="mt-2 t-h2 text-balance text-primary-800">
            Matched, checked, and together at the gate
          </h2>
        </div>

        <ol className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-6">
          {STEPS.map(({ photo, alt, title, text }, i) => (
            <li key={title} className="w-[78%] shrink-0 snap-start sm:w-[45%] md:w-auto">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-primary-050">
                <Image src={photo} alt={alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 80vw" className="object-cover" />
                <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-neutral-000 font-mono text-[15px] font-medium text-primary-800 shadow-e2">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 t-h5 text-primary-800">{title}</h3>
              <p className="mt-1 t-body-sm text-text-secondary">{text}</p>
            </li>
          ))}
        </ol>

        {/* The booking hook */}
        <div className="mt-16 overflow-hidden rounded-lg bg-primary-800 md:mt-20">
          <div className="grid grid-cols-1 items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:py-12">
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
            <div className="relative mx-auto hidden h-72 w-full max-w-md sm:block" aria-hidden="true">
              <PassStub role="Your parent" who="Mum" seat="23A" className="absolute left-0 top-0 -rotate-6" />
              <PassStub role="Companion" who="Verified ✓" seat="23B" className="absolute bottom-0 right-0 rotate-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
