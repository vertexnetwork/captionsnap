import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function RedditPromotedPostSurface({ placement, truncated }: SurfaceProps) {
  const isFreeForm = placement.id === "reddit-free-form";

  return (
    <div className="absolute inset-0 flex flex-col bg-zinc-100 text-zinc-900">
      {/* Top nav */}
      <div className="flex items-center gap-2 bg-white px-3 py-2 shrink-0">
        <span className="text-[14px] font-bold text-[#ff4500]">r/</span>
        <div className="flex-1 rounded-full bg-zinc-100 px-3 py-1 text-[11px] text-zinc-500">
          Search Reddit
        </div>
        <span className="text-[14px]">👤</span>
      </div>

      {/* Subreddit + Promoted */}
      <div className="flex items-center gap-2 bg-white px-3 py-2 border-b border-zinc-200 shrink-0">
        <div className="h-6 w-6 rounded-full bg-[#ff4500]" />
        <span className="text-[12px] font-semibold">r/marketing</span>
        <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-zinc-600">
          Promoted
        </span>
      </div>

      {/* Post title */}
      {truncated.headline?.display ? (
        <p className="bg-white px-3 pt-2 text-[14px] font-bold leading-snug shrink-0">
          {truncated.headline.display}
        </p>
      ) : null}

      {/* Post body / link card */}
      {truncated.primary?.display ? (
        <p className="bg-white px-3 pb-2 text-[12px] leading-snug whitespace-pre-line shrink-0">
          {truncated.primary.display}
        </p>
      ) : null}

      {/* Creative */}
      <div
        className="relative shrink-0 bg-gradient-to-br from-orange-500 via-rose-500 to-amber-400"
        style={{ aspectRatio: isFreeForm ? "16 / 9" : "1.91 / 1" }}
      >
        <div className="absolute left-2 bottom-2 rounded bg-black/50 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-white">
          brand.com
        </div>
      </div>

      {/* Vote / engagement bar */}
      <div className="flex items-center gap-3 bg-white px-3 py-2 text-[11px] text-zinc-500 shrink-0">
        <span>▲ 1.2K ▼</span>
        <span>💬 248</span>
        <span>↗ Share</span>
        <button
          type="button"
          className="ml-auto rounded-full bg-[#ff4500] px-3 py-1 text-[11px] font-bold text-white"
        >
          Visit
        </button>
      </div>

      {/* Bottom tab bar */}
      <div className="mt-auto flex items-center justify-around border-t border-zinc-200 bg-white py-2 text-[10px] text-zinc-500 shrink-0">
        <span>🏠 Home</span>
        <span>📡 Popular</span>
        <span>＋</span>
        <span>💬 Chat</span>
        <span>🔔 Inbox</span>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
