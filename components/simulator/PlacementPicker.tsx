"use client";

import { useCurrentPlacement, usePlatformPlacements, useSimulator } from "./SimulatorProvider";
import { cn } from "@/lib/cn";

export function PlacementPicker() {
  const placement = useCurrentPlacement();
  const placements = usePlatformPlacements();
  const { setPlacementId } = useSimulator();

  return (
    <div className="flex flex-wrap gap-2">
      {placements.map((p) => {
        const active = p.id === placement.id;
        return (
          <button
            key={p.id}
            onClick={() => setPlacementId(p.id)}
            aria-pressed={active}
            className={cn(
              "px-3 py-1 text-sm rounded-full border transition-colors",
              active
                ? "border-accent text-accent bg-accent/10"
                : "border-border text-muted hover:text-foreground hover:border-foreground/40",
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
