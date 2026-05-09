import { promises as fs } from "node:fs";
import path from "node:path";
import { PSEO_INDEX } from "@/data/pseo-index";
import { PLACEMENTS, getPlacement } from "@/lib/platform-specs";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";

export const revalidate = 3600;

// Find the closing `/>` for a JSX self-closing tag starting at index `start`,
// while honoring nested brackets, strings, and template literals.
function findSelfCloseEnd(src: string, start: number): number {
  let depthBracket = 0;
  let depthBrace = 0;
  let i = start;
  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      i++;
      while (i < src.length && src[i] !== quote) {
        if (src[i] === "\\") i++;
        i++;
      }
      i++;
      continue;
    }
    if (c === "[") depthBracket++;
    else if (c === "]") depthBracket--;
    else if (c === "{") depthBrace++;
    else if (c === "}") depthBrace--;
    else if (c === "/" && src[i + 1] === ">" && depthBracket === 0 && depthBrace === 0) {
      return i + 2;
    }
    i++;
  }
  return -1;
}

// Strip a self-closing JSX component, returning replacement text.
function stripComponent(src: string, name: string, replacer: (raw: string) => string): string {
  const tag = "<" + name;
  let out = "";
  let i = 0;
  while (i < src.length) {
    const idx = src.indexOf(tag, i);
    if (idx === -1) {
      out += src.slice(i);
      break;
    }
    const after = src.charCodeAt(idx + tag.length);
    // ensure boundary char (space/newline/>) — skip false positives like <FAQItem
    const ok = after === 32 /* space */ || after === 9 /* tab */ || after === 10 /* lf */ || after === 13 /* cr */ || after === 62 /* > */;
    if (!ok) {
      out += src.slice(i, idx + tag.length);
      i = idx + tag.length;
      continue;
    }
    const end = findSelfCloseEnd(src, idx + tag.length);
    if (end === -1) {
      out += src.slice(i);
      break;
    }
    out += src.slice(i, idx);
    out += replacer(src.slice(idx, end));
    i = end;
  }
  return out;
}

// Pull the items array literal off a FAQ tag and convert to Q/A markdown.
function faqToMarkdown(raw: string): string {
  const m = raw.match(/items=\{([\s\S]*)\}/);
  if (!m) return "";
  const arr = m[1].trim();
  // Walk the JS array, extracting q/a pairs heuristically by string literal.
  const items: { q: string; a: string }[] = [];
  let i = 0;
  let pendingQ: string | null = null;
  while (i < arr.length) {
    if (arr[i] === "q" && /\s*:/.test(arr.slice(i + 1))) {
      const colon = arr.indexOf(":", i);
      const valueStart = colon + 1;
      const [val, end] = readString(arr, valueStart);
      if (val !== null) {
        pendingQ = val;
        i = end;
        continue;
      }
    }
    if (arr[i] === "a" && /\s*:/.test(arr.slice(i + 1)) && pendingQ !== null) {
      const colon = arr.indexOf(":", i);
      const valueStart = colon + 1;
      const [val, end] = readString(arr, valueStart);
      if (val !== null) {
        items.push({ q: pendingQ, a: val });
        pendingQ = null;
        i = end;
        continue;
      }
    }
    i++;
  }
  if (items.length === 0) return "";
  const lines = ["## FAQ", ""];
  for (const it of items) {
    lines.push(`### ${it.q}`);
    lines.push(it.a);
    lines.push("");
  }
  return lines.join("\n");
}

function readString(src: string, from: number): [string | null, number] {
  let i = from;
  while (i < src.length && /\s/.test(src[i])) i++;
  const quote = src[i];
  if (quote !== '"' && quote !== "'" && quote !== "`") return [null, from];
  i++;
  let out = "";
  while (i < src.length && src[i] !== quote) {
    if (src[i] === "\\" && i + 1 < src.length) {
      const next = src[i + 1];
      if (next === "n") out += "\n";
      else if (next === "t") out += "\t";
      else out += next;
      i += 2;
      continue;
    }
    out += src[i];
    i++;
  }
  i++; // closing quote
  return [out, i];
}

async function readMdx(slug: string): Promise<string> {
  const file = path.join(process.cwd(), "content", "pseo", `${slug}.mdx`);
  let raw = "";
  try {
    raw = await fs.readFile(file, "utf-8");
  } catch {
    return "";
  }
  raw = stripComponent(raw, "SimulatorPreset", () => "");
  raw = stripComponent(raw, "SpecTable", () => "");
  raw = stripComponent(raw, "RelatedPages", () => "");
  raw = stripComponent(raw, "LastVerifiedBadge", () => "");
  raw = stripComponent(raw, "FAQ", faqToMarkdown);
  return raw.trim();
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
  out.push("## About");
  out.push("");
  out.push(
    `CaptionSnap is a free ad-copy truncation simulator covering ${PLACEMENTS.length} placements across 8 platforms (Meta, TikTok, LinkedIn, X, YouTube, Pinterest, Reddit, Snapchat). It is stateless — share-link state is encoded into the URL itself, no accounts or database. An optional Pro tier ($49/month or $499/year) at ${BASE}/pricing unlocks bulk preview of 10 headlines across every placement, PNG export of the simulator output, and priority spec re-verification when platforms ship UI changes. Subscriptions are billed via Stripe; cancellation is self-service through the Stripe Customer Portal.`,
  );
  out.push("");
  out.push(`Pricing: ${BASE}/pricing`);
  out.push(`Bulk preview (Pro): ${BASE}/bulk`);
  out.push(`Chrome extension: ${BASE}/extension`);
  out.push(`Embed snippet generator: ${BASE}/embed`);
  out.push(`Methodology and verification process: ${BASE}/about`);
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
    if (body) out.push(body);
    out.push("");
    out.push("---");
    out.push("");
  }

  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
