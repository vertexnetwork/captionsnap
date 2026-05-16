import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

// TikTok web For-You — the desktop rendering for In-Feed / Spark / Portrait:
// left nav rail, centered 9:16 player, engagement column to the right of the
// video, caption + CTA below. Matches the desktop safe zones in
// lib/platform-specs.ts.

export function TikTokDesktopSurface({ placement, truncated }: SurfaceProps) {
  const zones = placement.desktop?.safeZones ?? [];
  const handle = truncated.headline?.display || "@brand";
  const caption =
    truncated.caption?.display ||
    "Your caption renders here, clipped exactly where TikTok web adds “more”.";

  return (
    <div className="absolute inset-0 overflow-hidden bg-black text-white">
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 flex h-[9%] items-center gap-4 px-5">
        <span className="text-[17px] font-extrabold">TikTok</span>
        <div className="mx-auto h-9 w-80 rounded-full bg-zinc-800 px-4 text-[12px] leading-9 text-zinc-400">
          Search
        </div>
        <div className="rounded bg-[#fe2c55] px-3 py-1.5 text-[12px] font-bold">
          Log in
        </div>
      </div>

      {/* Left nav */}
      <div className="absolute bottom-0 left-0 top-[9%] w-[18%] space-y-3 border-r border-zinc-800 p-4">
        {["For You", "Explore", "Following", "Friends", "LIVE"].map((l) => (
          <div key={l} className="flex items-center gap-3 text-[13px] text-zinc-300">
            <span className="h-5 w-5 rounded bg-zinc-700" />
            {l}
          </div>
        ))}
      </div>

      {/* Centered 9:16 player */}
      <div
        className="absolute top-[11%] overflow-hidden rounded-xl"
        style={{
          left: "30%",
          width: "30%",
          bottom: "5%",
          background:
            "linear-gradient(160deg,#0f172a 0%,#312e81 50%,#831843 100%)",
        }}
      >
        <div className="absolute left-3 top-3 rounded bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wide">
          Sponsored
        </div>
        {/* Caption + CTA over the bottom of the player */}
        <div className="absolute inset-x-3 bottom-3">
          <p className="text-[13px] font-bold">{handle}</p>
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug">{caption}</p>
          <button
            type="button"
            className="mt-2 w-full rounded bg-[#fe2c55] py-1.5 text-[12px] font-bold"
          >
            Learn more
          </button>
        </div>
      </div>

      {/* Engagement column to the right of the video */}
      <div
        className="absolute flex flex-col items-center gap-4 text-center"
        style={{ left: "61%", top: "32%" }}
      >
        <div className="h-11 w-11 rounded-full bg-zinc-700 ring-2 ring-white" />
        {["♡", "💬", "🔖", "↗"].map((g, i) => (
          <div key={i} className="text-[22px]">
            {g}
            <div className="text-[10px] text-zinc-400">
              {["28.4K", "312", "Save", "Share"][i]}
            </div>
          </div>
        ))}
      </div>

      <SafeZoneOverlays zones={zones} />
    </div>
  );
}
