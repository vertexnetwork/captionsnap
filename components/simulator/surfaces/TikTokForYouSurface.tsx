import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function TikTokForYouSurface({ placement, truncated }: SurfaceProps) {
  const isShop = placement.id === "tiktok-shop-ads";

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Full-bleed video creative */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#0f172a_0%,#312e81_50%,#831843_100%)]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 40% 30%, rgba(244,63,94,0.5), transparent 55%), radial-gradient(circle at 60% 70%, rgba(34,211,238,0.4), transparent 50%)",
        }}
      />

      {/* Top tabs */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-6 py-3 text-white">
        <span className="text-[12px] opacity-60">Following</span>
        <span className="text-[14px] font-bold">For You</span>
        <span className="absolute right-3 top-3 text-[14px]">🔍</span>
      </div>

      {/* Right rail engagement */}
      <div className="absolute right-2 top-[30%] flex flex-col items-center gap-3 text-white">
        <div className="h-10 w-10 rounded-full border-2 border-white bg-zinc-700" />
        <div className="flex flex-col items-center">
          <span className="text-[22px]">♡</span>
          <span className="text-[9px]">28.4K</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">💬</span>
          <span className="text-[9px]">312</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">🔖</span>
          <span className="text-[9px]">Save</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[22px]">↗</span>
          <span className="text-[9px]">Share</span>
        </div>
        <div className="mt-2 h-7 w-7 rounded-full bg-zinc-800 ring-2 ring-white">
          <div className="m-auto mt-2 h-2 w-2 rounded-full bg-white" />
        </div>
      </div>

      {/* Pinned product card (Shop Ads only) */}
      {isShop ? (
        <div className="absolute right-3 bottom-[26%] flex items-center gap-2 rounded-md bg-white/95 p-2 text-black shadow-lg max-w-[60%]">
          <div className="h-10 w-10 shrink-0 rounded bg-gradient-to-br from-amber-400 to-rose-500" />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold">
              {truncated.headline?.display || "Product title"}
            </p>
            <p className="text-[10px] text-zinc-600 line-clamp-2">
              {truncated.description?.display || "Product description"}
            </p>
            <p className="text-[11px] font-bold text-rose-600">$29.99</p>
          </div>
        </div>
      ) : null}

      {/* Bottom-left username + caption */}
      <div className="absolute inset-x-0 bottom-[8%] px-3 text-white">
        <div className="max-w-[70%]">
          <p className="text-[13px] font-bold">
            {truncated.headline?.display || "@brand"}
          </p>
          {truncated.caption?.display ? (
            <p className="mt-1 text-[11px] leading-snug whitespace-pre-line">
              {truncated.caption.display}
            </p>
          ) : null}
          <p className="mt-1 flex items-center gap-1 text-[10px] opacity-80">
            🎵 Original sound · brand
          </p>
        </div>
      </div>

      {/* Bottom sponsored CTA strip */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-black/85 px-3 py-2 text-white">
        <span className="text-[10px] uppercase tracking-wide opacity-80">Sponsored</span>
        <button
          type="button"
          className="rounded bg-white px-3 py-1 text-[11px] font-bold text-black"
        >
          {isShop ? "Shop now" : "Learn more"}
        </button>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
