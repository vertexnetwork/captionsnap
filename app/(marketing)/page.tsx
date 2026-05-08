import type { Metadata } from "next";
import { SimulatorProvider } from "@/components/simulator/SimulatorProvider";
import { Simulator } from "@/components/simulator/Simulator";
import { MediaVineSlot } from "@/components/ads/MediaVineSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { decodeOrDefault } from "@/lib/share";

export const metadata: Metadata = {
  title: "CaptionSnap — Stop ad copy from getting truncated",
  description:
    "Free Meta + TikTok ad-copy simulator. Paste your copy, see exactly where it truncates and which UI overlays cover it.",
  alternates: { canonical: "/" },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const params = await searchParams;
  const initialState = decodeOrDefault(params.s ?? null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Stop guessing where your ad copy gets <span className="text-accent glow">cut off</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
          Paste your Meta or TikTok ad copy and instantly see character-limit violations, see-more
          truncation, and which UI overlays cover your hook. Free, no signup, the URL is the database.
        </p>
        <ul className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
          <li className="rounded-full border border-border bg-card px-3 py-1">17 placements</li>
          <li className="rounded-full border border-border bg-card px-3 py-1">Meta + TikTok</li>
          <li className="rounded-full border border-border bg-card px-3 py-1">Share via URL</li>
          <li className="rounded-full border border-border bg-card px-3 py-1">No tracking of copy</li>
        </ul>
      </section>

      <SimulatorProvider initialState={initialState}>
        <Simulator />
      </SimulatorProvider>

      <div className="mt-10">
        <MediaVineSlot id="home-below-fold" />
      </div>

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
            "Free ad-copy simulator that previews Meta and TikTok character limits and UI safe zones in real time.",
        }}
      />
    </div>
  );
}
