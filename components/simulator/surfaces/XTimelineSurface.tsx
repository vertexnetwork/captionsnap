import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function XTimelineSurface({ placement, truncated }: SurfaceProps) {
  const isPreroll = placement.id === "x-amplify-preroll";

  return (
    <div className="absolute inset-0 flex flex-col bg-black text-white">
      {/* Top tabs */}
      <div className="flex items-center justify-around border-b border-zinc-800 py-3 shrink-0">
        <span className="text-[12px] text-zinc-500">For You</span>
        <span className="text-[13px] font-bold">Following</span>
      </div>

      {/* Actor row */}
      <div className="flex items-start gap-2 px-3 py-3 shrink-0">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 ring-1 ring-zinc-700" />
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[11px]">
            <span className="font-bold text-[12px] text-white">Brand</span>
            <span className="text-zinc-500">@brand · Ad</span>
          </div>
          {truncated.primary?.display ? (
            <p className="mt-0.5 text-[13px] leading-snug whitespace-pre-line">
              {truncated.primary.display}
            </p>
          ) : null}
        </div>
        <span className="text-zinc-500">⋯</span>
      </div>

      {/* Card / video */}
      <div
        className="relative mx-3 shrink-0 overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-sky-900 via-zinc-900 to-zinc-950"
        style={{ aspectRatio: isPreroll ? "16 / 9" : "1.91 / 1" }}
      >
        {isPreroll ? (
          <>
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white">
              ▶
            </div>
            <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-[9px] uppercase">
              Pre-roll · 0:06
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-end p-3">
            <div className="flex w-full items-center justify-between rounded-lg bg-black/60 px-3 py-2 backdrop-blur">
              <span className="truncate text-[11px] font-semibold">
                {truncated.headline?.display || "brand.com"}
              </span>
              <button
                type="button"
                className="ml-2 shrink-0 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-black"
              >
                Learn more
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Engagement bar */}
      <div className="mt-auto flex items-center justify-around border-t border-zinc-800 px-3 py-2 text-[11px] text-zinc-500 shrink-0">
        <span>💬 12</span>
        <span>↻ 34</span>
        <span>♡ 256</span>
        <span>📊 12K</span>
        <span>↗</span>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
