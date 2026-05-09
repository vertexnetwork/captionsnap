"use client";

import { useCurrentPlacement, usePlatformPlacements, useSimulator } from "./SimulatorProvider";
import { cn } from "@/lib/cn";

export function PlacementPicker() {
  const placement = useCurrentPlacement();
  const placements = usePlatformPlacements();
  const { setPlacementId } = useSimulator();

  return (
    <>
      {/* Mobile: native select to avoid wrap-overflow on narrow viewports */}
      <label className="flex flex-col gap-1 text-xs text-muted sm:hidden">
        <span className="font-medium uppercase tracking-wide">Placement</span>
        <select
          value={placement.id}
          onChange={(e) => setPlacementId(e.target.value)}
          className="min-h-11 rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-border-strong focus:outline-none"
        >
          {placements.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      {/* Desktop: pill row */}
      <div className="hidden flex-wrap gap-2 sm:flex" role="radiogroup" aria-label="Placement">
        {placements.map((p) => {
          const active = p.id === placement.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlacementId(p.id)}
              role="radio"
              aria-checked={active}
              className={cn(
                "btn-pill border text-sm",
                active
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border text-muted hover:text-foreground hover:border-border-strong",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
