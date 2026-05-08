import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The simple terms of using CaptionSnap.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: 2026-04-15</p>
      <h2>Use of the simulator</h2>
      <p>
        CaptionSnap is provided free of charge on an as-is basis. The platform-spec data
        is collected from publicly available sources and re-verified by paid live-ad
        impressions. We make best effort to keep it current, but ad platform behavior
        can change without notice. Use at your own risk.
      </p>
      <h2>Embedding</h2>
      <p>
        You may embed the simulator on your own site using the snippet generator at{" "}
        <Link href="/embed">/embed</Link>. The embed must retain the &ldquo;Powered by
        CaptionSnap&rdquo; backlink visible in the bottom-right of the iframe.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Don&apos;t scrape the site programmatically at high volume. Don&apos;t embed
        ads or content that violates platform policies inside the simulator.
        Don&apos;t use the share-link encoder to distribute malicious content.
      </p>
      <h2>No warranty</h2>
      <p>
        The site is provided without warranty of any kind. We are not liable for ad
        spend lost due to spec drift or simulator errors. If you spot a spec error,
        let us know.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these terms occasionally. Material changes will be reflected by an
        updated date at the top of this page.
      </p>
    </article>
  );
}
