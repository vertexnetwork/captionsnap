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
import { LinkedInFeedSurface } from "./surfaces/LinkedInFeedSurface";
import { LinkedInMessageSurface } from "./surfaces/LinkedInMessageSurface";
import { XTimelineSurface } from "./surfaces/XTimelineSurface";
import { XVerticalVideoSurface } from "./surfaces/XVerticalVideoSurface";
import { YouTubeShortsSurface } from "./surfaces/YouTubeShortsSurface";
import { YouTubeInStreamSurface } from "./surfaces/YouTubeInStreamSurface";
import { YouTubeDiscoverySurface } from "./surfaces/YouTubeDiscoverySurface";
import { PinterestPinSurface } from "./surfaces/PinterestPinSurface";
import { PinterestIdeaSurface } from "./surfaces/PinterestIdeaSurface";
import { SnapchatStorySurface } from "./surfaces/SnapchatStorySurface";
import { SnapchatSpotlightSurface } from "./surfaces/SnapchatSpotlightSurface";
import { RedditPromotedPostSurface } from "./surfaces/RedditPromotedPostSurface";
import { RedditConversationSurface } from "./surfaces/RedditConversationSurface";
import type { Placement } from "@/lib/platform-specs";
import type { TruncateResult } from "@/lib/truncate";
import type { FieldId } from "@/lib/platform-specs";

function renderSurface(
  placement: Placement,
  truncated: Partial<Record<FieldId, TruncateResult>>,
) {
  const props = { placement, truncated };
  switch (placement.platform) {
    case "meta":
      if (placement.surface === "stories") return <MetaStoriesSurface {...props} />;
      if (placement.surface === "reels") return <MetaReelsSurface {...props} />;
      if (placement.surface === "messenger") return <MetaMessengerSurface {...props} />;
      return <MetaFeedSurface {...props} />;
    case "tiktok":
      if (placement.surface === "topview") return <TikTokTopViewSurface {...props} />;
      if (placement.surface === "branded-effect") return <TikTokBrandedEffectSurface {...props} />;
      return <TikTokForYouSurface {...props} />;
    case "linkedin":
      if (placement.surface === "message") return <LinkedInMessageSurface {...props} />;
      return <LinkedInFeedSurface {...props} />;
    case "x":
      if (placement.surface === "vertical-video") return <XVerticalVideoSurface {...props} />;
      return <XTimelineSurface {...props} />;
    case "youtube":
      if (placement.surface === "shorts") return <YouTubeShortsSurface {...props} />;
      if (placement.surface === "discovery" || placement.surface === "masthead")
        return <YouTubeDiscoverySurface {...props} />;
      return <YouTubeInStreamSurface {...props} />;
    case "pinterest":
      if (placement.surface === "idea") return <PinterestIdeaSurface {...props} />;
      return <PinterestPinSurface {...props} />;
    case "snapchat":
      if (placement.surface === "spotlight") return <SnapchatSpotlightSurface {...props} />;
      return <SnapchatStorySurface {...props} />;
    case "reddit":
      if (placement.surface === "conversation") return <RedditConversationSurface {...props} />;
      return <RedditPromotedPostSurface {...props} />;
  }
}

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
        <div className="relative h-full w-full overflow-hidden rounded-[42px] border border-border bg-black shadow-[0_0_45px_rgba(0,0,0,0.45)]">
          {renderSurface(placement, truncated)}
          {/* Notch */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-32 -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}
