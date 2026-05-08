"use client";

import { useState } from "react";
import { Link2, Check, AlertTriangle } from "lucide-react";
import { useSimulator } from "./SimulatorProvider";
import { encode } from "@/lib/share";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Status = "idle" | "copied" | "fallback";

export function ShareLinkButton({ className }: { className?: string }) {
  const { state, markShareLinkFresh } = useSimulator();
  const [status, setStatus] = useState<Status>("idle");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  async function handleClick() {
    const compressed = encode(state);
    const url = new URL(window.location.href);
    url.searchParams.set("s", compressed);
    const final = url.toString();
    history.replaceState(null, "", final);
    setShareUrl(final);
    markShareLinkFresh();
    track("share_link_copied", {
      placementId: state.placementId,
      bytes: compressed.length,
    });
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no-clipboard");
      await navigator.clipboard.writeText(final);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("fallback");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          className,
        )}
        aria-live="polite"
      >
        {status === "copied" ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : status === "fallback" ? (
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden="true" />
        )}
        {status === "copied"
          ? "Copied!"
          : status === "fallback"
            ? "Copy from below"
            : "Copy share link"}
      </button>
      {status === "fallback" && shareUrl ? (
        <label className="flex flex-col gap-1 text-xs text-muted">
          <span>Clipboard blocked — select and copy manually:</span>
          <input
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-md border border-border bg-card px-2 py-1 text-foreground"
          />
        </label>
      ) : null}
    </div>
  );
}
