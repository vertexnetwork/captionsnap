import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function MetaFeedSurface({ placement, truncated }: SurfaceProps) {
  const isCarousel = placement.id === "meta-facebook-carousel";
  const isInstagram = placement.id.startsWith("meta-instagram");
  const isExplore = placement.id === "meta-instagram-explore";
  const isMarketplace = placement.id === "meta-facebook-marketplace";

  const brandLabel = isInstagram ? "@brand" : "Brand";
  const sponsoredLabel = isMarketplace ? "Sponsored · Listing" : "Sponsored";

  return (
    <div className="absolute inset-0 flex flex-col bg-zinc-950 text-white">
      {/* Top app chrome */}
      {isInstagram ? (
        <div className="flex items-center justify-between px-3 py-2 text-[12px] shrink-0">
          <span className="font-bold tracking-wide">Instagram</span>
          <span className="opacity-80">♡  ✈</span>
        </div>
      ) : null}

      {/* Header: profile + sponsored */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-amber-400" />
        <div className="flex flex-col text-[10px] leading-tight">
          <span className="font-semibold text-[11px]">{brandLabel}</span>
          <span className="text-zinc-400">
            {sponsoredLabel} · 🌐
          </span>
        </div>
        <span className="ml-auto text-zinc-400 text-[14px]">⋯</span>
      </div>

      {/* Primary text (above image on Feed) */}
      {truncated.primary?.display ? (
        <p className="px-3 pb-2 text-[12px] leading-snug whitespace-pre-line shrink-0">
          {truncated.primary.display}
        </p>
      ) : null}

      {/* Creative image */}
      <div
        className="relative mx-0 shrink-0 bg-gradient-to-br from-fuchsia-700 via-violet-700 to-indigo-700"
        style={{ aspectRatio: isExplore ? "1 / 1" : "1 / 1" }}
      >
        {isCarousel ? (
          <>
            <div className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white">
              ›
            </div>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              <span className="h-1 w-1 rounded-full bg-white" />
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="h-1 w-1 rounded-full bg-white/40" />
            </div>
          </>
        ) : null}
        {isMarketplace ? (
          <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-[12px] font-bold">
            $99
          </div>
        ) : null}
        {/* "Sponsored" watermark to make the creative obviously fake */}
        <div className="absolute bottom-2 right-2 rounded bg-black/40 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white/70">
          Creative
        </div>
      </div>

      {/* Bottom chrome strip: description + headline + CTA */}
      <div className="flex items-stretch border-t border-zinc-800 bg-zinc-900 shrink-0">
        <div className="flex flex-1 flex-col justify-center px-3 py-2 min-w-0">
          {truncated.description?.display ? (
            <p className="text-[10px] uppercase tracking-wide text-zinc-400 truncate">
              {truncated.description.display}
            </p>
          ) : null}
          {truncated.headline?.display ? (
            <p className="text-[13px] font-semibold leading-tight">
              {truncated.headline.display}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          className="m-2 shrink-0 rounded bg-zinc-700 px-3 py-2 text-[11px] font-semibold whitespace-nowrap"
        >
          {isMarketplace ? "Send msg" : "Learn more"}
        </button>
      </div>

      {/* Reaction bar */}
      <div className="mt-auto flex items-center justify-between border-t border-zinc-800 px-4 py-2 text-[12px] text-zinc-400 shrink-0">
        {isInstagram ? (
          <>
            <span>♡</span>
            <span>💬</span>
            <span>✈</span>
            <span className="ml-auto">🔖</span>
          </>
        ) : (
          <>
            <span>👍 Like</span>
            <span>💬 Comment</span>
            <span>↗ Share</span>
          </>
        )}
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
