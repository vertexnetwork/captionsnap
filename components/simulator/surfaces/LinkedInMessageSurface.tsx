import type { SurfaceProps } from "./types";
import { SafeZoneOverlays } from "./SafeZoneOverlays";

export function LinkedInMessageSurface({ placement, truncated }: SurfaceProps) {
  const isConversation = placement.id === "linkedin-conversation";

  return (
    <div className="absolute inset-0 flex flex-col bg-white text-zinc-900">
      {/* Messaging header */}
      <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2 shrink-0">
        <span className="text-[14px] text-zinc-500">‹</span>
        <span className="text-[12px] font-semibold">Messaging</span>
        <span className="ml-auto text-[12px] text-zinc-500">×</span>
      </div>

      {/* Sender / Sponsored */}
      <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2 shrink-0">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500" />
        <div className="flex flex-col text-[10px] leading-tight">
          <span className="font-semibold text-[12px]">Sender at Brand</span>
          <span className="text-zinc-500">Sponsored · InMail</span>
        </div>
      </div>

      {/* Subject */}
      {truncated.headline?.display ? (
        <p className="px-3 py-2 text-[13px] font-semibold shrink-0">
          {truncated.headline.display}
        </p>
      ) : null}

      {/* Body */}
      {truncated.primary?.display ? (
        <p className="px-3 pb-3 text-[12px] leading-snug whitespace-pre-line shrink-0">
          {truncated.primary.display}
        </p>
      ) : null}

      {/* CTA buttons */}
      <div className="mt-auto flex flex-col gap-2 border-t border-zinc-200 px-3 py-3 shrink-0">
        {isConversation ? (
          <>
            <button
              type="button"
              className="rounded-md border border-[#0a66c2] px-3 py-2 text-[12px] font-semibold text-[#0a66c2]"
            >
              {truncated.description?.display || "Tell me more"}
            </button>
            <button
              type="button"
              className="rounded-md border border-zinc-300 px-3 py-2 text-[12px] font-medium text-zinc-700"
            >
              Get pricing
            </button>
            <button
              type="button"
              className="rounded-md border border-zinc-300 px-3 py-2 text-[12px] font-medium text-zinc-700"
            >
              No thanks
            </button>
          </>
        ) : (
          <button
            type="button"
            className="rounded-md bg-[#0a66c2] px-3 py-2 text-[12px] font-semibold text-white"
          >
            {truncated.description?.display || "Reply"}
          </button>
        )}
      </div>

      <SafeZoneOverlays zones={placement.safeZones} />
    </div>
  );
}
