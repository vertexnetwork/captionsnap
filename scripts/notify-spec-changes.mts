#!/usr/bin/env node
// Muse-safe spec-change digest.
//
// Trigger:   content/spec-changes.json — a CURATED log the operator appends to
//            when a spec is re-verified. Not the git-derived changelog (which
//            is every commit and far too noisy to email).
// Audience:  active LemonSqueezy subscribers, pulled live from the LS API at
//            send time. We hold no customer database.
// Delivery:  Resend, one email per subscriber (never expose the list).
// Idempotency: content/.spec-digest-state.json holds the high-water date.
//            Entries with date <= watermark are never re-sent. The workflow
//            commits the watermark back.
//
// Safe to run before Pro is live: with no RESEND/LS keys it dry-runs and
// exits 0. On first run with no watermark it initialises silently (it does
// NOT blast the backlog).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

type SpecChange = {
  date: string; // YYYY-MM-DD
  platform: string; // e.g. "Meta"
  placement: string; // e.g. "Facebook Feed primary text"
  summary: string; // what changed, in one line
};

const ROOT = process.cwd();
const SRC = resolve(ROOT, "content", "spec-changes.json");
const STATE = resolve(ROOT, "content", ".spec-digest-state.json");
const ISO = /^\d{4}-\d{2}-\d{2}$/;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";
const FROM = process.env.EMAIL_FROM ?? "CaptionSnap <hello@captionsnap.io>";
const RESEND_KEY = process.env.RESEND_API_KEY;
const LS_KEY = process.env.LEMONSQUEEZY_API_KEY;

function log(msg: string): void {
  process.stdout.write(`spec-digest: ${msg}\n`);
}

function readChanges(): SpecChange[] {
  if (!existsSync(SRC)) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(SRC, "utf-8"));
  } catch {
    log("spec-changes.json is not valid JSON — aborting");
    process.exit(1);
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (e): e is SpecChange =>
      !!e &&
      typeof e.date === "string" &&
      ISO.test(e.date) &&
      typeof e.platform === "string" &&
      typeof e.placement === "string" &&
      typeof e.summary === "string",
  );
}

function readWatermark(): string | null {
  if (!existsSync(STATE)) return null;
  try {
    const s = JSON.parse(readFileSync(STATE, "utf-8")) as { lastNotified?: string };
    return typeof s.lastNotified === "string" ? s.lastNotified : null;
  } catch {
    return null;
  }
}

function writeWatermark(date: string): void {
  writeFileSync(STATE, JSON.stringify({ lastNotified: date }, null, 2) + "\n", "utf-8");
}

async function fetchActiveSubscriberEmails(): Promise<string[]> {
  const emails = new Set<string>();
  let url: string | null =
    "https://api.lemonsqueezy.com/v1/subscriptions?filter[status]=active&page[size]=100";
  while (url) {
    const res: Response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LS_KEY}`,
        Accept: "application/vnd.api+json",
      },
    });
    if (!res.ok) {
      throw new Error(`ls_subscriptions_failed_${res.status}`);
    }
    const json = (await res.json()) as {
      data?: { attributes?: { user_email?: string; status?: string } }[];
      links?: { next?: string | null };
    };
    for (const row of json.data ?? []) {
      const email = row.attributes?.user_email;
      if (email) emails.add(email.toLowerCase());
    }
    url = json.links?.next ?? null;
  }
  return [...emails];
}

function renderDigest(changes: SpecChange[]): { subject: string; text: string; html: string } {
  const n = changes.length;
  const subject =
    n === 1
      ? "1 ad spec changed — CaptionSnap re-verification"
      : `${n} ad specs changed — CaptionSnap re-verification`;

  const lines = changes
    .map((c) => `• [${c.platform}] ${c.placement} — ${c.summary} (verified ${c.date})`)
    .join("\n");
  const text = [
    `We re-verified specs against live placements. ${n} change${n === 1 ? "" : "s"} this cycle:`,
    "",
    lines,
    "",
    `Full, dated history: ${SITE}/changelog`,
    `Re-check your live copy: ${SITE}`,
    "",
    "You receive this because you have an active CaptionSnap Pro subscription.",
  ].join("\n");

  const rows = changes
    .map(
      (c) =>
        `<tr><td style="padding:6px 0;color:#555"><strong>${c.platform}</strong> · ${c.placement}<br/><span style="color:#111">${c.summary}</span> <span style="color:#999">(verified ${c.date})</span></td></tr>`,
    )
    .join("");
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.6;color:#111">
      <p>We re-verified specs against live placements. <strong>${n} change${n === 1 ? "" : "s"}</strong> this cycle:</p>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p><a href="${SITE}/changelog" style="color:#111">Full dated history</a> · <a href="${SITE}" style="color:#111">Re-check your copy</a></p>
      <p style="color:#999;font-size:12px">You receive this because you have an active CaptionSnap Pro subscription.</p>
    </div>`.trim();

  return { subject, text, html };
}

async function sendOne(
  to: string,
  d: { subject: string; text: string; html: string },
): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject: d.subject, text: d.text, html: d.html }),
  });
  return res.ok;
}

// ───────────────────────── main ─────────────────────────

const changes = readChanges().sort((a, b) => (a.date < b.date ? -1 : 1));
if (changes.length === 0) {
  log("no spec changes recorded — nothing to do");
  process.exit(0);
}

const maxDate = changes[changes.length - 1]!.date;
const watermark = readWatermark();

if (watermark === null) {
  // First ever run: initialise the watermark, do NOT email the backlog.
  writeWatermark(maxDate);
  log(`initialised watermark at ${maxDate} (no backlog email sent)`);
  process.exit(0);
}

const pending = changes.filter((c) => c.date > watermark);
if (pending.length === 0) {
  log(`up to date (watermark ${watermark})`);
  process.exit(0);
}

const digest = renderDigest(pending);

if (!RESEND_KEY || !LS_KEY) {
  log(
    `DRY RUN (RESEND_API_KEY/LEMONSQUEEZY_API_KEY unset) — would send "${digest.subject}" covering ${pending.length} change(s) to active subscribers`,
  );
  log("watermark NOT advanced (dry run)");
  process.exit(0);
}

let recipients: string[];
try {
  recipients = await fetchActiveSubscriberEmails();
} catch (err) {
  log(`failed to list LS subscribers: ${(err as Error).message} — aborting, watermark unchanged`);
  process.exit(1);
}

if (recipients.length === 0) {
  log("no active subscribers — advancing watermark, nothing sent");
  writeWatermark(maxDate);
  process.exit(0);
}

let ok = 0;
let failed = 0;
for (const to of recipients) {
  try {
    if (await sendOne(to, digest)) ok++;
    else failed++;
  } catch {
    failed++;
  }
  await new Promise((r) => setTimeout(r, 120)); // gentle Resend pacing
}

log(`sent=${ok} failed=${failed} of ${recipients.length} for ${pending.length} change(s)`);

if (failed === 0) {
  writeWatermark(maxDate);
  log(`watermark advanced to ${maxDate}`);
} else {
  log("some sends failed — watermark NOT advanced (will retry next run)");
  process.exit(1);
}
