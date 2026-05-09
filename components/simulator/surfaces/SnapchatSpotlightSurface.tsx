import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function SnapchatSpotlightSurface({ placement, truncated }: SurfaceProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#facc15_0%,#a855f7_50%,#0f172a_100%)]" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(250,204,21,0.55), transparent 55%), radial-gradient(circle at 65% 65%, rgba(168,85,247,0.55), transparent 55%)",
        }}
      />

      {/* Top tabs */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-6 py-3 text-white">
        <span className="text-[12px] opacity-60">For You</span>
        <span className="text-[14px] font-bold">Spotlight</span>
        <span className="absolute right-3 top-3 text-[14px]">🔍</span>
      </div>

      {/* Right rail */}
      <div className="absolute right-2 top-[30%] flex flex-col items-center gap-3 text-white">
        <div className="h-10 w-10 rounded-full border-2 border-white bg-zinc-700" />
        <div className="flex flex-col items-center">
          <span className="text-[22px]">♡</span>
          <span className="text-[9px]">42K</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">💬</span>
          <span className="text-[9px]">1.1K</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">↗</span>
          <span className="text-[9px]">Share</span>
        </div>
      </div>

      {/* Username + caption */}
      <div className="absolute inset-x-0 bottom-[8%] px-3 text-white">
        <div className="max-w-[70%]">
          <p className="text-[13px] font-bold">
            {truncated.headline?.display || "@brand"} · Sponsored
          </p>
          {truncated.primary?.display ? (
            <p className="mt-1 text-[11px] leading-snug whitespace-pre-line">
              {truncated.primary.display}
            </p>
          ) : null}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-black/85 px-3 py-2 text-white">
        <span className="text-[10px] uppercase tracking-wide opacity-80">Sponsored</span>
        <button
          type="button"
          className="rounded bg-yellow-300 px-3 py-1 text-[11px] font-bold text-black"
        >
          Visit
        </button>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
