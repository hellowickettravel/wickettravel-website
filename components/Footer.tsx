import Link from "next/link";
import Logo from "@/components/Logo";
import Image from "next/image";
import { BadgeCheck, Building2, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/SocialIcons";
import { PHONE_LINK, PORTAL_LOGIN_URL } from "@/lib/links";

/**
 * Registrations shown as badges above the bottom bar (client request,
 * 2026-10-01: "people see logos more than numbers").
 *
 * ONLY WHAT THE COMPANY ACTUALLY HOLDS. Wicket Travel has an IATA TIDS
 * code, which is not IATA accreditation, and no ATOL licence (MEMORY.md).
 * So there is no "IATA Accredited Agent", ATOL or ABTA mark here: using
 * the ATOL logo without a licence is a criminal offence in the UK, and
 * ABTA's logo is for members, who must show their membership number with
 * it. Add an entry only with the licence or membership number in hand.
 *
 * `logo` takes an official artwork file from public/accreditations/ (the
 * one the issuing body supplies to its members), never a copy found
 * online. Without one, the badge is set in type, which imitates nobody.
 */
type Accreditation = {
  name: string;
  detail: string;
  icon: LucideIcon;
  /** Public record a visitor can check the claim against. */
  href?: string;
  /** Official artwork in public/accreditations/, e.g. "/accreditations/tids.svg". */
  logo?: string;
};

const ACCREDITATIONS: Accreditation[] = [
  {
    name: "IATA TIDS",
    detail: "Registered travel agent · 96239010",
    icon: BadgeCheck,
  },
  {
    name: "Companies House",
    detail: "Registered in England & Wales · No. 17001759",
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

        {/* Registrations, as badges on a white plate so official artwork
            (usually drawn for white) can drop in without a dark variant. */}
        <ul
          aria-label="Registrations"
          className="mt-10 flex flex-wrap items-stretch justify-center gap-3 sm:justify-start"
        >
          {ACCREDITATIONS.map((a) => {
            const body = (
              <>
                {a.logo ? (
                  <Image src={a.logo} alt={a.name} width={120} height={40} className="h-10 w-auto" />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-050 text-primary-800">
                    <a.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
                <span className="flex flex-col leading-tight">
                  <span className="t-label-2 text-primary-800">{a.name}</span>
                  <span className="t-caption text-text-secondary">{a.detail}</span>
                </span>
              </>
            );
            const box =
              "flex w-full items-center gap-3 rounded-md bg-neutral-000 px-4 py-3 shadow-e1";
            return (
              <li key={a.name} className="flex w-full sm:w-auto">
                {a.href ? (
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${a.name}: ${a.detail} (check the public record, opens in a new tab)`}
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
