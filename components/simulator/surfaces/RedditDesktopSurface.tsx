import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

// reddit.com web — top bar, communities rail, center post column, community
// sidebar. Matches the desktop safe zones in lib/platform-specs.ts.

export function RedditDesktopSurface({ placement, truncated }: SurfaceProps) {
  const zones = placement.desktop?.safeZones ?? [];
  const isConversation = placement.id === "reddit-conversation";
  const title = truncated.headline?.display || "Your promoted post title";
  const body =
    truncated.primary?.display ||
    "Your body text renders here, clipped exactly where Reddit collapses it.";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#dae0e6] text-[#1c1c1c]">
      {/* Top nav */}
      <div className="absolute inset-x-0 top-0 flex h-[8%] items-center gap-3 bg-white px-4 shadow-sm">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ff4500] text-[14px] font-black text-white">
          r
        </span>
        <div className="h-8 w-72 rounded-full bg-[#f6f7f8] px-3 text-[12px] leading-8 text-zinc-500">
          Search Reddit
        </div>
        <div className="ml-auto h-7 w-7 rounded-full bg-zinc-300" />
      </div>

      {/* Left communities rail */}
      <div className="absolute bottom-0 left-0 top-[8%] w-[18%] space-y-2 bg-white p-3">
        {["Home", "Popular", "r/marketing", "r/PPC", "r/Entrepreneur"].map((l) => (
          <div key={l} className="flex items-center gap-2 text-[12px] text-zinc-600">
            <span className="h-4 w-4 rounded-full bg-zinc-300" />
            {l}
          </div>
        ))}
      </div>

      {/* Right community sidebar */}
      <div className="absolute right-[2%] top-[10%] w-[24%] rounded bg-white p-3">
        <div className="h-10 rounded bg-[#ff4500]/80" />
        <p className="mt-2 text-[13px] font-semibold">About Community</p>
        {[0, 1].map((i) => (
          <div key={i} className="mt-2 h-2.5 w-5/6 rounded bg-zinc-200" />
        ))}
        <button className="mt-3 w-full rounded-full bg-[#ff4500] py-1.5 text-[12px] font-bold text-white">
          Join
        </button>
      </div>

      {/* Center post */}
      <div className="absolute left-[19%] top-[10%] w-[52%] rounded bg-white">
        <div className="flex items-center gap-2 border-b border-zinc-100 p-3 text-[12px]">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-500 to-rose-500" />
          <span className="font-semibold">r/marketing</span>
          <span className="text-zinc-500">· Promoted</span>
        </div>
        <div className="p-4">
          <p className="text-[18px] font-semibold leading-tight">{title}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-700">{body}</p>

          {isConversation ? (
            <div className="mt-3 rounded-md border-l-4 border-[#ff4500] bg-[#fff7f3] p-3 text-[12px]">
              <p className="font-semibold">Brand · pinned first comment</p>
              <p className="mt-1 text-zinc-600">
                Sponsored conversation strip pinned above the real thread.
              </p>
            </div>
          ) : (
            <div className="mt-3 aspect-[1.91/1] w-full rounded-md bg-[linear-gradient(135deg,#ff4500_0%,#1c1c1c_100%)]" />
          )}

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[12px] text-zinc-500">your-site.com</p>
            <button className="rounded-full bg-[#ff4500] px-4 py-1.5 text-[12px] font-bold text-white">
              Learn more
            </button>
          </div>

          <div className="mt-3 flex gap-5 border-t border-zinc-100 pt-3 text-[12px] text-zinc-500">
            <span>⬆ 1.2k ⬇</span>
            <span>💬 84 Comments</span>
            <span>↗ Share</span>
            <span>⤓ Save</span>
          </div>
        </div>
      </div>

      <SafeZoneOverlays zones={zones} />
    </div>
  );
}
