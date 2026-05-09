import type { Metadata } from "next";
import Link from "next/link";
import { SimulatorProvider } from "@/components/simulator/SimulatorProvider";
import { Simulator } from "@/components/simulator/Simulator";
import { JsonLd } from "@/components/seo/JsonLd";
import { decode, DEFAULT_STATE } from "@/lib/share";
import { PLACEMENTS } from "@/lib/platform-specs";

export const metadata: Metadata = {
  title: "CaptionSnap — Stop ad copy from getting truncated",
  description:
    "Free ad-copy simulator for performance marketers and small agencies. Paste your copy, see exactly where every platform clips it — Meta, TikTok, LinkedIn, X, YouTube, Pinterest, Reddit, Snapchat. No signup. Pro at $49/mo unlocks bulk paste of 10 headlines and PNG export.",
  alternates: { canonical: "/" },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const params = await searchParams;
  const decoded = decode(params.s ?? null);
  const initialState = decoded ?? DEFAULT_STATE;
  const decodeFailed = Boolean(params.s) && decoded === null;
  const hasInitialShareLink = Boolean(params.s) && decoded !== null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Stop guessing where your ad copy gets <span className="text-accent glow">clipped</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
          Paste your ad copy for Meta, TikTok, LinkedIn, X, YouTube, Pinterest,
          Reddit, or Snapchat and see exactly where each platform clips it,
          plus which UI overlays cover your hook. Free, no signup. Built for
          performance marketers and small agencies.
        </p>
        <ul className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
          <li className="rounded-full border border-border bg-card px-3 py-1">8 platforms · {PLACEMENTS.length} placements</li>
          <li className="rounded-full border border-border bg-card px-3 py-1">Share via URL</li>
          <li className="rounded-full border border-border bg-card px-3 py-1">No tracking of copy</li>
          <li>
            <Link
              href="/pricing"
              className="rounded-full border border-accent/60 bg-card px-3 py-1 text-accent hover:bg-accent/10"
            >
              Pro: bulk + PNG export →
            </Link>
          </li>
          <li>
            <Link
              href="/extension"
              className="rounded-full border border-accent/60 bg-card px-3 py-1 text-accent hover:bg-accent/10"
            >
              Chrome extension →
            </Link>
          </li>
        </ul>
      </section>

      <SimulatorProvider
        initialState={initialState}
        decodeFailed={decodeFailed}
        hasInitialShareLink={hasInitialShareLink}
      >
        <Simulator />
      </SimulatorProvider>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "CaptionSnap",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io",
          description:
            "Free ad-copy simulator that previews character limits and UI safe zones across Meta, TikTok, LinkedIn, X, YouTube, Pinterest, Reddit, and Snapchat in real time.",
        }}
      />
    </div>
  );
}
