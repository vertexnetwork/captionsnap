import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Zap, Share2 } from "lucide-react";
import { SimulatorProvider } from "@/components/simulator/SimulatorProvider";
import { Simulator } from "@/components/simulator/Simulator";
import { JsonLd } from "@/components/seo/JsonLd";
import { decode, DEFAULT_STATE } from "@/lib/share";
import { LAST_VERIFIED_GLOBAL, PLACEMENTS } from "@/lib/platform-specs";

export const metadata: Metadata = {
  title: "CaptionSnap — Stop ad copy from getting truncated",
  description:
    "Free ad-copy simulator for performance marketers and small agencies. Paste your copy, see exactly where every platform clips it — Meta, TikTok, LinkedIn, X, YouTube, Pinterest, Reddit, Snapchat. No signup. Pro at $49/mo unlocks bulk paste of 10 headlines and PNG export.",
  alternates: { canonical: "/" },
};

function formatVerified(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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
        <h1 className="text-[length:var(--text-h1)] font-bold leading-[1.05] tracking-tight text-foreground sm:text-[length:var(--text-display)]">
          Stop guessing where your ad copy gets{" "}
          <span className="text-accent">clipped</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
          Paste your ad copy for Meta, TikTok, LinkedIn, X, YouTube, Pinterest,
          Reddit, or Snapchat and see exactly where each platform clips it,
          plus which UI overlays cover your hook. Free, no signup. Built for
          performance marketers and small agencies.
        </p>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Specs re-verified {formatVerified(LAST_VERIFIED_GLOBAL)} against live placements
          </span>
          <span aria-hidden="true" className="text-border-strong">·</span>
          <span>{PLACEMENTS.length} placements across 8 platforms</span>
          <span aria-hidden="true" className="text-border-strong">·</span>
          <span>No accounts, no copy stored</span>
        </p>
      </section>

      <SimulatorProvider
        initialState={initialState}
        decodeFailed={decodeFailed}
        hasInitialShareLink={hasInitialShareLink}
      >
        <Simulator />
      </SimulatorProvider>

      <section className="mt-16 grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/40 p-5">
          <Zap className="h-5 w-5 text-accent" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Authentic per-placement chrome</h2>
          <p className="text-sm text-muted">
            We render the actual UI that covers your creative — TikTok side
            rail, Meta CTA strip, LinkedIn promoted card. Not a generic phone.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/40 p-5">
          <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Re-verified specs, dated</h2>
          <p className="text-sm text-muted">
            Every limit and safe zone is verified against paid impressions on
            real devices, not the platform&apos;s lying preview tool. Last
            verified {formatVerified(LAST_VERIFIED_GLOBAL)}.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/40 p-5">
          <Share2 className="h-5 w-5 text-accent" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">URL is the database</h2>
          <p className="text-sm text-muted">
            Share-link state is encoded into the URL. Nothing about your copy
            is stored on our servers. Send the link to your account manager;
            it just works.
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-accent/40 bg-card/60 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground">
          Shipping 10+ creatives a week?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          <Link href="/pricing" className="text-accent hover:underline">Pro at $49/mo</Link>{" "}
          adds bulk paste — 10 headlines × every placement of a platform — plus
          PNG export for creative handoff and priority spec re-verification.
          Cancel anytime via the LemonSqueezy portal. No demo, no retention call.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="btn-base bg-accent text-black hover:opacity-90"
          >
            See Pro pricing →
          </Link>
          <Link
            href="/extension"
            className="btn-base border border-border text-muted hover:border-border-strong hover:text-foreground"
          >
            Get the Chrome extension
          </Link>
        </div>
      </section>

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
