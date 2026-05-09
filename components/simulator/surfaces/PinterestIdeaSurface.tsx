import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function PinterestIdeaSurface({ placement, truncated }: SurfaceProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed creative */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#9d174d_0%,#fb7185_50%,#f59e0b_100%)]" />

      {/* Top progress + actor */}
      <div className="absolute inset-x-0 top-0 px-3 pt-2 text-white">
        <div className="flex gap-1">
          <span className="h-0.5 flex-1 rounded-full bg-white" />
          <span className="h-0.5 flex-1 rounded-full bg-white/30" />
          <span className="h-0.5 flex-1 rounded-full bg-white/30" />
          <span className="h-0.5 flex-1 rounded-full bg-white/30" />
          <span className="h-0.5 flex-1 rounded-full bg-white/30" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-white/30" />
          <span className="text-[11px] font-semibold">brand</span>
          <span className="text-[10px] opacity-80">Promoted</span>
          <span className="ml-auto text-[14px] opacity-80">×</span>
        </div>
      </div>

      {/* Page text overlay */}
      {truncated.primary?.display ? (
        <div className="absolute left-1/2 top-[40%] w-[80%] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="rounded-md bg-black/40 px-3 py-2 text-[15px] font-bold leading-tight text-white whitespace-pre-line">
            {truncated.primary.display}
          </p>
        </div>
      ) : null}

      {/* Bottom title + CTA */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-3 py-3 text-white backdrop-blur">
        <div className="flex flex-col min-w-0">
          {truncated.headline?.display ? (
            <p className="truncate text-[12px] font-bold">{truncated.headline.display}</p>
          ) : null}
          <p className="text-[10px] opacity-80">brand.com</p>
        </div>
        <button
          type="button"
          className="ml-2 shrink-0 rounded-full bg-[#e60023] px-3 py-1.5 text-[11px] font-bold"
        >
          Visit
        </button>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
