import { promises as fs } from "node:fs";
import path from "node:path";
import { PSEO_INDEX } from "@/data/pseo-index";
import { PLACEMENTS, getPlacement } from "@/lib/platform-specs";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";

export const revalidate = 3600;

async function readMdx(slug: string): Promise<string> {
  const file = path.join(process.cwd(), "content", "pseo", `${slug}.mdx`);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return raw
      .replace(/<SimulatorPreset[\s\S]*?\/>/g, "")
      .replace(/<SpecTable[\s\S]*?\/>/g, "")
      .replace(/<FAQ[\s\S]*?items=\{(\[[\s\S]*?\])\}[\s\S]*?\/>/g, "$1")
      .replace(/<RelatedPages[\s\S]*?\/>/g, "")
      .replace(/<LastVerifiedBadge[\s\S]*?\/>/g, "");
  } catch {
    return "";
  }
}

function placementMarkdown(): string {
  const lines = ["## Platform spec source of truth", ""];
  for (const p of PLACEMENTS) {
    lines.push(`### ${p.label} (${p.id})`);
    lines.push(`Platform: ${p.platform}. Surface: ${p.surface}. Last verified: ${p.lastVerified}.`);
    lines.push(`Source: ${p.sourceUrl}`);
    lines.push("");
    lines.push("Fields:");
    for (const f of p.fields) {
      lines.push(`- ${f.label}: max ${f.max}, visible ${f.truncateAt}, warn ${f.warnAt ?? "auto"}`);
    }
    lines.push("");
    lines.push("Safe zones:");
    for (const z of p.safeZones) {
      lines.push(`- ${z.id} (${z.x}%,${z.y}% ${z.w}×${z.h}): ${z.reason}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export async function GET() {
  const out: string[] = [];
  out.push("# CaptionSnap — Full Content");
  out.push("");
  out.push(`Source: ${BASE}/llms-full.txt`);
  out.push("");
  out.push(placementMarkdown());

  for (const entry of PSEO_INDEX) {
    out.push(`## ${entry.title}`);
    out.push("");
    out.push(`URL: ${BASE}/${entry.slug}`);
    const placement = getPlacement(entry.placementId);
    if (placement) {
      out.push(`Placement: ${placement.label} (last verified ${placement.lastVerified})`);
    }
    out.push("");
    out.push(entry.description);
    out.push("");
    const body = await readMdx(entry.slug);
    if (body) out.push(body.trim());
    out.push("");
    out.push("---");
    out.push("");
  }

  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
