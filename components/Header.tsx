"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogIn, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/cn";
import Logo from "@/components/Logo";
import { useI18n } from "@/lib/i18n";
import { BUSINESS } from "@/lib/seo";
import { PORTAL_LOGIN_URL } from "@/lib/links";

/* Every service now has its own dedicated page (added after this comment was
   first written) — nav points there directly rather than to a homepage
   anchor or the external holidays site. "Deals" is the one item with no
   standalone page yet, so it stays a homepage anchor; that anchor href stays
   "/"-rooted so it still resolves correctly from any non-homepage route. */
const NAV_LINKS: { key: string; href: string; external?: boolean }[] = [
  { key: "nav.flights", href: "/flights" },
  { key: "nav.hotels", href: "/hotels" },
  { key: "nav.cars", href: "/car-rentals" },
  { key: "nav.deals", href: "/#deals" },
  { key: "nav.dubaiVisa", href: "/visa" },
  { key: "nav.parentsTickets", href: "/parents-tickets" },
];

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* On the homepage the header rides over the hero photograph until the first
     scroll, so at rest it is chrome-less and the image runs edge to edge
     behind it — every colour below switches on that one piece of state. Every
     other page has no hero bleeding behind the header, so it stays in its
     solid, scrolled-looking state from the start regardless of scroll
     position; only a `transparent` page ever goes chrome-less. */
  const onImage = transparent && !scrolled;

  return (
    <header
      className={cn(
        "inset-x-0 top-0 w-full transition-colors duration-300 z-header",
        // A transparent (homepage) header is `fixed`, not `sticky` — it never
        // occupies flow space, so the hero behind it never has to cancel that
        // space with a negative margin tuned to match the header's height.
        // That match was inherently approximate (padding-driven height vs. a
        // guessed offset) and any drift between them reopened a hairline gap.
        // Fixed removes the dependency entirely: nothing to keep in sync.
        transparent ? "fixed" : "sticky",
        onImage
          ? "border-b border-transparent bg-transparent"
          // Fully opaque, not translucent + backdrop-blur: a sticky full-width
          // backdrop-filter repaints every scroll frame on Android, and any
          // transparency lets the dark hero tint the bar's shoulders grey
          // either side of the container.
          : "border-b border-primary-100 bg-neutral-000 shadow-e1"
      )}
    >
      <div className="container-page flex items-center justify-between gap-6 py-3 lg:py-3.5">
        {/* Logo — the lockup is live vector + text, so it recolours with a
            class instead of needing a second bitmap for the dark hero. */}
        <Link
          href="/"
          className={cn(
            "shrink-0 rounded-sm text-[21px] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:text-[24px]",
            onImage
              ? "text-text-on-dark focus-visible:ring-neutral-000 focus-visible:ring-offset-primary-900"
              : "text-primary-800 focus-visible:ring-primary-500 focus-visible:ring-offset-neutral-000"
          )}
          aria-label="Wicket Travel home"
        >
          <Logo />
        </Link>

        {/* Desktop nav — from xl, not lg. With the full "Parents Travel
            Assist" label the row (logo + six links + phone + Login + Get
            Quote) needs ~1,175px; lg's 944px content box can't hold it, and
            squeezing it there wrapped every label onto two lines. Between lg
            and xl the drawer carries the links and the phone number stays in
            the bar. `whitespace-nowrap` makes any future overflow visible as
            overflow instead of a silently wrapped, double-height header. */}
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const className = cn(
              "whitespace-nowrap rounded-full px-2.5 py-2 t-label-2 tracking-[0.2px] transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              onImage
                ? "text-text-on-dark/85 hover:bg-neutral-000/10 hover:text-text-on-dark focus-visible:ring-neutral-000 focus-visible:ring-offset-primary-900"
                : "text-neutral-600 hover:bg-primary-050 hover:text-primary-800 focus-visible:ring-primary-500 focus-visible:ring-offset-neutral-000"
            );
            return link.external ? (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {t(link.key)}
              </a>
            ) : (
              <Link key={link.key} href={link.href} className={className}>
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* A reachable human is this agency's actual differentiator over the
              faceless OTAs, so the number is a first-class header item, not
              something buried in the footer. */}
          <a
            href={`tel:${BUSINESS.phone}`}
            className={cn(
              /* Shown from lg — before the desktop nav, which now starts at
                 xl — so the number, this agency's differentiator, is in the
                 bar at every laptop width, with or without the nav beside it. */
              "hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 t-label-2 transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:inline-flex",
              onImage
                ? "text-text-on-dark hover:bg-neutral-000/10 focus-visible:ring-neutral-000 focus-visible:ring-offset-primary-900"
                : "text-primary-800 hover:bg-primary-050 focus-visible:ring-primary-500 focus-visible:ring-offset-neutral-000"
            )}
          >
            <Phone
              className={cn("h-4 w-4", onImage ? "text-accent-400" : "text-accent-500")}
              aria-hidden="true"
            />
            {BUSINESS.phoneDisplay}
          </a>

          {/* Distinct from the Get Quote CTA below — this is the returning
              customer's path back into the booking portal, not a lead-gen
              action, so it reads as a secondary, outlined affordance rather
              than competing with the orange primary CTA. */}
          <a
            href={PORTAL_LOGIN_URL}
            className={cn(
              "hidden items-center gap-1.5 whitespace-nowrap rounded-full border px-[15px] py-[9.5px] t-label-2 tracking-[0.2px] transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:inline-flex",
              onImage
                ? "border-text-on-dark/40 text-text-on-dark hover:bg-neutral-000/10 focus-visible:ring-neutral-000 focus-visible:ring-offset-primary-900"
                : "border-primary-800 text-primary-800 hover:bg-primary-050 focus-visible:ring-primary-500 focus-visible:ring-offset-neutral-000"
            )}
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {t("cta.login")}
          </a>

          <a
            href={PORTAL_LOGIN_URL}
            className="hidden items-center whitespace-nowrap rounded-full bg-accent-500 px-[17px] py-[10.5px] t-label-2 tracking-[0.2px] text-text-on-dark shadow-e1 transition-all duration-300 ease-out hover:bg-accent-600 hover:shadow-e2 active:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 sm:inline-flex sm:px-[21px] lg:px-[25px]"
          >
            {t("cta.getQuote")}
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 xl:hidden",
              onImage
                ? "text-text-on-dark hover:bg-neutral-000/10 focus-visible:ring-neutral-000"
                : "text-primary-800 hover:bg-primary-050 focus-visible:ring-primary-500"
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — tap to dismiss */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 bg-primary-900/60 xl:hidden z-backdrop"
            />

            {/* Slide-in panel */}
            <motion.div
              key="drawer-panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={
                reduce
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 320, damping: 34 }
              }
              className="fixed inset-y-0 right-0 flex w-[min(20rem,82vw)] flex-col overflow-y-auto overscroll-contain bg-neutral-000 shadow-e3 xl:hidden z-drawer"
            >
              {/* Drawer header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-primary-100 px-6">
                <Logo className="text-[20px] text-primary-800" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-primary-800 transition-colors hover:bg-primary-050 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Mobile">
                {NAV_LINKS.map((link) =>
                  link.external ? (
                    <a
                      key={link.key}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="flex min-h-[44px] items-center rounded-sm px-3 t-label-1 text-neutral-600 transition-colors hover:bg-primary-050 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      {t(link.key)}
                    </a>
                  ) : (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[44px] items-center rounded-sm px-3 t-label-1 text-neutral-600 transition-colors hover:bg-primary-050 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      {t(link.key)}
                    </Link>
                  )
                )}
              </nav>

              {/* Footer block — call first, then the quote CTA. */}
              <div className="mt-auto shrink-0 space-y-3 border-t border-primary-100 p-6">
                <a
                  href={`tel:${BUSINESS.phone}`}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-primary-800 px-6 t-label-1 text-primary-800 transition-colors hover:bg-primary-050 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  <Phone className="h-4 w-4 text-accent-500" aria-hidden="true" />
                  {BUSINESS.phoneDisplay}
                </a>
                <a
                  href={PORTAL_LOGIN_URL}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-primary-800 px-6 t-label-1 text-primary-800 transition-colors hover:bg-primary-050 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  <LogIn className="h-4 w-4 text-accent-500" aria-hidden="true" />
                  {t("cta.login")}
                </a>
                <a
                  href={PORTAL_LOGIN_URL}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center justify-center rounded-sm bg-accent-500 px-6 t-label-1 text-text-on-dark transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2"
                >
                  {t("cta.getQuote")}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
