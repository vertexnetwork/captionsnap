import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

// YouTube is a desktop-heavy platform. Desktop renders the watch page
// (in-stream / bumper, with the desktop-only companion banner), the home
// masthead, search/home discovery, and web Shorts. Matches the desktop safe
// zones in lib/platform-specs.ts.

function YtNav() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[9%] items-center gap-4 px-5">
      <span className="text-[16px] font-bold">
        <span className="text-red-600">▶</span> YouTube
      </span>
      <div className="mx-auto h-9 w-96 rounded-full border border-zinc-700 bg-zinc-900 px-4 text-[12px] leading-9 text-zinc-500">
        Search
      </div>
      <div className="h-8 w-8 rounded-full bg-zinc-700" />
    </div>
  );
}

export function YouTubeDesktopSurface({ placement, truncated }: SurfaceProps) {
  const zones = placement.desktop?.safeZones ?? [];
  const surface = placement.surface;
  const headline = truncated.headline?.display || "Your headline";
  const desc =
    truncated.description?.display ||
    truncated.primary?.display ||
    "Your description renders here, clipped where YouTube cuts it.";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0f0f0f] text-white">
      <YtNav />

      {/* Left rail (not on watch page) */}
      {surface !== "instream" ? (
        <div className="absolute bottom-0 left-0 top-[9%] w-[16%] space-y-3 p-3">
          {["Home", "Shorts", "Subscriptions", "You", "History"].map((l) => (
            <div key={l} className="flex items-center gap-3 text-[12px] text-zinc-300">
              <span className="h-5 w-5 rounded bg-zinc-700" />
              {l}
            </div>
          ))}
        </div>
      ) : null}

      {/* WATCH PAGE — skippable in-stream / bumper */}
      {surface === "instream" ? (
        <>
          <div
            className="absolute left-[2%] top-[11%] overflow-hidden rounded-xl bg-[linear-gradient(135deg,#0f172a_0%,#7c2d12_100%)]"
            style={{ width: "64%", aspectRatio: "16 / 9" }}
          >
            <div className="absolute left-3 top-3 rounded bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-black">
              Ad
            </div>
            <div className="absolute left-3 bottom-6 max-w-[55%] rounded bg-black/55 p-3">
              <p className="text-[14px] font-bold">{headline}</p>
              <button
                type="button"
                className="mt-2 rounded bg-white px-3 py-1 text-[12px] font-bold text-black"
              >
                Learn more
              </button>
            </div>
            <button
              type="button"
              className="absolute bottom-4 right-4 rounded bg-black/70 px-3 py-1.5 text-[12px] font-semibold"
            >
              Skip Ad ›
            </button>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-yellow-400/30">
              <div className="h-full w-2/5 bg-yellow-400" />
            </div>
          </div>
          {/* Companion banner — desktop only */}
          <div className="absolute right-[2%] top-[12%] grid h-[30%] w-[26%] place-items-center rounded-lg bg-zinc-800 text-center text-[11px] text-zinc-400">
            Companion banner
            <br />
            300×250
          </div>
          <div className="absolute left-[2%] top-[58%] w-[64%]">
            <p className="text-[15px] font-semibold">{headline}</p>
            <p className="mt-1 text-[12px] text-zinc-400">Advertiser · Sponsored</p>
          </div>
        </>
      ) : null}

      {/* MASTHEAD — home takeover banner */}
      {surface === "masthead" ? (
        <div className="absolute left-[16%] right-0 top-[11%]">
          <div
            className="relative overflow-hidden rounded-xl bg-[linear-gradient(120deg,#1e293b_0%,#7c2d12_100%)]"
            style={{ aspectRatio: "16 / 6" }}
          >
            <div className="absolute right-4 top-4 flex gap-2 text-[12px]">
              <span className="rounded-full bg-black/50 px-2 py-1">🔊</span>
            </div>
            <div className="absolute bottom-5 left-5 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-amber-500" />
              <div>
                <p className="text-[16px] font-bold">{headline}</p>
                <p className="text-[12px] text-zinc-300">{desc}</p>
              </div>
              <button
                type="button"
                className="ml-4 rounded bg-white px-3 py-1.5 text-[12px] font-bold text-black"
              >
                Visit site
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <div className="aspect-video rounded-lg bg-zinc-800" />
                <div className="mt-1 h-2 w-3/4 rounded bg-zinc-700" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* DISCOVERY — search / home in-feed video ad */}
      {surface === "discovery" ? (
        <div className="absolute left-[16%] right-0 top-[11%] space-y-4 pr-6">
          <div className="flex gap-4">
            <div className="relative aspect-video w-[38%] shrink-0 rounded-lg bg-[linear-gradient(135deg,#0f172a_0%,#7c2d12_100%)]">
              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px]">
                0:30 · Ad
              </span>
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-[17px] font-semibold">{headline}</p>
              <p className="mt-1 text-[12px] text-zinc-400">Brand · Sponsored</p>
              <p className="mt-2 line-clamp-2 text-[12px] text-zinc-400">{desc}</p>
            </div>
          </div>
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4 opacity-50">
              <div className="aspect-video w-[38%] shrink-0 rounded-lg bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded bg-zinc-700" />
                <div className="h-3 w-1/2 rounded bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* SHORTS — web shorts player */}
      {surface === "shorts" ? (
        <>
          <div
            className="absolute top-[11%] overflow-hidden rounded-xl bg-[linear-gradient(160deg,#0f172a_0%,#831843_100%)]"
            style={{ left: "30%", width: "28%", bottom: "5%" }}
          >
            <div className="absolute left-3 top-3 rounded bg-black/40 px-2 py-0.5 text-[10px] uppercase">
              Sponsored
            </div>
            <div className="absolute inset-x-3 bottom-3">
              <p className="text-[13px] font-bold">@{headline}</p>
              <p className="mt-1 line-clamp-2 text-[12px]">{desc}</p>
              <button
                type="button"
                className="mt-2 w-full rounded bg-white py-1.5 text-[12px] font-bold text-black"
              >
                Learn more
              </button>
            </div>
          </div>
          <div
            className="absolute flex flex-col items-center gap-4"
            style={{ left: "59%", top: "32%" }}
          >
            {["👍", "👎", "💬", "↗"].map((g, i) => (
              <span key={i} className="text-[20px]">
                {g}
              </span>
            ))}
          </div>
        </>
      ) : null}

      <SafeZoneOverlays zones={zones} />
    </div>
  );
}
