import Link from "next/link";
import Logo from "@/components/Logo";
import Image from "next/image";
import { Building2, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { BUSINESS } from "@/lib/seo";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/SocialIcons";
import { PHONE_LINK, PORTAL_LOGIN_URL } from "@/lib/links";

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

/** Internal routes wired up for the footer's link columns. Flights/Hotels/
 *  Car Rental used to be a "#" stub or an external link out to the holidays
 *  site; all three now have real pages on this site, same as Header.tsx.
 *  "How it works" and "FAQs" point at the real homepage sections
 *  (components/HowItWorks.tsx, components/Faq.tsx) rather than a stub —
 *  those sections already exist, they just weren't linked from here.
 *  "Manage booking" is the same returning-customer portal link Header.tsx
 *  uses for "Login" (lib/links.ts PORTAL_LOGIN_URL) — an external absolute
 *  URL, so it's rendered as a plain <a>, not a Next.js <Link>, same as
 *  Header's treatment of it. */
const ROUTES: Record<string, string> = {
  Flights: "/flights",
  Hotels: "/hotels",
  "Car Rental": "/car-rentals",
  Deals: "/#deals",
  "About us":"/about",
  "How it works": "/#how-it-works",
  "Contact us":"/contact",
  "Manage booking": PORTAL_LOGIN_URL,
  Refunds:"/refunds",
  FAQs: "/#faq",
};

/* Travel guides, Partners, Careers, Press and Help center were dropped from
   COLUMNS below rather than left as "#" stubs: no guides, partners, careers,
   press or help-center content exists anywhere on the site, so a link to
   them would go nowhere. A dead link is worse than no link — remove it here
   and add it back once the page it names actually exists. */
const COLUMNS = [
  {
    title:"Explore",
    links: ["Flights","Hotels","Car Rental","Deals"],
  },
  {
    title:"Company",
    links: ["About us","How it works"],
  },
  {
    title:"Support",
    links: ["Contact us","Manage booking","Refunds","FAQs"],
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
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-5">
          {/* Brand + contact + socials */}
          <div className="col-span-2">
            <Logo className="text-[22px] text-text-on-dark" />
            <p className="mt-4 max-w-sm t-body-sm  text-primary-200">
              We book trusted airline tickets at the best available fares —
              connecting you to the world&apos;s leading carriers, with no hidden
              booking fees.
            </p>
            <ul className="mt-6 space-y-3 t-body-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <a href="mailto:info@wickettravel.com" className="hover:text-text-on-dark">
                  info@wickettravel.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <a {...PHONE_LINK} className="hover:text-text-on-dark">
                  +44 7417 564704
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
                <span>Lampton Avenue, Hounslow, London, TW3 4EW, UK.</span>
              </li>
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
            const body = (
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

        {/* One bottom bar: legal identity on the left, policy links on the right.
            Stacks and centres on mobile. */}
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-neutral-000/10 pt-6 t-caption text-primary-200 sm:flex-row sm:justify-between">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Wicket Travel Ltd. All rights reserved.
            <span className="mx-2 hidden text-text-on-dark/20 sm:inline">|</span>
            <span className="mt-1 block text-primary-200 sm:mt-0 sm:inline">
              Wicket Travel Limited Reg: 17001759, UK
            </span>
            <span className="mx-2 hidden text-text-on-dark/20 sm:inline">|</span>
            <span className="mt-1 block font-bold text-accent-400 sm:mt-0 sm:inline">
              IATA TIDS Reg: 96239010
            </span>
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-text-on-dark">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-text-on-dark">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
