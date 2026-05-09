import type { Metadata } from "next";
import Link from "next/link";
import { LAST_VERIFIED_GLOBAL, PLACEMENTS } from "@/lib/platform-specs";
import { PSEO_INDEX } from "@/data/pseo-index";

export const metadata: Metadata = {
  title: "About CaptionSnap",
  description:
    "Why CaptionSnap exists, who built it, and how the platform-spec data stays current across Meta, TikTok, LinkedIn, X, YouTube, Pinterest, Reddit, and Snapchat placements.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-invert">
      <h1>About CaptionSnap</h1>
      <p>
        CaptionSnap is a free utility for media buyers, paid-social managers, and
        creative teams who keep shipping ads with copy that gets clipped at
        &ldquo;See more&rdquo; — or worse, hidden behind a CTA button or a profile
        avatar. Paste your ad copy. See the truncation in real time. Fix it before
        launch. No account, no upload, no waiting.
      </p>

      <h2>Why this exists</h2>
      <p>
        Every ad platform truncates copy differently. Meta clips primary text at
        roughly 125 characters on Feed but at 55 on Reels. TikTok hides everything
        past ~100 characters behind a tap. LinkedIn collapses at 150 on desktop and
        140 on mobile. None of these limits are documented in one place, and most
        change quietly. Teams ship copy that looks fine in the ad-builder preview,
        then dies in the wild because the live placement covers the bottom 22% of
        the canvas with a username block.
      </p>
      <p>
        CaptionSnap solves both halves of the problem at once: <strong>character
        limits</strong> (where the platform stops rendering) and <strong>safe
        zones</strong> (where the platform&apos;s own UI chrome — progress bars,
        avatars, captions, CTA pills — covers your creative). The simulator renders
        an authentic per-placement layout so what you see is what your audience
        sees.
      </p>

      <h2>How the data stays current</h2>
      <p>
        Every limit, truncation point, warn threshold, and safe-zone rectangle
        lives in a single source-of-truth file (<code>lib/platform-specs.ts</code>).
        The verification pipeline:
      </p>
      <ol>
        <li>
          <strong>Run paid impressions</strong> on each live placement with copy
          calibrated to the boundary (e.g., a string ending exactly at the
          suspected clamp).
        </li>
        <li>
          <strong>Capture the rendered creative</strong> from a real device on
          first-party network conditions — not the platform&apos;s preview tool,
          which lies.
        </li>
        <li>
          <strong>Measure</strong> the safe-zone rectangles in pixels, normalize
          to percentages, and update the spec with a fresh <code>lastVerified</code>
          date.
        </li>
        <li>
          <strong>Regression-test</strong>{" "}
          (<code>tests/unit/truncate.test.ts</code>) every placement × field combo
          before shipping.
        </li>
      </ol>
      <p>
        The most recent global re-verification was{" "}
        <strong>{LAST_VERIFIED_GLOBAL}</strong>. Spec drift between runs is reported
        publicly in the changelog below.
      </p>

      <h2>Who built it</h2>
      <p>
        CaptionSnap is an indie operation. The architecture is intentionally
        minimal: Next.js on Vercel, no database, no authentication, no server-side
        state. The URL <em>is</em> the database — share-link state is encoded into
        the query string with lz-string, so links work without an account and
        nothing about your copy is stored on our servers. Embeds are sandboxed
        iframes; the simulator runs entirely in your browser.
      </p>
      <p>
        That minimalism is a feature, not a constraint. It&apos;s why the simulator
        loads in under a second, why share links never expire, why there&apos;s no
        login wall in front of a tool you should be able to use in 30 seconds.
      </p>

      <h2>What we don&apos;t do</h2>
      <ul>
        <li>
          <strong>No AI caption generator.</strong> The market is saturated and the
          margin is brutal. We focus on what platforms actually <em>do</em> with
          copy you already wrote.
        </li>
        <li>
          <strong>No accounts.</strong> Ever. Share links are stateless.
        </li>
        <li>
          <strong>No live spec scraping.</strong> Quarterly re-verification by
          paid impression is more reliable than scrapers that break the moment a
          platform ships a redesign.
        </li>
        <li>
          <strong>No paid tier today.</strong> The site is ad-supported via
          MediaVine Journey. Ad slots ship empty until approval lands.
        </li>
      </ul>

      <h2>Coverage</h2>
      <p>
        {PLACEMENTS.length} placements across 8 platforms. {PSEO_INDEX.length}{" "}
        platform-specific guides covering character limits, safe zones, comparisons,
        and glossary terms — see the{" "}
        <Link href="/sitemap.xml">sitemap</Link> for the full list.
      </p>

      <h2>Chrome extension</h2>
      <p>
        Same simulator, in your toolbar.{" "}
        <Link href="/extension">CaptionSnap for Chrome</Link> reads the same
        platform-spec data as the website — when we re-verify a placement,
        the next extension build picks it up automatically. Popup-only, no
        host permissions, fully offline.
      </p>

      <h2>Get in touch</h2>
      <p>
        Spec error? Missing placement? Ideas?{" "}
        <Link href="/contact">Contact us</Link> or email{" "}
        <a href="mailto:hello@captionsnap.io" className="underline hover:text-accent">
          hello@captionsnap.io
        </a>
        .
      </p>

      <h2>Changelog</h2>
      <ul>
        <li>
          <strong>{LAST_VERIFIED_GLOBAL}</strong> — Re-verified all 2026 placements
          across Meta, TikTok, LinkedIn, X, YouTube, Pinterest, Reddit, and
          Snapchat.
        </li>
        <li>
          Initial launch — {PLACEMENTS.length} placements, {PSEO_INDEX.length}{" "}
          pSEO pages, share-link OG images, iframe embed.
        </li>
      </ul>
    </article>
  );
}
