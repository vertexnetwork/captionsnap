import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function LinkedInFeedSurface({ placement, truncated }: SurfaceProps) {
  const isCarousel = placement.id === "linkedin-carousel";
  const isVideo = placement.id === "linkedin-video";
  const isDocument = placement.id === "linkedin-document";

  return (
    <div className="absolute inset-0 flex flex-col bg-white text-zinc-900">
      {/* LinkedIn top nav */}
      <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2 shrink-0">
        <span className="font-bold text-[14px] text-[#0a66c2]">in</span>
        <div className="flex-1 rounded-md bg-zinc-100 px-2 py-1 text-[11px] text-zinc-500">
          Search
        </div>
        <span className="text-[14px]">💬</span>
      </div>

      {/* Actor row */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500" />
        <div className="flex flex-col text-[10px] leading-tight">
          <span className="font-semibold text-[12px]">Brand · Page</span>
          <span className="text-zinc-500">10,452 followers</span>
          <span className="text-zinc-500">Promoted · 🌐</span>
        </div>
        <span className="ml-auto text-zinc-500">⋯</span>
      </div>

      {/* Intro / primary text */}
      {truncated.primary?.display ? (
        <p className="px-3 pb-2 text-[12px] leading-snug text-zinc-800 whitespace-pre-line shrink-0">
          {truncated.primary.display}
        </p>
      ) : null}

      {/* Creative */}
      <div
        className="relative shrink-0 bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-500"
        style={{ aspectRatio: "1.91 / 1" }}
      >
        {isCarousel ? (
          <>
            <div className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-700">
              ›
            </div>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              <span className="h-1 w-3 rounded-full bg-white" />
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="h-1 w-1 rounded-full bg-white/40" />
            </div>
          </>
        ) : null}
        {isVideo ? (
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white">
            ▶
          </div>
        ) : null}
        {isDocument ? (
          <div className="absolute inset-3 flex flex-col gap-1 rounded bg-white/95 p-2 text-[8px] text-zinc-700">
            <div className="h-1.5 w-3/4 rounded-full bg-zinc-300" />
            <div className="h-1.5 w-2/3 rounded-full bg-zinc-200" />
            <div className="h-1.5 w-4/5 rounded-full bg-zinc-200" />
            <div className="mt-auto text-right text-[7px] text-zinc-500">Page 1 of 12</div>
          </div>
        ) : null}
      </div>

      {/* Bottom card: headline + CTA */}
      <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-3 py-2 shrink-0">
        <div className="flex flex-col min-w-0">
          {truncated.headline?.display ? (
            <p className="truncate text-[12px] font-semibold">{truncated.headline.display}</p>
          ) : null}
          {truncated.description?.display ? (
            <p className="truncate text-[10px] uppercase tracking-wide text-zinc-500">
              {truncated.description.display}
            </p>
          ) : (
            <p className="text-[10px] text-zinc-500">brand.com</p>
          )}
        </div>
        <button
          type="button"
          className="ml-2 shrink-0 rounded-full border border-[#0a66c2] px-3 py-1 text-[11px] font-semibold text-[#0a66c2]"
        >
          {isDocument ? "Download" : "Learn more"}
        </button>
      </div>

      {/* Reaction bar */}
      <div className="mt-auto flex items-center justify-around border-t border-zinc-200 py-2 text-[11px] text-zinc-500 shrink-0">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>↻ Repost</span>
        <span>📨 Send</span>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
