import {
  BadgeCheck,
  CheckCircle2,
  EyeOff,
  Headset,
  HeartHandshake,
  IdCard,
  PhoneCall,
  PlaneTakeoff,
  ShieldCheck,
  UserRound,
} from "lucide-react";

/* What the team checks before any introduction. Worded as what we do, not as
   a guarantee about a person — see the note in WORK-STATUS.md: these copy
   lines are commitments the operations team has to actually keep. */
const CHECKS = [
  { icon: IdCard, title: "Passport checked", text: "Matched to the name on the ticket." },
  { icon: PlaneTakeoff, title: "Same flight, confirmed", text: "We see the booking, not just a promise." },
  { icon: PhoneCall, title: "Phone verified", text: "Both sides reachable before the day." },
  { icon: HeartHandshake, title: "Introduced by a coordinator", text: "Details shared only when both agree." },
];

const PROMISES = [
  { icon: EyeOff, text: "Contact details never made public" },
  { icon: Headset, text: "Our UK line is open 24/7 during the trip" },
  { icon: ShieldCheck, text: "Nothing is agreed until your family is happy" },
];

/** Illustration of a completed companion check — no real person's data. */
function CheckCard() {
  const rows = ["Identity", "Flight booking", "Phone number", "Coordinator call"];
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="absolute -inset-4 -z-10 rounded-lg bg-primary-800/5" />
      <div className="rounded-lg bg-neutral-000 shadow-e3 ring-1 ring-primary-900/5">
        <div className="flex items-center gap-3 border-b border-primary-100 px-5 py-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-050 text-primary-500">
            <UserRound className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="block t-overline text-text-secondary">Companion check</span>
            <span className="block t-label-1 text-primary-800">DEL → LHR</span>
          </div>
          <BadgeCheck className="h-7 w-7 text-success" />
        </div>
        <ul className="divide-y divide-primary-050 px-5">
          {rows.map((row) => (
            <li key={row} className="flex items-center justify-between py-3">
              <span className="t-body-sm text-primary-800">{row}</span>
              <span className="inline-flex items-center gap-1.5 t-label-3 text-success">
                <CheckCircle2 className="h-4 w-4" />
                Verified
              </span>
            </li>
          ))}
        </ul>
        <div className="m-3 mt-1 flex items-center justify-center gap-2 rounded-md bg-success-surface px-4 py-3 t-label-2 text-success">
          <ShieldCheck className="h-4 w-4" />
          Approved for introduction
        </div>
      </div>
    </div>
  );
}

export default function AssistVerified() {
  return (
    <section aria-labelledby="assist-verified-heading" className="section bg-sand-500">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="t-overline text-primary-500">Verified by Wicket Travel</p>
            <h2 id="assist-verified-heading" className="mt-2 t-h2 text-balance text-primary-800">
              Every companion is someone we&rsquo;ve checked
            </h2>
            <p className="mt-3 max-w-lg t-body text-text-on-sand">
              Our team verifies both sides before anyone is introduced.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {CHECKS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3 rounded-md bg-neutral-000 p-4 ring-1 ring-sand-600">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success-surface text-success">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block t-label-2 text-primary-800">{title}</span>
                    <span className="mt-0.5 block t-body-sm text-text-secondary">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <CheckCard />
        </div>

        <ul className="mt-12 grid gap-3 border-t border-sand-600 pt-8 sm:grid-cols-3">
          {PROMISES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 t-label-2 text-primary-800">
              <Icon className="h-5 w-5 shrink-0 text-accent-600" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
