"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Platform } from "@/lib/platform-specs";
import { BulkGrid } from "@/components/bulk/BulkGrid";
import { useProContext } from "@/components/pro/ProProvider";
import { track } from "@/lib/analytics";

const DEFAULT_LINES = [
  "Your most important hook should land before character 40",
  "B2B audiences scroll fast — earn the click in 150 chars",
  "Tap to learn more (this won't fit on Reels)",
];

export function BulkPageContent() {
  const { status, isPro } = useProContext();
  const [platform, setPlatform] = useState<Platform>("meta");
  const [lines, setLines] = useState<string[]>(DEFAULT_LINES);

  useEffect(() => {
    if (status === "active") {
      track("pro_feature_used", { feature: "bulk_paste" });
    } else if (status === "inactive") {
      track("pro_feature_blocked", { feature: "bulk_paste" });
    }
  }, [status]);

  if (status === "loading") {
    return <p className="text-sm text-muted">Checking subscription…</p>;
  }
  if (!isPro) {
    return <UpsellCard />;
  }
  return (
    <BulkGrid
      platform={platform}
      setPlatform={setPlatform}
      lines={lines}
      setLines={setLines}
    />
  );
}

function UpsellCard() {
  return (
    <div className="rounded-lg border border-accent/40 bg-card/60 p-8">
      <h2 className="text-xl font-semibold">
        Bulk paste is a <span className="text-accent">Pro</span> feature.
      </h2>
      <p className="mt-3 text-sm text-muted">
        Validate an entire campaign&apos;s creative in one paste — 10 headlines
        across every placement of a platform, in a single grid. No more clicking
        through one placement at a time, and no more clipped copy slipping into
        production.
      </p>
      <ul className="mt-5 space-y-1.5 text-sm text-foreground">
        <li>· 10 headlines × every placement grid</li>
        <li>· Live truncation indicator per cell</li>
        <li>· Color-coded counters (green · yellow · red)</li>
        <li>· Plus PNG export, ad-free browsing, and priority spec re-verification</li>
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          Upgrade to Pro — $49/mo →
        </Link>
        <Link
          href="/"
          className="rounded-md border border-border/60 px-4 py-2 text-sm hover:border-accent"
        >
          Use the free single-placement simulator
        </Link>
      </div>
    </div>
  );
}
