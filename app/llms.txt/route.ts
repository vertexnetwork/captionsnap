import { PSEO_INDEX, type PseoCategory } from "@/data/pseo-index";
import { PLACEMENTS, platformLabel, type Platform } from "@/lib/platform-specs";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";

export const revalidate = 3600;

const PLATFORMS: Platform[] = [
  "meta",
  "tiktok",
  "linkedin",
  "x",
  "youtube",
  "pinterest",
  "snapchat",
  "reddit",
];

const CATEGORY_ORDER: PseoCategory[] = [
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

const CATEGORY_LABEL: Record<PseoCategory, string> = {
  meta: "Meta",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  pinterest: "Pinterest",
  reddit: "Reddit",
  snapchat: "Snapchat",
  compare: "Cross-platform comparisons",
  guides: "Guides",
  glossary: "Glossary",
};

export async function GET() {
  const platformList = PLATFORMS.filter(
    (p) => PLACEMENTS.some((pl) => pl.platform === p),
  )
    .map(platformLabel)
    .join(", ");

  const lines: string[] = [];
  lines.push("# CaptionSnap");
  lines.push("");
  lines.push(
    `> Free utility that previews where ad copy gets truncated and which UI overlays cover it across ${PLACEMENTS.length} placements on ${platformList}.`,
  );
  lines.push("");
  lines.push("## Primary URLs");
  lines.push(`- [Home / simulator](${BASE}/)`);
  lines.push(`- [Pricing — CaptionSnap Pro ($49/mo or $499/yr)](${BASE}/pricing)`);
  lines.push(`- [Bulk preview (Pro feature) — 10 headlines × every placement](${BASE}/bulk)`);
  lines.push(`- [Embed snippet generator](${BASE}/embed)`);
  lines.push(`- [Chrome extension](${BASE}/extension)`);
  lines.push(`- [About — methodology and verification process](${BASE}/about)`);
  lines.push(`- [Contact](${BASE}/contact)`);
  lines.push(`- [Privacy policy](${BASE}/privacy)`);
  lines.push(`- [Terms of service](${BASE}/terms)`);
  lines.push(`- [Sitemap](${BASE}/sitemap.xml)`);
  lines.push(`- [Full content (LLM-friendly)](${BASE}/llms-full.txt)`);
  lines.push("");
  lines.push("## What CaptionSnap is");
  lines.push("");
  lines.push(
    `Free utility (with optional $49/mo Pro tier) that previews where ad copy gets clipped and which UI overlays cover it across ${PLACEMENTS.length} placements on ${platformList}. No accounts. URL is the database. Pro adds bulk paste of 10 headlines, PNG export, and priority spec re-verification.`,
  );
  lines.push("");
  lines.push("## Categories");
  for (const category of CATEGORY_ORDER) {
    const entries = PSEO_INDEX.filter((e) => e.category === category);
    if (entries.length === 0) continue;
    lines.push(`### ${CATEGORY_LABEL[category]}`);
    for (const e of entries) {
      lines.push(`- [${e.title}](${BASE}/${e.slug}) — ${e.description}`);
    }
    lines.push("");
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
