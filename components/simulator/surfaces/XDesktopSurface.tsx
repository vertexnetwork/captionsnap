import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

// x.com web — three-column layout: nav rail, timeline column with the
// promoted post / amplify pre-roll, trends sidebar. Matches the desktop safe
// zones in lib/platform-specs.ts.

export function XDesktopSurface({ placement, truncated }: SurfaceProps) {
  const zones = placement.desktop?.safeZones ?? [];
  const isPreroll = placement.id === "x-amplify-preroll";
  const post =
    truncated.primary?.display ||
    "Your post text renders here — X caps it at 280 characters with no “show more”.";
  const headline = truncated.headline?.display || "Website card headline";

  return (
    <div className="absolute inset-0 overflow-hidden bg-black text-white">
      {/* Left nav rail */}
      <div className="absolute inset-y-0 left-0 w-[22%] space-y-4 border-r border-zinc-800 p-5">
        <span className="text-[22px] font-black">𝕏</span>
        {["Home", "Explore", "Notifications", "Messages", "Profile"].map((l) => (
          <div key={l} className="flex items-center gap-3 text-[15px] text-zinc-200">
            <span className="h-5 w-5 rounded-full bg-zinc-700" />
            {l}
          </div>
        ))}
        <button className="mt-3 w-[80%] rounded-full bg-[#1d9bf0] py-2 text-[14px] font-bold">
          Post
        </button>
      </div>

      {/* Right sidebar */}
      <div className="absolute inset-y-0 right-0 w-[30%] space-y-3 border-l border-zinc-800 p-4">
        <div className="h-9 w-full rounded-full bg-zinc-900 px-4 text-[12px] leading-9 text-zinc-500">
          Search
        </div>
        <div className="rounded-2xl bg-zinc-900 p-3">
          <p className="text-[14px] font-bold">Trends for you</p>
          {[0, 1, 2].map((i) => (
            <div key={i} className="mt-3 space-y-1">
              <div className="h-2 w-1/3 rounded bg-zinc-700" />
              <div className="h-3 w-2/3 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>

      {/* Center timeline column */}
      <div className="absolute inset-y-0 left-[22%] w-[48%] overflow-hidden border-x border-zinc-800">
        <div className="border-b border-zinc-800 p-3 text-[15px] font-bold">Home</div>
        <div className="border-b border-zinc-800 p-4">
          <div className="flex gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px]">
                <span className="font-bold">Your Brand</span>{" "}
                <span className="text-zinc-500">@brand · Ad</span>
              </p>
              <p className="mt-1 text-[14px] leading-snug whitespace-pre-line">{post}</p>

              {isPreroll ? (
                <div className="relative mt-3 aspect-video overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0f172a,#312e81)]">
                  <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[11px]">
                    Ad · 0:08
                  </span>
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[11px]">
                    From @publisher
                  </span>
                </div>
              ) : (
                <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-800">
                  <div className="aspect-video bg-[linear-gradient(135deg,#0f172a,#831843)]" />
                  <div className="flex items-center justify-between bg-zinc-900 p-3">
                    <div className="min-w-0">
                      <p className="text-[11px] text-zinc-500">your-site.com</p>
                      <p className="truncate text-[14px] font-semibold">{headline}</p>
                    </div>
                    <button className="ml-2 shrink-0 rounded-full bg-zinc-200 px-3 py-1.5 text-[12px] font-bold text-black">
                      Learn more
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-3 flex justify-between pr-6 text-[13px] text-zinc-500">
                <span>💬 24</span>
                <span>🔁 8</span>
                <span>♡ 142</span>
                <span>📊 12K</span>
                <span>🔖</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SafeZoneOverlays zones={zones} />
    </div>
  );
}
