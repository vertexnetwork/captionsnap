import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function PinterestPinSurface({ placement, truncated }: SurfaceProps) {
  const isVideo = placement.id === "pinterest-video-pin";
  const isCarousel = placement.id === "pinterest-carousel";

  return (
    <div className="absolute inset-0 flex flex-col bg-white text-zinc-900">
      {/* Pinterest top search */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0">
        <span className="text-[16px] font-bold text-[#e60023]">P</span>
        <div className="flex-1 rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] text-zinc-500">
          🔍 Search
        </div>
      </div>

      {/* Pin image (2:3) */}
      <div
        className="relative shrink-0 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400"
        style={{ aspectRatio: "2 / 3" }}
      >
        <button
          type="button"
          className="absolute right-2 top-2 rounded-full bg-[#e60023] px-3 py-1 text-[11px] font-bold text-white shadow"
        >
          Save
        </button>
        {isVideo ? (
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white">
            ▶
          </div>
        ) : null}
        {isCarousel ? (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            <span className="h-1.5 w-3 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          </div>
        ) : null}
        <div className="absolute left-2 bottom-2 rounded bg-black/50 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-white">
          Promoted
        </div>
      </div>

      {/* Actor row */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-500 to-rose-500" />
        <div className="flex flex-col text-[10px] leading-tight">
          <span className="font-semibold text-[12px]">brand</span>
          <span className="text-zinc-500">Promoted by Brand</span>
        </div>
      </div>

      {/* Title + description + CTA */}
      <div className="flex items-center justify-between border-t border-zinc-200 px-3 py-2 shrink-0">
        <div className="flex flex-col min-w-0">
          {truncated.headline?.display ? (
            <p className="truncate text-[12px] font-semibold">{truncated.headline.display}</p>
          ) : null}
          {truncated.primary?.display ? (
            <p className="truncate text-[10px] text-zinc-500">{truncated.primary.display}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="ml-2 shrink-0 rounded-full bg-[#e60023] px-3 py-1.5 text-[11px] font-bold text-white"
        >
          Visit
        </button>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
