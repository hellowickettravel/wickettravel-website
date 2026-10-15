/* Server component: with the scroll-reveal wrappers gone this section holds no
   state, no hooks and no client-only APIs, so it ships no JS of its own. */
import { ShieldCheck } from "lucide-react";

const STATS = [
  { value: "2M+", label: "Travelers flown" },
  { value: "60+", label: "Trusted airlines" },
  { value: "120+", label: "Countries served" },
  { value: "Excellent", label: "Rated on Trustpilot" },
];

export default function TrustBar() {
  return (
    <section className="bg-neutral-000 py-12 sm:py-16">
      <div className="container-page">
        <div className="card overflow-hidden">
          <h2 className="sr-only">
            Trusted by millions of UK travelers booking cheap flights
          </h2>
          {/* Stats band */}
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={[
                  "px-6 py-8 text-center sm:py-8",
                  i === 1 || i === 3 ? "border-l border-neutral-300" : "",
                  i === 2 || i === 3 ? "border-t border-neutral-300" : "",
                  "sm:border-t-0",
                  i !== 0 ? "sm:border-l sm:border-neutral-300" : "sm:border-l-0",
                ].join(" ")}
              >
                <div className="t-display-3 text-primary-800">
                  {s.value}
                </div>
                <div className="mt-1 t-label-2 text-text-secondary">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Promise band */}
          <div className="flex flex-col items-center gap-4 border-t border-neutral-300 bg-sand-500/60 px-6 py-6 text-center sm:flex-row sm:justify-center sm:gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-000 px-4 py-2 t-label-2 text-primary-800 shadow-e1 ring-1 ring-neutral-300">
              <ShieldCheck
                className="h-4 w-4 text-accent-500"
                aria-hidden="true"
              />
              Best available fares from the world&apos;s most trusted airlines
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
