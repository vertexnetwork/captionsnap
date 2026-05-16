// Ad-hoc screenshot helper. Usage:
//   node scripts/shoot.mjs <url-path> <out.png> <width> [height] [selector]
import { chromium } from "playwright";

const [, , path = "/", out = "reference/tmp.png", w = "390", h = "844", sel] =
  process.argv;
const base = process.env.BASE_URL || "http://localhost:3320";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 2,
});
await page.goto(base + path, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const target = sel ? page.locator(sel) : page;
await target.screenshot({ path: out, ...(sel ? {} : { fullPage: true }) });
await browser.close();
console.log("wrote", out);
