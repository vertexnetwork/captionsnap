import type { Metadata } from "next";
import { LAST_VERIFIED_GLOBAL, PLACEMENTS } from "@/lib/platform-specs";
import { PSEO_INDEX } from "@/data/pseo-index";

export const metadata: Metadata = {
  title: "About CaptionSnap",
  description:
    "Why CaptionSnap is free, who built it, and how the platform-spec data stays current.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-invert">
      <h1>About CaptionSnap</h1>
      <p>
        CaptionSnap is a free utility for media buyers, PPC managers, and creative teams
        who are tired of shipping ads with copy that gets clipped at &ldquo;See more&rdquo;.
        Paste your ad copy, see the truncation in real time, fix it before launch.
      </p>
      <h2>Why free?</h2>
      <p>
        The site is ad-supported. We&apos;re applying for MediaVine Journey approval, and
        until that lands, ad slots ship empty. We never charge for the simulator, the
        embed, or the share links.
      </p>
      <h2>How the data stays current</h2>
      <p>
        Every limit, truncation rule, and safe-zone rectangle lives in a single source of
        truth file (<code>lib/platform-specs.ts</code>). When platforms change their
        clamps, we re-verify with paid impressions on the live placement, update the
        spec, and bump the <code>lastVerified</code> date. The most recent global
        verification was <strong>{LAST_VERIFIED_GLOBAL}</strong>.
      </p>
      <h2>Who built it</h2>
      <p>
        CaptionSnap is a one-person operation built by an indie engineer. The architecture
        is intentionally minimal — Next.js on Vercel, no database, no auth. The
        URL <em>is</em> the database. That&apos;s why share links work without an
        account.
      </p>
      <h2>Changelog</h2>
      <ul>
        <li><strong>{LAST_VERIFIED_GLOBAL}</strong> — Re-verified all 2026 placements.</li>
        <li>Initial launch — {PLACEMENTS.length} placements, {PSEO_INDEX.length} pSEO pages, share-link OG images, iframe embed.</li>
      </ul>
    </article>
  );
}
