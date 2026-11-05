"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle, Plus, Search, X } from "lucide-react";
import {
  HELP_TOPICS,
  helpAnswerText,
  type HelpSegment,
} from "@/lib/help";
import { PHONE_LINK } from "@/lib/links";
import { BUSINESS } from "@/lib/seo";
import { WHATSAPP_NOTE } from "@/lib/legal";

const linkClass =
  "font-bold text-primary-800 underline decoration-accent-400 decoration-2 underline-offset-2 hover:text-accent-600";

function Answer({ segments }: { segments: HelpSegment[] }) {
  return (
    <p className="t-body-sm text-text-secondary">
      {segments.map((s, i) => {
        if (typeof s === "string") return <span key={i}>{s}</span>;
        const external = s.href.startsWith("http");
        return external ? (
          <a key={i} href={s.href} className={linkClass}>
            {s.text}
          </a>
        ) : (
          <Link key={i} href={s.href} className={linkClass}>
            {s.text}
          </Link>
        );
      })}
    </p>
  );
}

/** Lower-cased, accent-free text for matching. */
function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * The help centre body: a search box that filters every question as you type,
 * topic shortcuts, and one native <details> accordion per topic. All answers
 * are in the server-rendered HTML (the search only hides non-matches), so the
 * page reads fully without JavaScript and matches the FAQPage JSON-LD.
 */
export default function HelpCentre() {
  const [query, setQuery] = useState("");
  const terms = norm(query).split(/\s+/).filter(Boolean);

  // A few dozen short answers: filtering on every keystroke costs nothing.
  const topics = !terms.length
    ? HELP_TOPICS
    : HELP_TOPICS.map((t) => ({
        ...t,
        items: t.items.filter((item) => {
          const hay = norm(`${t.title} ${item.question} ${helpAnswerText(item.answer)}`);
          return terms.every((w) => hay.includes(w));
        }),
      })).filter((t) => t.items.length > 0);

  const count = topics.reduce((n, t) => n + t.items.length, 0);
  const searching = terms.length > 0;

  return (
    <div className="section bg-neutral-000">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <label htmlFor="help-search" className="t-label-2 text-primary-800">
            Search help articles
          </label>
          <div className="relative mt-2">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
              aria-hidden="true"
            />
            <input
              id="help-search"
              type="text"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="For example: refund, baggage, visa"
              autoComplete="off"
              className="input h-12 pl-12 pr-12"
              aria-describedby="help-search-status"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-text-secondary hover:bg-neutral-050 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <p id="help-search-status" role="status" className="mt-2 t-caption text-text-secondary">
            {searching
              ? count === 0
                ? "No answers match that search."
                : `${count} ${count === 1 ? "answer" : "answers"} found`
              : "Browse by topic, or search above."}
          </p>

          {!searching && (
            <nav aria-label="Help topics" className="mt-8">
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {HELP_TOPICS.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="card card-hover flex h-full flex-col p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      <span className="t-label-1 text-primary-800">{t.title}</span>
                      <span className="mt-1 t-caption text-text-secondary">
                        {t.summary} · {t.items.length} answers
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="mt-12 space-y-12">
            {topics.map((t) => (
              <section key={t.id} id={t.id} aria-labelledby={`${t.id}-heading`} className="scroll-mt-24">
                <h2 id={`${t.id}-heading`} className="t-h3 text-primary-800">
                  {t.title}
                </h2>
                <div className="mt-4 divide-y divide-neutral-300 overflow-hidden rounded-lg border border-neutral-300/80 bg-neutral-000 shadow-e1">
                  {t.items.map((item) => (
                    <details key={item.id} id={item.id} className="group scroll-mt-24" open={searching || undefined}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-bold text-primary-800 transition-colors hover:bg-primary-050/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden">
                        <span className="t-body">{item.question}</span>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-050 text-primary-700 transition-all duration-200 group-open:rotate-45 group-open:bg-accent-500 group-open:text-text-on-dark">
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </summary>
                      <div className="px-6 pb-6">
                        <Answer segments={item.answer} />
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 rounded-lg bg-primary-800 p-8 text-center sm:p-10">
            <h2 className="t-h3 text-text-on-dark">Still need help?</h2>
            <p className="t-body-sm mx-auto mt-2 max-w-md text-primary-100">
              Message or call us on WhatsApp, or send us a message and we&apos;ll
              reply by email.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a {...PHONE_LINK} className="btn btn-primary h-12 px-6">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp {BUSINESS.phoneDisplay}
              </a>
              <Link href="/contact" className="btn h-12 border border-neutral-000/40 px-6 text-text-on-dark hover:bg-neutral-000/10">
                Contact us
              </Link>
            </div>
            <p className="mt-4 t-caption text-primary-200">{WHATSAPP_NOTE}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
