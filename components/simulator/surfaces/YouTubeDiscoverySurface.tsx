import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function YouTubeDiscoverySurface({ placement, truncated }: SurfaceProps) {
  const isMasthead = placement.id === "youtube-masthead";

  return (
    <div className="absolute inset-0 flex flex-col bg-black text-white">
      {/* YouTube top nav */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0">
        <span className="text-[12px] font-bold">
          <span className="text-red-600">▶</span> YouTube
        </span>
        <span className="text-[12px]">🔍</span>
      </div>

      {/* Hero video / thumbnail */}
      <div
        className="relative shrink-0 bg-[linear-gradient(135deg,#0f172a_0%,#7c2d12_100%)]"
        style={{ aspectRatio: isMasthead ? "16 / 9" : "16 / 9" }}
      >
        <div className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px]">
          0:30 · Ad
        </div>
        {isMasthead ? (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-3 py-2 backdrop-blur">
            <div className="min-w-0">
              {truncated.headline?.display ? (
                <p className="truncate text-[12px] font-bold">{truncated.headline.display}</p>
              ) : null}
              {truncated.primary?.display ? (
                <p className="truncate text-[10px] text-zinc-300 whitespace-pre-line">
                  {truncated.primary.display}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="ml-2 shrink-0 rounded bg-white px-3 py-1.5 text-[11px] font-bold text-black"
            >
              Watch
            </button>
          </div>
        ) : null}
      </div>

      {/* Discovery metadata */}
      {!isMasthead ? (
        <div className="flex gap-2 px-3 py-2 shrink-0">
          <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-red-500 to-amber-500" />
          <div className="flex flex-col min-w-0">
            {truncated.headline?.display ? (
              <p className="truncate text-[13px] font-semibold">{truncated.headline.display}</p>
            ) : null}
            {truncated.primary?.display ? (
              <p className="truncate text-[11px] text-zinc-400">{truncated.primary.display}</p>
            ) : null}
            {truncated.description?.display ? (
              <p className="truncate text-[11px] text-zinc-400">{truncated.description.display}</p>
            ) : null}
            <p className="text-[10px] text-zinc-500">brand · Sponsored</p>
          </div>
        </div>
      ) : null}

      {/* Decoy results */}
      <div className="flex flex-col gap-2 border-t border-zinc-800 px-3 py-3 shrink-0">
        <p className="text-[10px] uppercase tracking-wide text-zinc-500">Up next</p>
        <div className="flex gap-2">
          <div className="h-12 w-20 rounded bg-zinc-800" />
          <div className="flex flex-1 flex-col justify-center gap-1">
            <div className="h-2 w-3/4 rounded-full bg-zinc-700" />
            <div className="h-2 w-1/2 rounded-full bg-zinc-800" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-12 w-20 rounded bg-zinc-800" />
          <div className="flex flex-1 flex-col justify-center gap-1">
            <div className="h-2 w-2/3 rounded-full bg-zinc-700" />
            <div className="h-2 w-2/5 rounded-full bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="mt-auto flex items-center justify-around border-t border-zinc-800 py-2 text-[10px] text-zinc-500 shrink-0">
        <span>🏠 Home</span>
        <span>📡 Shorts</span>
        <span>＋</span>
        <span>📺 Subs</span>
        <span>👤 You</span>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
