import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

// LinkedIn web (B2B → desktop-dominant). Feed = 3-column; Message/Conversation
// = full messaging page (list + thread). Matches the desktop safe zones in
// lib/platform-specs.ts.

export function LinkedInDesktopSurface({ placement, truncated }: SurfaceProps) {
  const zones = placement.desktop?.safeZones ?? [];
  const isMessaging = placement.surface === "message";
  const isCarousel = placement.id === "linkedin-carousel";
  const isDoc = placement.id === "linkedin-document";

  const intro =
    truncated.primary?.display ||
    "Your introductory text renders here, clipped exactly where LinkedIn adds “…see more”.";
  const headline = truncated.headline?.display || "Headline / subject";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f4f2ee] text-[#1b1f23]">
      {/* Top nav */}
      <div className="absolute inset-x-0 top-0 flex h-[8%] items-center gap-3 bg-white px-5 shadow-sm">
        <span className="grid h-7 w-7 place-items-center rounded bg-[#0a66c2] text-[14px] font-black text-white">
          in
        </span>
        <div className="h-8 w-64 rounded bg-[#eef3f8] px-3 text-[12px] leading-8 text-zinc-500">
          Search
        </div>
        <div className="ml-auto flex gap-4 text-[11px] text-zinc-500">
          <span>Home</span><span>My Network</span><span>Jobs</span><span>Messaging</span>
        </div>
      </div>

      {isMessaging ? (
        <>
          {/* Conversation list */}
          <div className="absolute bottom-0 left-0 top-[8%] w-[32%] border-r border-zinc-200 bg-white">
            <p className="border-b border-zinc-200 p-3 text-[14px] font-semibold">Messaging</p>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 border-b border-zinc-100 p-3">
                <div className="h-9 w-9 rounded-full bg-zinc-300" />
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 w-1/2 rounded bg-zinc-300" />
                  <div className="h-2 w-3/4 rounded bg-zinc-200" />
                </div>
              </div>
            ))}
          </div>
          {/* Thread */}
          <div className="absolute bottom-0 right-0 top-[8%] w-[68%] bg-white">
            <div className="flex items-center gap-3 border-b border-zinc-200 p-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600" />
              <div>
                <p className="text-[14px] font-semibold">Brand Representative</p>
                <p className="text-[11px] text-zinc-500">Sponsored</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-[12px] font-semibold text-zinc-500">{headline}</p>
              <div className="mt-3 max-w-[75%] rounded-2xl rounded-tl-sm bg-[#eef3f8] p-3 text-[13px] leading-relaxed">
                {intro}
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 border-t border-zinc-200 bg-white p-4">
              <button className="rounded-full border border-[#0a66c2] px-4 py-1.5 text-[12px] font-semibold text-[#0a66c2]">
                Learn more
              </button>
              <button className="rounded-full border border-zinc-300 px-4 py-1.5 text-[12px] font-semibold">
                Visit website
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Left rail */}
          <div className="absolute left-[2%] top-[10%] w-[19%] rounded-lg bg-white p-3 shadow-sm">
            <div className="h-12 rounded bg-gradient-to-r from-sky-200 to-indigo-200" />
            <div className="mx-auto -mt-5 h-12 w-12 rounded-full border-2 border-white bg-zinc-300" />
            <div className="mt-2 h-3 w-2/3 rounded bg-zinc-200" />
          </div>
          {/* Right rail */}
          <div className="absolute right-[2%] top-[10%] w-[22%] rounded-lg bg-white p-3 shadow-sm">
            <p className="text-[13px] font-semibold">LinkedIn News</p>
            {[0, 1, 2].map((i) => (
              <div key={i} className="mt-3 h-2.5 w-5/6 rounded bg-zinc-200" />
            ))}
          </div>

          {/* Center post */}
          <div className="absolute left-[24%] top-[10%] w-[50%] overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-2 p-3">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600" />
              <div>
                <p className="text-[13px] font-semibold">Your Company</p>
                <p className="text-[11px] text-zinc-500">12,480 followers · Promoted</p>
              </div>
            </div>
            <p className="px-3 pb-2 text-[13px] leading-snug">{intro}</p>
            <div className="relative aspect-[1.91/1] w-full bg-[linear-gradient(135deg,#0a66c2_0%,#1e293b_100%)]">
              {isCarousel ? (
                <div className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg shadow">
                  ›
                </div>
              ) : null}
              {isDoc ? (
                <div className="absolute inset-x-0 bottom-0 bg-black/55 p-2 text-center text-[11px] text-white">
                  Page 1 / 8 · Tap to unlock the full document
                </div>
              ) : null}
            </div>
            <div className="flex items-center justify-between bg-[#f3f6f8] p-3">
              <p className="truncate text-[13px] font-semibold">{headline}</p>
              <button className="ml-2 shrink-0 rounded-full border border-zinc-400 px-4 py-1.5 text-[12px] font-semibold">
                {isDoc ? "Download" : "Learn more"}
              </button>
            </div>
            <div className="flex justify-around border-t border-zinc-100 px-3 py-2 text-[12px] text-zinc-500">
              <span>👍 Like</span><span>💬 Comment</span><span>🔁 Repost</span><span>➤ Send</span>
            </div>
          </div>
        </>
      )}

      <SafeZoneOverlays zones={zones} />
    </div>
  );
}
