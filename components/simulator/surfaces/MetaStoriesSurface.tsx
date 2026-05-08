import type { SurfaceProps } from "./types";

export function MetaStoriesSurface({ placement, truncated }: SurfaceProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed creative */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_40%,#f59e0b_100%)]" />

      {/* Top progress bar + profile chip */}
      <div className="absolute inset-x-0 top-0 px-3 pt-2 text-white">
        <div className="flex gap-1">
          <span className="h-0.5 flex-1 rounded-full bg-white" />
          <span className="h-0.5 flex-1 rounded-full bg-white/30" />
          <span className="h-0.5 flex-1 rounded-full bg-white/30" />
          <span className="h-0.5 flex-1 rounded-full bg-white/30" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-white/30" />
          <span className="text-[11px] font-semibold">@brand</span>
          <span className="text-[10px] opacity-80">Sponsored</span>
          <span className="ml-auto text-[14px] opacity-80">×</span>
        </div>
      </div>

      {/* Composed primary text — Stories typically has text composed INTO the creative */}
      {truncated.primary?.display ? (
        <div className="absolute left-1/2 top-1/2 w-[80%] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="rounded-md bg-black/40 px-3 py-2 text-[15px] font-bold leading-tight text-white whitespace-pre-line">
            {truncated.primary.display}
          </p>
        </div>
      ) : null}

      {/* Headline as small caption above CTA */}
      {truncated.headline?.display ? (
        <p className="absolute inset-x-0 bottom-[18%] px-4 text-center text-[12px] font-medium text-white">
          {truncated.headline.display}
        </p>
      ) : null}

      {/* Bottom CTA sticker */}
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <button
          type="button"
          className="rounded-full bg-white/95 px-6 py-2 text-[12px] font-bold text-black shadow-lg"
        >
          Learn more →
        </button>
      </div>

      {/* Safe-zone overlays — top and bottom 14% */}
      {placement.safeZones.map((z) => (
        <div
          key={z.id}
          className="pointer-events-none absolute"
          style={{
            left: `${z.x}%`,
            top: `${z.y}%`,
            width: `${z.w}%`,
            height: `${z.h}%`,
            background: "rgba(255,61,110,0.18)",
            outline: "1px dashed rgba(255,61,110,0.7)",
          }}
          title={z.reason}
          aria-label={`Safe zone: ${z.reason}`}
        />
      ))}
    </div>
  );
}
