import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function MetaMessengerSurface({ placement, truncated }: SurfaceProps) {
  return (
    <div className="absolute inset-0 flex flex-col bg-zinc-950 text-white">
      {/* Messenger top nav */}
      <div className="flex items-center justify-between px-3 py-3 shrink-0">
        <span className="text-[18px] font-bold">Chats</span>
        <div className="flex gap-3 text-[16px]">
          <span>📷</span>
          <span>✏️</span>
        </div>
      </div>
      <div className="mx-3 flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-2 text-[12px] text-zinc-400 shrink-0">
        🔍 Search
      </div>

      {/* Decoy inbox row above */}
      <div className="mt-3 flex items-center gap-3 px-3 py-2 shrink-0">
        <div className="h-12 w-12 rounded-full bg-zinc-700" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold">Alex Rivera</p>
          <p className="truncate text-[11px] text-zinc-400">Hey, can you send the file?</p>
        </div>
        <span className="text-[10px] text-zinc-500">12:04</span>
      </div>

      {/* Sponsored inbox row — this is the ad */}
      <div className="border-t border-b border-accent/20 bg-accent/5 px-3 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-amber-400">
            <span className="absolute -bottom-1 -right-1 rounded-full bg-zinc-900 px-1 text-[8px] font-bold text-accent">
              AD
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="truncate text-[13px] font-semibold">
                {truncated.headline?.display || "Brand"}
              </p>
              <span className="shrink-0 text-[10px] text-zinc-500">Sponsored</span>
            </div>
            <p className="truncate text-[11px] text-zinc-300">
              {truncated.primary?.display || "Tap to chat"}
            </p>
            {truncated.description?.display ? (
              <p className="truncate text-[10px] text-zinc-500">
                {truncated.description.display}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          className="mt-2 w-full rounded-md bg-accent py-2 text-[12px] font-bold text-black"
        >
          Open chat →
        </button>
      </div>

      {/* Decoy inbox row below */}
      <div className="flex items-center gap-3 px-3 py-2 shrink-0">
        <div className="h-12 w-12 rounded-full bg-zinc-700" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold">Mom</p>
          <p className="truncate text-[11px] text-zinc-400">Don&apos;t forget Sunday</p>
        </div>
        <span className="text-[10px] text-zinc-500">Mon</span>
      </div>

      {/* Bottom tab bar */}
      <div className="mt-auto flex items-center justify-around border-t border-zinc-800 py-2 text-[11px] text-zinc-400 shrink-0">
        <span>💬 Chats</span>
        <span>📞 Calls</span>
        <span>👥 People</span>
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
