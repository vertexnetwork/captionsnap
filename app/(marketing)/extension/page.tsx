import type { Metadata } from "next";
import Link from "next/link";
import { CHROME_WEBSTORE_URL, EXTENSION_AVAILABLE } from "@/lib/extension";

export const metadata: Metadata = {
  title: "CaptionSnap for Chrome",
  description:
    "Preview ad-copy truncation across 8 platforms from your Chrome toolbar. Popup-only, no permissions, fully offline. Free; one-click handoff to the full simulator on captionsnap.io.",
  alternates: { canonical: "/extension" },
};

export default function ExtensionPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-invert">
      <h1>CaptionSnap for Chrome</h1>
      <p>
        Same simulator, in your toolbar. Paste ad copy, see exactly where each
        platform clips it, hand off to the full simulator with one click. The
        popup is free, fully offline, and stays out of the way — no host
        permissions, no content scripts, no tracking SDK.
      </p>
      <p>
        Pro features — <Link href="/bulk">bulk paste of 10 headlines</Link>,
        PNG export, priority spec re-verification — live on the website. The
        popup&apos;s &ldquo;Open full simulator&rdquo; button hands your current
        copy off to captionsnap.io with one click.
      </p>

      {EXTENSION_AVAILABLE && CHROME_WEBSTORE_URL ? (
        <p>
          <a
            href={CHROME_WEBSTORE_URL}
            className="btn-base bg-accent text-sm text-black no-underline hover:opacity-90"
          >
            Install for Chrome →
          </a>
        </p>
      ) : (
        <p className="rounded-md border border-border/60 bg-card/40 px-4 py-3">
          <strong>Coming soon to the Chrome Web Store.</strong> The build is ready
          and the popup is feature-complete — we&apos;re finalizing icons and
          screenshots for the listing.
        </p>
      )}

      <h2>What it does</h2>
      <ul>
        <li>
          Pick a platform (Meta, TikTok, LinkedIn, X, YouTube, Pinterest, Reddit,
          Snapchat) and a placement.
        </li>
        <li>Paste primary text, headline, and description.</li>
        <li>
          See live counters and a truncated preview showing exactly where the
          platform clamps your copy.
        </li>
        <li>
          One-click handoff to the full <Link href="/">captionsnap.io</Link>{" "}
          simulator with your copy already loaded — for safe-zone overlays,
          embed snippets, and share links.
        </li>
      </ul>

      <h2>What it doesn&apos;t do</h2>
      <ul>
        <li>
          <strong>No host permissions.</strong> The extension cannot read any
          page you visit.
        </li>
        <li>
          <strong>No content scripts.</strong> It does not inject UI into Meta /
          TikTok / LinkedIn ad managers — those surfaces are CSP-locked and
          break weekly. The popup gives you 80% of the value with none of the
          breakage.
        </li>
        <li>
          <strong>No telemetry.</strong> We don&apos;t ship an analytics SDK in
          the extension. Outbound links carry a UTM tag so attribution lands in
          our website analytics, not a tracker bundled in the popup.
        </li>
      </ul>

      <h2>Source</h2>
      <p>
        The extension reads the same{" "}
        <code>lib/platform-specs.ts</code>, <code>lib/truncate.ts</code>, and{" "}
        <code>lib/share.ts</code> as the website. When we re-verify a placement
        and update a spec, the next extension build picks it up automatically.
        See <Link href="/about">how the data stays current</Link>.
      </p>
    </article>
  );
}
