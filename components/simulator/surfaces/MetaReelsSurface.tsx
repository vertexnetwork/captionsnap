import type { SurfaceProps } from "./types";

export function MetaReelsSurface({ placement, truncated }: SurfaceProps) {
  const isInstagram = placement.id.startsWith("meta-instagram");
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed video creative */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#1e3a8a_0%,#0f172a_60%,#000_100%)]" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 30% 35%, rgba(168,85,247,0.6), transparent 55%), radial-gradient(circle at 70% 65%, rgba(34,211,238,0.4), transparent 50%)",
        }}
      />

      {/* Top header */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2 text-white">
        <span className="text-[14px] font-bold">{isInstagram ? "Reels" : "Reels"}</span>
        <span className="text-[14px]">📷</span>
      </div>

      {/* Right rail engagement */}
      <div className="absolute right-2 top-[30%] flex flex-col items-center gap-4 text-white">
        <div className="flex flex-col items-center">
          <span className="text-[20px]">♡</span>
          <span className="text-[9px]">12K</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[20px]">💬</span>
          <span className="text-[9px]">428</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[20px]">↗</span>
          <span className="text-[9px]">Share</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[20px]">⋯</span>
        </div>
        <div className="mt-2 h-7 w-7 rounded-full border-2 border-white bg-zinc-700" />
      </div>

      {/* Bottom-left username + caption */}
      <div className="absolute inset-x-0 bottom-[8%] px-3 text-white">
        <div className="max-w-[70%]">
          <p className="text-[12px] font-bold">@brand · Sponsored</p>
          {truncated.primary?.display ? (
            <p className="mt-1 text-[11px] leading-snug whitespace-pre-line">
              {truncated.primary.display}
            </p>
          ) : null}
        </div>
      </div>

      {/* Bottom CTA strip with headline */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-black/70 px-3 py-2 text-white">
        <span className="text-[11px] font-semibold truncate max-w-[60%]">
          {truncated.headline?.display || "Sponsored"}
        </span>
        <button
          type="button"
          className="rounded bg-white px-3 py-1 text-[11px] font-bold text-black"
        >
          Learn more
        </button>
      </div>

      {/* Safe-zone overlays */}
      {placement.safeZones.map((z) => (
        <div
          key={z.id}
          className="pointer-events-none absolute"
          style={{
            left: `${z.x}%`,
            top: `${z.y}%`,
            width: `${z.w}%`,
            height: `${z.h}%`,
            background: "rgba(255,61,110,0.18)",
            outline: "1px dashed rgba(255,61,110,0.7)",
          }}
          title={z.reason}
          aria-label={`Safe zone: ${z.reason}`}
        />
      ))}
    </div>
  );
}
