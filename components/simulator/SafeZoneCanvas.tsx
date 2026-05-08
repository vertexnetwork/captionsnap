"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrentPlacement, useSimulator } from "./SimulatorProvider";
import { truncatePlacement } from "@/lib/truncate";
import { cn } from "@/lib/cn";

export function SafeZoneCanvas({ embedded = false }: { embedded?: boolean }) {
  const placement = useCurrentPlacement();
  const { state } = useSimulator();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const targetW = placement.device.w;
      const targetH = placement.device.h;
      const s = Math.min(w / targetW, h / targetH, 1);
      setScale(s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [placement.device.w, placement.device.h]);

  const truncated = truncatePlacement(state.fields, placement);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative w-full",
        embedded ? "h-[640px]" : "h-[640px] sm:h-[720px]",
      )}
      data-testid="safe-zone-canvas"
    >
      <div
        className="absolute left-1/2 top-1/2 origin-center"
        style={{
          width: placement.device.w,
          height: placement.device.h,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[42px] border border-border bg-black shadow-[0_0_60px_rgba(0,0,0,0.55)]">
          {/* Phone-screen content */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
            <PreviewContent
              platform={placement.platform}
              primary={truncated.primary?.display}
              headline={truncated.headline?.display}
              description={truncated.description?.display}
              caption={truncated.caption?.display}
            />
          </div>

          {/* Safe-zone overlays */}
          {placement.safeZones.map((z) => (
            <div
              key={z.id}
              className="absolute pointer-events-none"
              style={{
                left: `${z.x}%`,
                top: `${z.y}%`,
                width: `${z.w}%`,
                height: `${z.h}%`,
                background: "rgba(255, 61, 110, 0.22)",
                outline: "1px solid rgba(255, 61, 110, 0.6)",
              }}
              title={z.reason}
              aria-label={`Safe zone: ${z.reason}`}
            />
          ))}
          {/* Notch */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-6 w-32 -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

function PreviewContent({
  platform,
  primary,
  headline,
  description,
  caption,
}: {
  platform: "meta" | "tiktok";
  primary?: string;
  headline?: string;
  description?: string;
  caption?: string;
}) {
  if (platform === "meta") {
    return (
      <div className="flex h-full w-full flex-col text-white">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="h-7 w-7 rounded-full bg-zinc-700" />
          <div className="flex flex-col text-[10px] leading-tight">
            <span className="font-semibold">Sponsored</span>
            <span className="text-zinc-400">Brand · Just now</span>
          </div>
        </div>
        {primary ? (
          <p className="px-3 pb-2 text-[12px] leading-snug whitespace-pre-line">{primary}</p>
        ) : null}
        <div className="mx-3 mt-1 aspect-[4/5] w-[calc(100%-1.5rem)] rounded-md bg-gradient-to-br from-fuchsia-700 via-violet-700 to-indigo-700" />
        <div className="mt-auto bg-zinc-900 px-3 pt-2 pb-3">
          {description ? <p className="text-[10px] uppercase tracking-wide text-zinc-400">{description}</p> : null}
          {headline ? <p className="text-[13px] font-semibold leading-tight">{headline}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#181826,#272745,#0e0e1a)]" />
      <div className="relative z-10 mt-auto w-[70%] px-3 pb-12">
        <p className="text-[12px] font-semibold leading-tight">@brand</p>
        {caption ? (
          <p className="mt-1 text-[11px] leading-snug whitespace-pre-line">{caption}</p>
        ) : null}
      </div>
    </div>
  );
}
