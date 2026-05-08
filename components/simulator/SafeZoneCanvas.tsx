"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrentPlacement, useSimulator } from "./SimulatorProvider";
import { truncatePlacement } from "@/lib/truncate";
import { cn } from "@/lib/cn";
import { MetaFeedSurface } from "./surfaces/MetaFeedSurface";
import { MetaStoriesSurface } from "./surfaces/MetaStoriesSurface";
import { MetaReelsSurface } from "./surfaces/MetaReelsSurface";
import { MetaMessengerSurface } from "./surfaces/MetaMessengerSurface";
import { TikTokForYouSurface } from "./surfaces/TikTokForYouSurface";
import { TikTokTopViewSurface } from "./surfaces/TikTokTopViewSurface";
import { TikTokBrandedEffectSurface } from "./surfaces/TikTokBrandedEffectSurface";
import type { Placement } from "@/lib/platform-specs";
import type { TruncateResult } from "@/lib/truncate";
import type { FieldId } from "@/lib/platform-specs";

function renderSurface(
  placement: Placement,
  truncated: Partial<Record<FieldId, TruncateResult>>,
) {
  if (placement.platform === "meta") {
    if (placement.surface === "stories")
      return <MetaStoriesSurface placement={placement} truncated={truncated} />;
    if (placement.surface === "reels")
      return <MetaReelsSurface placement={placement} truncated={truncated} />;
    if (placement.surface === "messenger")
      return <MetaMessengerSurface placement={placement} truncated={truncated} />;
    return <MetaFeedSurface placement={placement} truncated={truncated} />;
  }
  if (placement.platform === "tiktok") {
    if (placement.surface === "topview")
      return <TikTokTopViewSurface placement={placement} truncated={truncated} />;
    if (placement.surface === "branded-effect")
      return <TikTokBrandedEffectSurface placement={placement} truncated={truncated} />;
    return <TikTokForYouSurface placement={placement} truncated={truncated} />;
  }
  return <MetaFeedSurface placement={placement} truncated={truncated} />;
}

// Pre-compute a sensible default scale for SSR/initial render so the phone
// doesn't visibly jump once the ResizeObserver fires post-hydration.
function initialScale(placement: Placement): number {
  return Math.min(720 / placement.device.h, 1);
}

export function SafeZoneCanvas({ embedded = false }: { embedded?: boolean }) {
  const placement = useCurrentPlacement();
  const { state } = useSimulator();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(() => initialScale(placement));

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const targetW = placement.device.w;
      const targetH = placement.device.h;
      const s = Math.min(w / targetW, h / targetH, 1);
      setScale(s);
    };
    update();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
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
          {renderSurface(placement, truncated)}
          {/* Notch */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-32 -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}
