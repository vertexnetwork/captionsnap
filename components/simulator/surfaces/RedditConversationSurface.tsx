import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function RedditConversationSurface({ placement, truncated }: SurfaceProps) {
  return (
    <div className="absolute inset-0 flex flex-col bg-zinc-100 text-zinc-900">
      {/* Top nav */}
      <div className="flex items-center gap-2 bg-white px-3 py-2 shrink-0">
        <span className="text-[14px] font-bold text-[#ff4500]">r/</span>
        <div className="flex-1 rounded-full bg-zinc-100 px-3 py-1 text-[11px] text-zinc-500">
          Search Reddit
        </div>
      </div>

      {/* Subreddit */}
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

      {/* Brand "first comment" */}
      <div className="flex flex-col gap-1 bg-white px-3 py-2 shrink-0">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <div className="h-5 w-5 rounded-full bg-[#ff4500]" />
          <span className="font-semibold text-zinc-700">u/brand</span>
          <span>· 2h · OP · Sponsored</span>
        </div>
        {truncated.primary?.display ? (
          <p className="pl-7 text-[12px] leading-snug whitespace-pre-line">
            {truncated.primary.display}
          </p>
        ) : null}
        <div className="flex items-center gap-3 pl-7 text-[11px] text-zinc-500">
          <span>▲ 248 ▼</span>
          <span>💬 Reply</span>
          <button
            type="button"
            className="ml-auto rounded-full bg-[#ff4500] px-3 py-1 text-[11px] font-bold text-white"
          >
            Visit
          </button>
        </div>
      </div>

      {/* Decoy comments */}
      <div className="flex flex-col gap-2 bg-white px-3 py-2 shrink-0 border-t border-zinc-200">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <div className="h-5 w-5 rounded-full bg-zinc-300" />
          <span className="font-semibold text-zinc-700">u/curious_marketer</span>
          <span>· 1h</span>
        </div>
        <div className="h-2 w-2/3 rounded-full bg-zinc-200" />
        <div className="h-2 w-1/2 rounded-full bg-zinc-100" />
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
