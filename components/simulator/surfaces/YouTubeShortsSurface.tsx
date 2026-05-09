import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function YouTubeShortsSurface({ placement, truncated }: SurfaceProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#1a0808_0%,#7f1d1d_50%,#0c0a09_100%)]" />
      <div
        className="absolute inset-0 opacity-55"
        style={{
          background:
            "radial-gradient(circle at 45% 40%, rgba(239,68,68,0.55), transparent 55%), radial-gradient(circle at 60% 70%, rgba(251,113,133,0.4), transparent 55%)",
        }}
      />

      {/* Top header */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2 text-white">
        <span className="text-[12px] font-bold">Shorts</span>
        <span className="text-[14px]">🔍</span>
      </div>

      {/* Right rail */}
      <div className="absolute right-2 top-[30%] flex flex-col items-center gap-4 text-white">
        <div className="flex flex-col items-center">
          <span className="text-[22px]">👍</span>
          <span className="text-[9px]">88K</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">👎</span>
          <span className="text-[9px]">Dislike</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">💬</span>
          <span className="text-[9px]">2.1K</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">↗</span>
          <span className="text-[9px]">Share</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">🎵</span>
          <span className="text-[9px]">Remix</span>
        </div>
        <div className="mt-2 h-7 w-7 rounded-full border-2 border-white bg-red-600" />
      </div>

      {/* Bottom: channel + description */}
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
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-black/80 px-3 py-2 text-white">
        <span className="text-[10px] uppercase tracking-wide opacity-80">Sponsored</span>
        <button
          type="button"
          className="rounded bg-white px-3 py-1 text-[11px] font-bold text-black"
        >
          Visit site
        </button>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
