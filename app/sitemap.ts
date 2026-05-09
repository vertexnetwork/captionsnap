import type { MetadataRoute } from "next";
import { PSEO_INDEX } from "@/data/pseo-index";
import { getPlacement, LAST_VERIFIED_GLOBAL } from "@/lib/platform-specs";

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
    { url: BASE + "/privacy", lastModified: today, changeFrequency: "yearly", priority: 0.3 },
    { url: BASE + "/terms", lastModified: today, changeFrequency: "yearly", priority: 0.3 },
  ];

  const pseoEntries: MetadataRoute.Sitemap = PSEO_INDEX.map((entry) => {
    const placement = getPlacement(entry.placementId);
    const lastModified = placement?.lastVerified ?? entry.publishedAt ?? LAST_VERIFIED_GLOBAL;
    return {
      url: `${BASE}/${entry.slug}`,
      lastModified: new Date(lastModified),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  return [...staticEntries, ...pseoEntries];
}
