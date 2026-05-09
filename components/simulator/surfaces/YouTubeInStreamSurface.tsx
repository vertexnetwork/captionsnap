import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function YouTubeInStreamSurface({ placement, truncated }: SurfaceProps) {
  const isBumper = placement.id === "youtube-bumper";

  return (
    <div className="absolute inset-0 flex flex-col bg-black text-white">
      {/* YouTube top nav */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0">
        <span className="text-[12px] font-bold">
          <span className="text-red-600">▶</span> YouTube
        </span>
        <span className="text-[12px]">🔍</span>
      </div>

      {/* Video stage (16:9) */}
      <div
        className="relative shrink-0 bg-[linear-gradient(135deg,#7f1d1d_0%,#0f0f0f_60%,#000_100%)]"
        style={{ aspectRatio: "16 / 9" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            ▶
          </div>
        </div>
        {/* Skip / countdown */}
        {!isBumper ? (
          <div className="absolute right-2 bottom-2 flex gap-2">
            <div className="rounded bg-black/70 px-2 py-1 text-[10px]">Ad · 0:08</div>
            <button
              type="button"
              className="rounded border border-white/40 bg-black/60 px-3 py-1 text-[11px] font-semibold"
            >
              Skip ad ›
            </button>
          </div>
        ) : (
          <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-[10px]">
            Ad · 0:06 · Bumper
          </div>
        )}
      </div>

      {/* Companion banner: headline + description + CTA */}
      <div className="flex items-center gap-3 border-t border-zinc-800 px-3 py-2 shrink-0">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-red-500 to-amber-500" />
        <div className="flex min-w-0 flex-1 flex-col">
          {truncated.headline?.display ? (
            <p className="truncate text-[12px] font-semibold">{truncated.headline.display}</p>
          ) : (
            <p className="text-[12px] font-semibold">Brand</p>
          )}
          {truncated.description?.display ? (
            <p className="truncate text-[10px] text-zinc-400">{truncated.description.display}</p>
          ) : (
            <p className="text-[10px] text-zinc-400">brand.com</p>
          )}
        </div>
        <button
          type="button"
          className="shrink-0 rounded bg-blue-500 px-3 py-1.5 text-[11px] font-bold text-white"
        >
          Visit
        </button>
      </div>

      {/* Decoy organic content below */}
      <div className="flex flex-col gap-2 border-t border-zinc-800 px-3 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-zinc-700" />
          <p className="text-[11px] text-zinc-400">Up next: organic video</p>
        </div>
        <div className="h-2 w-2/3 rounded-full bg-zinc-800" />
        <div className="h-2 w-1/2 rounded-full bg-zinc-900" />
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
