import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

/**
 * `lastModified` is the date a page's content last really changed (MEMORY.md),
 * not the build date. Update the date beside a page when you change its content.
 */
type Entry = [path: string, lastModified: string, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number];

const LEGAL_AUDIT = "2026-11-05"; // legal, trust and content overhaul

const PAGES: Entry[] = [
  ["", LEGAL_AUDIT, "weekly", 1],
  ["/flights", LEGAL_AUDIT, "weekly", 0.9],
  ["/quote", LEGAL_AUDIT, "monthly", 0.8],
  ["/visa", LEGAL_AUDIT, "monthly", 0.8],
  ["/parents-tickets", LEGAL_AUDIT, "weekly", 0.8],
  ["/parents-tickets/requests", LEGAL_AUDIT, "daily", 0.6],
  ["/parents-tickets/offers", LEGAL_AUDIT, "daily", 0.6],
  ["/hotels", LEGAL_AUDIT, "monthly", 0.7],
  ["/car-rentals", LEGAL_AUDIT, "monthly", 0.7],
  ["/about", LEGAL_AUDIT, "monthly", 0.7],
  ["/contact", LEGAL_AUDIT, "monthly", 0.7],
  ["/help", LEGAL_AUDIT, "monthly", 0.7],
  ["/editorial-policy", LEGAL_AUDIT, "yearly", 0.3],
  ["/photo-credits", LEGAL_AUDIT, "yearly", 0.2],
  ["/terms", LEGAL_AUDIT, "yearly", 0.4],
  ["/privacy", LEGAL_AUDIT, "yearly", 0.4],
  ["/cookie-policy", LEGAL_AUDIT, "yearly", 0.3],
  ["/refunds", LEGAL_AUDIT, "yearly", 0.4],
  ["/complaints", LEGAL_AUDIT, "yearly", 0.4],
  ["/visa-terms", LEGAL_AUDIT, "yearly", 0.3],
  ["/parent-travel-assist-terms", LEGAL_AUDIT, "yearly", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map(([path, lastModified, changeFrequency, priority]) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...ROUTES.map((r) => ({
      url: `${SITE_URL}/flights/${r.slug}`,
      lastModified: LEGAL_AUDIT,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
