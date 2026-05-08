"use client";

import { getPlacementsByPlatform, type Platform } from "@/lib/platform-specs";
import { useCurrentPlacement, useSimulator } from "./SimulatorProvider";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "meta", label: "Meta" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X" },
  { id: "youtube", label: "YouTube" },
  { id: "pinterest", label: "Pinterest" },
  { id: "snapchat", label: "Snapchat" },
  { id: "reddit", label: "Reddit" },
];

export function PlatformPicker() {
  const placement = useCurrentPlacement();
  const { setPlacementId } = useSimulator();

  return (
    <div
      role="group"
      aria-label="Platform"
      className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-card p-1"
    >
      {PLATFORMS.map((p) => {
        const placements = getPlacementsByPlatform(p.id);
        if (placements.length === 0) return null;
        const active = placement.platform === p.id;
        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={active}
            onClick={() => {
              const first = placements[0];
              if (!first) return;
              if (placement.platform !== p.id) {
                track("platform_switched", { from: placement.platform, to: p.id });
              }
              setPlacementId(first.id);
            }}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active
                ? "bg-accent text-black"
                : "text-muted hover:text-foreground",
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
