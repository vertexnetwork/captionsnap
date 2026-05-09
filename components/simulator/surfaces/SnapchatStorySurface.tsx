import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function SnapchatStorySurface({ placement, truncated }: SurfaceProps) {
  const isCollection = placement.id === "snap-collection";
  const isStory = placement.id === "snap-story-ad";

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed creative */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fefce8_0%,#fde047_50%,#facc15_100%)]" />

      {/* Discover tile chrome (story ad only) */}
      {isStory ? (
        <div className="absolute inset-x-0 top-0 flex flex-col gap-1 bg-black/40 px-3 py-2 text-white backdrop-blur">
          <p className="text-[10px] uppercase tracking-wide opacity-70">Story</p>
          <p className="text-[12px] font-bold">Brand · Sponsored</p>
        </div>
      ) : (
        <>
          <div className="absolute inset-x-0 top-0 px-3 pt-2">
            <div className="flex gap-1">
              <span className="h-0.5 flex-1 rounded-full bg-white" />
              <span className="h-0.5 flex-1 rounded-full bg-white/30" />
              <span className="h-0.5 flex-1 rounded-full bg-white/30" />
            </div>
          </div>
        </>
      )}

      {/* Brand chip */}
      <div className="absolute inset-x-0 top-[14%] flex items-center gap-2 px-3 text-zinc-900">
        <div className="h-7 w-7 rounded-full bg-white shadow" />
        {truncated.headline?.display ? (
          <span className="text-[11px] font-semibold">{truncated.headline.display}</span>
        ) : null}
        <span className="rounded bg-black/70 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-yellow-300">
          Sponsored
        </span>
      </div>

      {/* Headline */}
      {truncated.primary?.display ? (
        <div className="absolute left-1/2 top-1/2 w-[80%] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="rounded-md bg-black/70 px-3 py-2 text-[15px] font-extrabold leading-tight text-white whitespace-pre-line">
            {truncated.primary.display}
          </p>
        </div>
      ) : null}

      {/* Collection tiles */}
      {isCollection ? (
        <div className="absolute inset-x-2 bottom-[14%] grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded bg-white/95 shadow" />
          ))}
        </div>
      ) : null}

      {/* CTA */}
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <button
          type="button"
          className="rounded-full bg-yellow-300 px-6 py-2 text-[12px] font-extrabold text-black shadow-lg"
        >
          Swipe up ↑
        </button>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
