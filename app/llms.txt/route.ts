import { PSEO_INDEX } from "@/data/pseo-index";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";

export const revalidate = 3600;

export async function GET() {
  const lines: string[] = [];
  lines.push("# CaptionSnap");
  lines.push("");
  lines.push("> Free utility that previews where Meta and TikTok ad copy gets truncated and which UI overlays cover it.");
  lines.push("");
  lines.push("## Primary URLs");
  lines.push(`- [Home / simulator](${BASE}/)`);
  lines.push(`- [Embed snippet generator](${BASE}/embed)`);
  lines.push(`- [About](${BASE}/about)`);
  lines.push(`- [Sitemap](${BASE}/sitemap.xml)`);
  lines.push(`- [Full content (LLM-friendly)](${BASE}/llms-full.txt)`);
  lines.push("");
  lines.push("## Categories");
  for (const category of ["meta", "tiktok", "guides", "compare", "glossary"]) {
    const entries = PSEO_INDEX.filter((e) => e.category === category);
    if (entries.length === 0) continue;
    lines.push(`### ${category}`);
    for (const e of entries) {
      lines.push(`- [${e.title}](${BASE}/${e.slug}) — ${e.description}`);
    }
    lines.push("");
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
