import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

// Desktop/web rendering for Meta feed-family placements. FB and IG web are
// light-themed and render the ad in a centered column flanked by nav rails —
// modelled here to match the desktop safe zones in lib/platform-specs.ts.

function isInstagram(id: string) {
  return id.startsWith("meta-instagram");
}

export function MetaDesktopSurface({ placement, truncated }: SurfaceProps) {
  const zones = placement.desktop?.safeZones ?? [];
  const ig = isInstagram(placement.id);
  const isCarousel = placement.id === "meta-facebook-carousel";
  const isMarketplace = placement.id === "meta-facebook-marketplace";

  const headline = truncated.headline?.display || "Your headline here";
  const description = truncated.description?.display || "Supporting description";
  const primary =
    truncated.primary?.display ||
    "Your primary text renders here, clipped exactly where the live feed adds “See more”.";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f0f2f5] text-[#1c1e21]">
      {/* Top nav bar */}
      <div
        className={`absolute inset-x-0 top-0 flex h-[8%] items-center gap-3 px-4 ${
          ig ? "border-b border-zinc-200 bg-white" : "bg-[#1877f2] text-white"
        }`}
      >
        <span className="text-[15px] font-extrabold">
          {ig ? "Instagram" : "facebook"}
        </span>
        <div
          className={`ml-2 h-5 w-40 rounded-full ${
            ig ? "bg-zinc-100" : "bg-white/20"
          }`}
        />
        <div className="ml-auto flex gap-2">
          <div className={`h-6 w-6 rounded-full ${ig ? "bg-zinc-200" : "bg-white/20"}`} />
          <div className={`h-6 w-6 rounded-full ${ig ? "bg-zinc-200" : "bg-white/20"}`} />
        </div>
      </div>

      {/* Left rail */}
      <div className="absolute bottom-0 left-0 top-[8%] w-[22%] space-y-2 p-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-zinc-300" />
            <div className="h-3 w-24 rounded bg-zinc-300" />
          </div>
        ))}
      </div>

      {/* Right rail (not present on IG / marketplace) */}
      {!ig && !isMarketplace ? (
        <div className="absolute bottom-0 right-0 top-[8%] w-[22%] space-y-2 p-3">
          <div className="h-3 w-20 rounded bg-zinc-300" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-zinc-300" />
              <div className="h-3 w-28 rounded bg-zinc-300" />
            </div>
          ))}
        </div>
      ) : null}

      {/* Centered post column */}
      <div
        className={`absolute top-[10%] ${
          isMarketplace ? "left-[28%] right-[4%]" : ig ? "left-[20%] right-[20%]" : "left-[24%] right-[24%]"
        } overflow-hidden rounded-lg bg-white shadow-sm`}
        style={{ bottom: "6%" }}
      >
        {/* Post header */}
        <div className="flex items-center gap-2 p-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">Your Brand</p>
            <p className="text-[11px] text-zinc-500">Sponsored · 🌐</p>
          </div>
          <span className="ml-auto text-zinc-400">⋯</span>
        </div>

        {!isMarketplace ? (
          <p className="px-3 pb-2 text-[13px] leading-snug whitespace-pre-line">
            {primary}
          </p>
        ) : null}

        {/* Media */}
        <div className="relative h-[46%] w-full bg-[linear-gradient(135deg,#6366f1_0%,#ec4899_100%)]">
          {isCarousel ? (
            <div className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg shadow">
              ›
            </div>
          ) : null}
        </div>

        {/* Link card / CTA */}
        <div className="flex items-center gap-3 border-t border-zinc-100 bg-[#f7f8fa] p-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">
              your-site.com
            </p>
            <p className="truncate text-[14px] font-semibold">{headline}</p>
            {!ig ? (
              <p className="truncate text-[12px] text-zinc-500">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="shrink-0 rounded-md bg-zinc-200 px-3 py-1.5 text-[12px] font-semibold"
          >
            Learn more
          </button>
        </div>

        {/* Reaction bar */}
        <div className="flex items-center justify-around border-t border-zinc-100 px-3 py-2 text-[12px] text-zinc-500">
          <span>👍 Like</span>
          <span>💬 Comment</span>
          <span>↗ Share</span>
        </div>
      </div>

      <SafeZoneOverlays zones={zones} />
    </div>
  );
}
