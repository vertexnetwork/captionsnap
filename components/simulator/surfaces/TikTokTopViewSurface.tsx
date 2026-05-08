import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function TikTokTopViewSurface({ placement, truncated }: SurfaceProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed video creative */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0c0a09_0%,#7c2d12_50%,#1c1917_100%)]" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(251,146,60,0.55), transparent 60%)",
        }}
      />

      {/* Top-right skip + countdown */}
      <div className="absolute right-3 top-3 flex items-center gap-2 text-white">
        <div className="rounded-full border border-white/40 px-2 py-1 text-[10px]">5s</div>
        <button
          type="button"
          className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold"
        >
          Skip ›
        </button>
      </div>

      {/* Centered hero text composed into the video */}
      {truncated.caption?.display ? (
        <div className="absolute left-1/2 top-[40%] w-[80%] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="rounded-md bg-black/30 px-3 py-2 text-[16px] font-extrabold leading-tight text-white whitespace-pre-line">
            {truncated.caption.display}
          </p>
        </div>
      ) : null}

      {/* Bottom CTA card (TopView's signature large card) */}
      <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 p-3 text-black shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 rounded-md bg-gradient-to-br from-rose-500 to-orange-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold">
              {truncated.headline?.display || "@brand"}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">Featured ad</p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full bg-black px-3 py-2 text-[11px] font-bold text-white"
          >
            Download
          </button>
        </div>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
