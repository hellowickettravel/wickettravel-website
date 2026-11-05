import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export type LegalSection = {
  id: string;
  heading: string;
  content: ReactNode;
};

/** Paragraph with the shared legal-copy tone. */
export function P({ children }: { children: ReactNode }) {
  return <p className="t-body-sm text-text-secondary">{children}</p>;
}

/** Bulleted list with the shared legal-copy tone. */
export function Ul({ children }: { children: ReactNode }) {
  return (
    <ul className="t-body-sm list-disc space-y-2 pl-6 text-text-secondary marker:text-accent-500">
      {children}
    </ul>
  );
}

/** Standard styled text link used inside legal copy (mailto / tel / ICO etc). */
export function LegalLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target:"_blank", rel:"noopener noreferrer" } : {})}
      className="font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600"
    >
      {children}
    </a>
  );
}

/**
 * Shared shell for the legal and policy pages: the "last updated" date,
 * an optional intro, a jump-to-section table of contents (sticky sidebar on desktop,
 * native <details> dropdown on mobile — both zero-JS), and the sections
 * themselves.
 */
export default function LegalLayout({
  sections,
  lastUpdated,
  intro,
}: {
  sections: LegalSection[];
  lastUpdated: string;
  /** Plain-English summary shown above the sections. */
  intro?: ReactNode;
}) {
  return (
    <div className="section bg-neutral-000">
      <div className="container-page">
        <p className="mb-8 t-label-3 uppercase text-text-secondary">
          Last updated: {lastUpdated}
        </p>
        {intro ? (
          <div className="mb-10 max-w-3xl space-y-3 rounded-lg border border-primary-100 bg-primary-050 p-6 t-body text-primary-800">
            {intro}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Desktop table of contents — sticky sidebar */}
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24 rounded-lg border border-neutral-300/80 bg-neutral-050 p-6">
              <p className="t-overline text-primary-700">On this page</p>
              <ul className="mt-4 space-y-1 t-body-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded-sm px-3 py-2  text-text-secondary transition-colors hover:bg-neutral-000 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Mobile table of contents — native accordion, zero JS */}
          <details className="card group p-6 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-primary-800 [&::-webkit-details-marker]:hidden">
              On this page
              <ChevronDown
                className="h-4 w-4 shrink-0 text-primary-500 transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <ul className="mt-4 space-y-1 t-body-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block rounded-sm px-3 py-2  text-text-secondary transition-colors hover:bg-primary-050 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <article className="min-w-0 space-y-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                {/* Was `t-h3 t-body-lg` — two type-scale classes on one
                    element, so the later globals.css definition silently
                    won and this rendered at body weight/size. One class. */}
                <h2 className="t-h3 text-primary-800">{s.heading}</h2>
                <div className="mt-4 space-y-4">{s.content}</div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
