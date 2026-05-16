// Reference screenshot pipeline. For each placement of the target platform(s),
// drives the live simulator via a share URL and captures the device canvas
// into reference/screenshots/<device>/<platform>/<placement-id>.png.
//
// Usage: node scripts/reference-shots.mjs [platform]   (default: meta)
import { chromium } from "playwright";
import LZString from "lz-string";
import { mkdir } from "node:fs/promises";
import { PLACEMENTS, hasDesktop } from "../lib/platform-specs.ts";

const platform = process.argv[2] || "meta";
const base = process.env.BASE_URL || "http://localhost:3320";

const SAMPLE = {
  primary:
    "Stop guessing where your ad copy gets clipped — this hook keeps going well past the fold so you can see exactly where every platform cuts it off and which UI overlay lands on top of your call to action.",
  headline: "See exactly where your ad clips before you spend",
  description: "Free · no signup · the URL is the database",
  caption:
    "Stop guessing where your caption gets clipped 👀 full hook here so truncation is visible #ads #mediabuying",
};

function encode(state) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(state));
}

const placements = PLACEMENTS.filter((p) => p.platform === platform);
const browser = await chromium.launch();
let shot = 0;

for (const device of ["mobile", "desktop"]) {
  const dir = `reference/screenshots/${device}/${platform}`;
  await mkdir(dir, { recursive: true });
  const viewport =
    device === "mobile"
      ? { width: 480, height: 920 }
      : { width: 1280, height: 900 };

  for (const p of placements) {
    const fields = {};
    for (const f of p.fields) fields[f.id] = SAMPLE[f.id] ?? SAMPLE.primary;
    const state = { v: 1, placementId: p.id, fields, display: { device } };
    const url = `${base}/?s=${encode(state)}`;

    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    // Pre-accept consent so the fixed cookie banner never bleeds into shots.
    await page.addInitScript(() =>
      window.localStorage.setItem("captionsnap-consent-v1", "accepted"),
    );
    await page.goto(url, { waitUntil: "networkidle" });
    const canvas = page.locator('[data-testid="safe-zone-canvas"]');
    await canvas.waitFor({ state: "visible", timeout: 15000 });
    await page.waitForTimeout(500);
    const out = `${dir}/${p.id}.png`;
    await canvas.screenshot({ path: out });
    await page.close();
    shot++;
    const tag = device === "desktop" && !hasDesktop(p) ? " (mobile-only state)" : "";
    console.log(`✓ ${device}/${platform}/${p.id}.png${tag}`);
  }
}

await browser.close();
console.log(`\nDone — ${shot} screenshots for "${platform}".`);
