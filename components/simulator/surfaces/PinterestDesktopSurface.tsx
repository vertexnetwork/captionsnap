import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

// Pinterest desktop "closeup" — the copy-critical, desktop-dominant surface:
// large creative on the left, info panel (actions, title, description,
// Pinner, Visit-site) on the right. Matches the desktop safe zones in
// lib/platform-specs.ts.

export function PinterestDesktopSurface({ placement, truncated }: SurfaceProps) {
  const zones = placement.desktop?.safeZones ?? [];
  const isVideo = placement.id === "pinterest-video-pin";
  const isCarousel = placement.id === "pinterest-carousel";

  const title = truncated.headline?.display || "Your Pin title";
  const description =
    truncated.primary?.display ||
    "Your description renders on the closeup only — never in the feed.";

  return (
    <div className="absolute inset-0 overflow-hidden bg-white text-zinc-900">
      {/* Top nav */}
      <div className="absolute inset-x-0 top-0 flex h-[9%] items-center gap-3 px-4">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e60023] text-[15px] font-black text-white">
          P
        </span>
        <div className="h-9 flex-1 rounded-full bg-zinc-100 px-4 text-[12px] leading-9 text-zinc-500">
          🔍 Search for ideas
        </div>
        <div className="h-8 w-8 rounded-full bg-zinc-200" />
      </div>

      {/* Closeup card */}
      <div className="absolute inset-x-[3%] bottom-[4%] top-[11%] flex overflow-hidden rounded-3xl border border-zinc-200 shadow-xl">
        {/* Left: creative */}
        <div className="relative w-1/2 bg-gradient-to-br from-zinc-400 via-zinc-500 to-zinc-700">
          {isVideo ? (
            <>
              <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/30 text-white">
                ▶
              </div>
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 text-white">
                <span>🔊</span>
                <div className="h-1 flex-1 rounded-full bg-white/40">
                  <div className="h-full w-1/3 rounded-full bg-white" />
                </div>
              </div>
            </>
          ) : null}
          {isCarousel ? (
            <div className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg shadow">
              ›
            </div>
          ) : null}
          <div className="absolute left-3 top-3 rounded bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
            Promoted
          </div>
        </div>

        {/* Right: info panel */}
        <div className="flex w-1/2 flex-col p-6">
          <div className="flex items-center gap-3 text-zinc-600">
            <span className="text-xl">⋯</span>
            <span className="text-xl">↗</span>
            <button
              type="button"
              className="ml-auto rounded-full bg-[#e60023] px-4 py-2 text-[13px] font-bold text-white"
            >
              Save
            </button>
          </div>

          <h2 className="mt-5 line-clamp-2 text-[22px] font-bold leading-tight">
            {title}
          </h2>
          <p className="mt-3 line-clamp-4 text-[13px] leading-relaxed text-zinc-600">
            {description}
          </p>

          <div className="mt-auto flex items-center gap-3 border-t border-zinc-100 pt-4">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-rose-500" />
            <div className="text-[12px] leading-tight">
              <p className="font-semibold">Brand</p>
              <p className="text-zinc-500">Promoted by Brand</p>
            </div>
            <button
              type="button"
              className="ml-auto rounded-full border border-zinc-300 px-4 py-2 text-[13px] font-semibold"
            >
              Visit site
            </button>
          </div>
        </div>
      </div>

      <SafeZoneOverlays zones={zones} />
    </div>
  );
}
