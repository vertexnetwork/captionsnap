"use client";

import { Monitor, Smartphone } from "lucide-react";
import { hasDesktop } from "@/lib/platform-specs";
import { useCurrentPlacement, useDeviceMode } from "./SimulatorProvider";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const OPTIONS = [
  { id: "mobile" as const, label: "Mobile", Icon: Smartphone },
  { id: "desktop" as const, label: "Desktop", Icon: Monitor },
];

/** Mobile / Desktop view switch. Desktop stays selectable for mobile-only
 *  placements — the canvas then shows an explicit "mobile-only" state rather
 *  than a fabricated desktop frame. */
export function DeviceToggle() {
  const placement = useCurrentPlacement();
  const [device, setDevice] = useDeviceMode();
  const desktopReal = hasDesktop(placement);

  return (
    <div
      role="group"
      aria-label="Device view"
      className="inline-flex gap-1 rounded-full border border-border bg-card p-1"
    >
      {OPTIONS.map((o) => {
        const active = device === o.id;
        const mobileOnly = o.id === "desktop" && !desktopReal;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            title={
              mobileOnly
                ? "This placement has no desktop ad rendering — mobile-only"
                : `${o.label} view`
            }
            onClick={() => {
              if (device !== o.id) track("device_switched", { placementId: placement.id, to: o.id });
              setDevice(o.id);
            }}
            className={cn(
              "btn-pill gap-1.5 text-sm font-medium",
              active ? "bg-accent text-black" : "text-muted hover:text-foreground",
            )}
          >
            <o.Icon className="h-4 w-4" aria-hidden />
            {o.label}
            {mobileOnly ? (
              <span
                aria-hidden
                className={cn(
                  "ml-0.5 h-1.5 w-1.5 rounded-full",
                  active ? "bg-black/50" : "bg-warning",
                )}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
