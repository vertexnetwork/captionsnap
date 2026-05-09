"use client";

import { useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import { useIsPro } from "@/components/pro/ProProvider";
import { track } from "@/lib/analytics";
import { useCurrentPlacement } from "./SimulatorProvider";

const CANVAS_SELECTOR = '[data-testid="safe-zone-canvas"]';

export function ExportPngButton() {
  const isPro = useIsPro();
  const placement = useCurrentPlacement();
  const [pending, setPending] = useState(false);

  if (!isPro) {
    return (
      <Link
        href="/pricing"
        onClick={() => track("pro_feature_blocked", { feature: "png_export" })}
        className="btn-base border border-border bg-card text-sm text-muted hover:border-accent hover:text-accent"
        title="Export simulator output as PNG — Pro feature"
      >
        <span>Export PNG</span>
        <span className="rounded-sm bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
          Pro
        </span>
      </Link>
    );
  }

  async function handleExport() {
    if (pending) return;
    setPending(true);
    try {
      const node = document.querySelector(CANVAS_SELECTOR) as HTMLElement | null;
      if (!node) return;
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#07070a",
      });
      const link = document.createElement("a");
      link.download = `captionsnap-${placement.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      track("pro_feature_used", { feature: "png_export" });
    } catch (err) {
      console.error("PNG export failed", err);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={pending}
      className="btn-base border border-accent/60 text-sm font-semibold text-accent hover:bg-accent/10 disabled:opacity-50"
    >
      {pending ? "Exporting…" : "Export PNG"}
    </button>
  );
}
