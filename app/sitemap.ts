import type { MetadataRoute } from "next";
import { PSEO_INDEX, type PseoCategory } from "@/data/pseo-index";
import { getPlacement, LAST_VERIFIED_GLOBAL } from "@/lib/platform-specs";

// Category hubs — the cornerstones link equity concentrates into. Highest
// pSEO priority below the homepage.
const CATEGORY_HUBS: PseoCategory[] = [
  "meta",
  "tiktok",
  "linkedin",
  "x",
  "youtube",
  "pinterest",
  "reddit",
  "snapchat",
  "compare",
  "guides",
  "glossary",
];

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE + "/", lastModified: today, changeFrequency: "weekly", priority: 1 },
    { url: BASE + "/about", lastModified: today, changeFrequency: "monthly", priority: 0.5 },
    { url: BASE + "/contact", lastModified: today, changeFrequency: "yearly", priority: 0.3 },
    { url: BASE + "/embed", lastModified: today, changeFrequency: "monthly", priority: 0.7 },
    { url: BASE + "/extension", lastModified: today, changeFrequency: "monthly", priority: 0.5 },
    { url: BASE + "/pricing", lastModified: today, changeFrequency: "monthly", priority: 0.7 },
    { url: BASE + "/bulk", lastModified: today, changeFrequency: "monthly", priority: 0.6 },
    { url: BASE + "/network", lastModified: today, changeFrequency: "monthly", priority: 0.4 },
    { url: BASE + "/changelog", lastModified: today, changeFrequency: "weekly", priority: 0.4 },
    { url: BASE + "/privacy", lastModified: today, changeFrequency: "yearly", priority: 0.3 },
    { url: BASE + "/terms", lastModified: today, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Intent-weighted priority. Flat 0.6 gave Google no cornerstone signal;
  // GSC (May 2026) shows demonstrated impression demand concentrated on the
  // Pinterest title cluster and the WhatsApp limit page, so those lead.
  // /glossary/aspect-ratio-9-16 is demoted: it ranks ~57 on no-intent
  // dimensional queries ("9 16 inch", "9 x 16") and dilutes topical focus.
  const PRIORITY_LEAD = new Set<string>([
    "pinterest/pin-title-character-limit",
    "pinterest/pin-description-character-limit",
    "pinterest/pin-title-best-practices",
    "pinterest/pinterest-ads-specs",
    "pinterest/standard-pin-ad-character-limits",
    "pinterest/video-pin-character-limits",
    "pinterest/idea-ad-character-limits",
    "pinterest/carousel-character-limits",
    "meta/whatsapp-click-to-chat-character-limits",
  ]);
  const PRIORITY_DEMOTE = new Set<string>(["glossary/aspect-ratio-9-16"]);

  const pseoEntries: MetadataRoute.Sitemap = PSEO_INDEX.map((entry) => {
    const placement = getPlacement(entry.placementId);
    const lastModified = placement?.lastVerified ?? entry.publishedAt ?? LAST_VERIFIED_GLOBAL;
    const priority = PRIORITY_LEAD.has(entry.slug)
      ? 0.8
      : PRIORITY_DEMOTE.has(entry.slug)
        ? 0.3
        : 0.6;
    return {
      url: `${BASE}/${entry.slug}`,
      lastModified: new Date(lastModified),
      changeFrequency: priority >= 0.8 ? ("weekly" as const) : ("monthly" as const),
      priority,
    };
  });

  const hubEntries: MetadataRoute.Sitemap = CATEGORY_HUBS.map((cat) => ({
    url: `${BASE}/${cat}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticEntries, ...hubEntries, ...pseoEntries];
}
