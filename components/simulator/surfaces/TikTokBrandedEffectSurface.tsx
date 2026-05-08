import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function TikTokBrandedEffectSurface({ placement, truncated }: SurfaceProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Camera/video background */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1e1b4b_0%,#5b21b6_50%,#831843_100%)]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(168,85,247,0.55), transparent 55%)",
        }}
      />

      {/* Top: capture controls */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-3 text-white">
        <span className="text-[14px]">×</span>
        <span className="text-[12px] font-semibold">Effects</span>
        <span className="text-[14px]">⚙</span>
      </div>

      {/* Center: AR effect badge */}
      <div className="absolute left-1/2 top-[35%] -translate-x-1/2 flex flex-col items-center text-white">
        <div className="h-16 w-16 rounded-full border-2 border-white bg-gradient-to-br from-amber-400 to-rose-500 shadow-xl" />
        <p className="mt-2 rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold">
          ✨ Branded Effect
        </p>
      </div>

      {/* Effect description (caption) */}
      {truncated.caption?.display ? (
        <div className="absolute inset-x-0 top-[58%] px-6 text-center">
          <p className="rounded-md bg-black/40 px-3 py-2 text-[12px] font-medium leading-snug text-white whitespace-pre-line">
            {truncated.caption.display}
          </p>
        </div>
      ) : null}

      {/* Effect tray (bottom 14%) */}
      <div className="absolute inset-x-0 bottom-[8%] flex items-center justify-center gap-2 bg-black/70 px-3 py-3">
        <div className="h-10 w-10 rounded-md bg-zinc-700" />
        <div className="h-10 w-10 rounded-md ring-2 ring-white bg-gradient-to-br from-amber-400 to-rose-500" />
        <div className="h-10 w-10 rounded-md bg-zinc-700" />
        <div className="h-10 w-10 rounded-md bg-zinc-700" />
        <div className="h-10 w-10 rounded-md bg-zinc-700" />
      </div>

      {/* Bottom: use effect CTA */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/85 py-2">
        <button
          type="button"
          className="rounded-full bg-white px-5 py-1.5 text-[12px] font-bold text-black"
        >
          Use this effect
        </button>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
