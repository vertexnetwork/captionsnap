"use client";

import { getPlacementsByPlatform, type Platform } from "@/lib/platform-specs";
import { useCurrentPlacement, useSimulator } from "./SimulatorProvider";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "meta", label: "Meta" },
  { id: "tiktok", label: "TikTok" },
];

export function PlatformPicker() {
  const placement = useCurrentPlacement();
  const { setPlacementId } = useSimulator();

  return (
    <div
      role="tablist"
      aria-label="Platform"
      className="inline-flex rounded-full border border-border bg-card p-1"
    >
      {PLATFORMS.map((p) => {
        const active = placement.platform === p.id;
        return (
          <button
            key={p.id}
            role="tab"
            aria-selected={active}
            onClick={() => {
              const first = getPlacementsByPlatform(p.id)[0];
              if (!first) return;
              if (placement.platform !== p.id) {
                track("platform_switched", { from: placement.platform, to: p.id });
              }
              setPlacementId(first.id);
            }}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-full transition-colors",
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
