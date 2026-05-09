import type { SafeZone } from "@/lib/platform-specs";

export function SafeZoneOverlays({ zones }: { zones: SafeZone[] }) {
  return (
    <>
      {zones.map((z) => (
        <div
          key={z.id}
          className="pointer-events-none absolute z-10"
          style={{
            left: `${z.x}%`,
            top: `${z.y}%`,
            width: `${z.w}%`,
            height: `${z.h}%`,
            background: "var(--danger-overlay)",
            outline: "1px dashed var(--danger-overlay-stroke)",
          }}
          title={z.reason}
          aria-label={`Safe zone: ${z.reason}`}
          data-testid={`safe-zone-${z.id}`}
        />
      ))}
    </>
  );
}
