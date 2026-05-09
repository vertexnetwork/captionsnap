import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function XVerticalVideoSurface({ placement, truncated }: SurfaceProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed video */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#020617_0%,#0c4a6e_50%,#1e1b4b_100%)]" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(56,189,248,0.5), transparent 55%)",
        }}
      />

      {/* Top tabs */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-6 py-3 text-white">
        <span className="text-[12px] opacity-60">For You</span>
        <span className="text-[14px] font-bold">Following</span>
      </div>

      {/* Right rail engagement */}
      <div className="absolute right-2 top-[30%] flex flex-col items-center gap-3 text-white">
        <div className="h-10 w-10 rounded-full border-2 border-white bg-zinc-700" />
        <div className="flex flex-col items-center">
          <span className="text-[22px]">💬</span>
          <span className="text-[9px]">428</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">↻</span>
          <span className="text-[9px]">2.3K</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">♡</span>
          <span className="text-[9px]">18K</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">🔖</span>
          <span className="text-[9px]">Save</span>
        </div>
      </div>

      {/* Bottom-left username + caption */}
      <div className="absolute inset-x-0 bottom-[8%] px-3 text-white">
        <div className="max-w-[70%]">
          <p className="text-[13px] font-bold">
            {truncated.headline?.display || "@brand"} · Ad
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
        <span className="text-[10px] uppercase tracking-wide opacity-80">Ad</span>
        <button
          type="button"
          className="rounded bg-white px-3 py-1 text-[11px] font-bold text-black"
        >
          Learn more
        </button>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
