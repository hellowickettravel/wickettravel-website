import Link from "next/link";
import Logo from "@/components/Logo";
import Image from "next/image";
import { Building2, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { BUSINESS } from "@/lib/seo";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/SocialIcons";
import { PHONE_LINK, PORTAL_LOGIN_URL } from "@/lib/links";
import { BOOKING_DISCLOSURE, COMPANY, COMPANY_LINE, WHATSAPP_NOTE } from "@/lib/legal";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import TrustpilotWidget from "@/components/TrustpilotWidget";

/**
 * Registrations and ratings shown as logo badges above the bottom bar
 * (client request, 2026-10-01: "people see logos more than numbers").
 * Logos are the client-supplied originals, trimmed onto white, in
 * public/accreditations/.
 *
 * Every badge says exactly what it is, beside the logo:
 *   IATA         "TIDS registered · 96239010". The company holds an IATA
 *                TIDS code, which is not IATA accreditation (MEMORY.md), so
 *                the caption names the registration it really has.
 *   Trustpilot   "Rated Excellent", linked to the live profile. No star
 *                row: five full stars would claim a 5.0 score, and the
 *                profile's isn't (Excellent is Trustpilot's label for it).
 *   Companies    linked to the public register.
 *   ABTA         only once ABTA_MEMBER_NUMBER is set. ABTA's logo is for
 *                members, shown with their membership number; it is
 *                unlawful to use otherwise.
 * No ATOL mark: the company holds no ATOL licence (MEMORY.md), and using the
 * logo without one is a criminal offence.
 */
const ABTA_MEMBER_NUMBER = ""; // e.g. "P1234" — the ABTA logo appears once this is set.

const TRUSTPILOT_URL =
  BUSINESS.sameAs.find((url) => url.includes("trustpilot.com")) ??
  "https://www.trustpilot.com/review/wickettravel.com";

type Accreditation = {
  name: string;
  detail: string;
  /** Public page a visitor can check the claim against. */
  href?: string;
  /** Logo in public/accreditations/ with its intrinsic size. */
  logo?: { src: string; width: number; height: number };
  /** Shown instead of a logo when there isn't one. */
  icon?: LucideIcon;
};

const ACCREDITATIONS: Accreditation[] = [
  {
    name: "IATA",
    detail: "TIDS registered · 96239010",
    logo: { src: "/accreditations/iata.png", width: 245, height: 160 },
  },
  ...(ABTA_MEMBER_NUMBER
    ? [
        {
          name: "ABTA",
          detail: `ABTA member · ${ABTA_MEMBER_NUMBER}`,
          logo: { src: "/accreditations/abta.png", width: 403, height: 160 },
        },
      ]
    : []),
  {
    name: "Trustpilot",
    detail: "Rated Excellent · read our reviews",
    href: TRUSTPILOT_URL,
    logo: { src: "/accreditations/trustpilot.png", width: 635, height: 160 },
  },
  {
    name: "Companies House",
    detail: "England & Wales · No. 17001759",
    icon: Building2,
    href: "https://find-and-update.company-information.service.gov.uk/company/17001759",
  },
];

/** Every footer link. "Manage booking" is the portal login (an external
 *  URL, so a plain <a>); everything else is a page on this site. Add a link
 *  here only once the page it names exists — a dead link is worse than none. */
const ROUTES: Record<string, string> = {
  Flights: "/flights",
  "Dubai visa": "/visa",
  "Parent Travel Assist": "/parents-tickets",
  Hotels: "/hotels",
  "Car hire": "/car-rentals",
  "About us": "/about",
  "How it works": "/#how-it-works",
  "Editorial policy": "/editorial-policy",
  "Photo credits": "/photo-credits",
  "Help centre": "/help",
  "Contact us": "/contact",
  "Get a quote": "/quote",
  "Manage booking": PORTAL_LOGIN_URL,
  Complaints: "/complaints",
  "Terms & conditions": "/terms",
  "Privacy policy": "/privacy",
  "Cookie policy": "/cookie-policy",
  "Refund policy": "/refunds",
  "Visa service terms": "/visa-terms",
  "Parent Travel Assist terms": "/parent-travel-assist-terms",
};

const COLUMNS: { title: string; links: string[]; cookieSettings?: boolean }[] = [
  {
    title: "Explore",
    links: ["Flights", "Dubai visa", "Parent Travel Assist", "Hotels", "Car hire"],
  },
  {
    title: "Company",
    links: ["About us", "How it works", "Editorial policy", "Photo credits"],
  },
  {
    title: "Support",
    links: ["Help centre", "Contact us", "Get a quote", "Manage booking", "Complaints"],
  },
  {
    title: "Legal",
    links: [
      "Terms & conditions",
      "Privacy policy",
      "Cookie policy",
      "Refund policy",
      "Visa service terms",
      "Parent Travel Assist terms",
    ],
    cookieSettings: true,
  },
];

const SOCIALS = [
  { icon: XIcon, label:"X (Twitter)", href:"https://x.com/WicketTravel" },
  {
    icon: InstagramIcon,
    label:"Instagram",
    href:"https://www.instagram.com/wickettravel/",
  },
  {
    icon: FacebookIcon,
    label:"Facebook",
    href:"https://www.facebook.com/profile.php?id=61581927811628&sk=followers",
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="container-page py-12 lg:py-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-6">
          {/* Brand + contact + socials */}
          <div className="col-span-2">
            <Logo className="text-[22px] text-text-on-dark" />
            <p className="mt-4 max-w-sm t-body-sm  text-primary-200">
              UK travel agent for flights. We book your airline tickets for
              you, with the total price and fare rules agreed before you pay.
            </p>
            <ul className="mt-6 space-y-3 t-body-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-text-on-dark">
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <a {...PHONE_LINK} className="hover:text-text-on-dark">
                  {COMPANY.phoneDisplay} <span className="sr-only">(opens WhatsApp)</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <span>{COMPANY.registeredOffice}</span>
              </li>
              <li className="t-caption text-primary-200/90">{WHATSAPP_NOTE}</li>
            </ul>

            {/* Socials sit with the brand block rather than on their own row —
                keeps the footer compact and fills the space beside the columns. */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-neutral-000/5 text-primary-100 transition-colors hover:bg-accent-500 hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="t-label-2 uppercase text-text-on-dark">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 t-body-sm">
                {col.links.map((link) => {
                  const route = ROUTES[link];
                  const external = route.startsWith("http");
                  const className =
                    "text-primary-200 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:text-text-on-dark";
                  return (
                    <li key={link}>
                      {external ? (
                        <a href={route} className={className}>
                          {link}
                        </a>
                      ) : (
                        <Link href={route} className={className}>
                          {link}
                        </Link>
                      )}
                    </li>
                  );
                })}
                {col.cookieSettings ? (
                  <li>
                    <CookieSettingsButton className="text-left text-primary-200 underline decoration-primary-200/40 underline-offset-2 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:text-text-on-dark" />
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>

        {/* Logo badges on white plates, which is what the original artwork is
            drawn for. Equal heights; one row on desktop, a 2-up grid on
            phones. */}
        <ul
          aria-label="Registrations and ratings"
          className="mt-10 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-stretch [&>li:last-child:nth-child(odd)]:col-span-2"
        >
          {ACCREDITATIONS.map((a) => {
            const staticBody = (
              <>
                <span className="flex h-11 items-center justify-center">
                  {a.logo ? (
                    <Image
                      src={a.logo.src}
                      alt={a.name}
                      width={a.logo.width}
                      height={a.logo.height}
                      sizes="140px"
                      className="h-full w-auto max-w-[140px] object-contain"
                    />
                  ) : a.icon ? (
                    <span className="flex items-center gap-2 t-label-1 text-primary-800">
                      <a.icon className="h-6 w-6 text-primary-700" aria-hidden="true" />
                      {a.name}
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 block text-center t-caption leading-tight text-text-secondary">
                  {a.detail}
                </span>
              </>
            );
            const body =
              a.name === "Trustpilot" ? (
                <TrustpilotWidget theme="light" fallback={staticBody} />
              ) : (
                staticBody
              );
            const box =
              "flex h-full w-full flex-col items-center justify-center rounded-md bg-neutral-000 px-4 py-3 shadow-e1 sm:min-w-[176px]";
            return (
              <li key={a.name} className="flex">
                {a.href ? (
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${a.name}: ${a.detail} (opens in a new tab)`}
                    className={`${box} transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400`}
                  >
                    {body}
                  </a>
                ) : (
                  <span className={box}>{body}</span>
                )}
              </li>
            );
          })}
        </ul>

        {/* How bookings work, who sells what, and who we are — the same
            words as Terms §3 (lib/legal.ts BOOKING_DISCLOSURE). */}
        <div className="mt-10 space-y-3 border-t border-neutral-000/10 pt-6 t-caption text-primary-200">
          {BOOKING_DISCLOSURE.map((para) => (
            <p key={para}>{para}</p>
          ))}
          <p>
            {COMPANY_LINE} IATA TIDS registration {COMPANY.iataTids}.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 border-t border-neutral-000/10 pt-6 t-caption text-primary-200 sm:flex-row sm:justify-between">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <li>
              <Link href="/terms" className="transition-colors hover:text-text-on-dark">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="transition-colors hover:text-text-on-dark">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="transition-colors hover:text-text-on-dark">
                Cookies
              </Link>
            </li>
            <li>
              <CookieSettingsButton className="transition-colors hover:text-text-on-dark" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
