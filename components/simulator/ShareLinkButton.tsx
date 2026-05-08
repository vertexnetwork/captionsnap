"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { useSimulator } from "./SimulatorProvider";
import { encode } from "@/lib/share";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function ShareLinkButton({ className }: { className?: string }) {
  const { state } = useSimulator();
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const compressed = encode(state);
    const url = new URL(window.location.href);
    url.searchParams.set("s", compressed);
    history.replaceState(null, "", url.toString());
    try {
      await navigator.clipboard.writeText(url.toString());
      track("share_link_copied", {
        placementId: state.placementId,
        bytes: compressed.length,
      });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard may be unavailable; URL still updated
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] focus:outline-none",
        className,
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy share link"}
    </button>
  );
}
