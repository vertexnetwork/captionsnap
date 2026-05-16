"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrentPlacement, useDeviceMode, useSimulator } from "./SimulatorProvider";
import { getDeviceVariant } from "@/lib/platform-specs";
import { truncatePlacement } from "@/lib/truncate";
import { cn } from "@/lib/cn";
import { MetaDesktopSurface } from "./surfaces/MetaDesktopSurface";
import { PinterestDesktopSurface } from "./surfaces/PinterestDesktopSurface";
import { TikTokDesktopSurface } from "./surfaces/TikTokDesktopSurface";
import { YouTubeDesktopSurface } from "./surfaces/YouTubeDesktopSurface";
import { XDesktopSurface } from "./surfaces/XDesktopSurface";
import { LinkedInDesktopSurface } from "./surfaces/LinkedInDesktopSurface";
import { RedditDesktopSurface } from "./surfaces/RedditDesktopSurface";
import { MobileOnlyState } from "./surfaces/MobileOnlyState";
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

function renderDesktopSurface(
  placement: Placement,
  truncated: Partial<Record<FieldId, TruncateResult>>,
) {
  const props = { placement, truncated };
  switch (placement.platform) {
    case "meta":
      return <MetaDesktopSurface {...props} />;
    case "pinterest":
      return <PinterestDesktopSurface {...props} />;
    case "tiktok":
      return <TikTokDesktopSurface {...props} />;
    case "youtube":
      return <YouTubeDesktopSurface {...props} />;
    case "x":
      return <XDesktopSurface {...props} />;
    case "linkedin":
      return <LinkedInDesktopSurface {...props} />;
    case "reddit":
      return <RedditDesktopSurface {...props} />;
    // A platform only reaches here when it has a `desktop` variant in
    // platform-specs.ts; otherwise the canvas shows the mobile-only state.
    // Remaining platforms get their desktop surface as the rebuild scales out.
    default:
      return <MetaDesktopSurface {...props} />;
  }
}

export function SafeZoneCanvas({ embedded = false }: { embedded?: boolean }) {
  const placement = useCurrentPlacement();
  const { state } = useSimulator();
  const [device] = useDeviceMode();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const variant = getDeviceVariant(placement, device);
  // Box to fit. Fall back to the mobile box for the mobile-only message so the
  // empty-state panel keeps a sensible aspect.
  const boxW = variant?.w ?? placement.device.w;
  const boxH = variant?.h ?? placement.device.h;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const s = Math.min(w / boxW, h / boxH, 1);
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
  }, [boxW, boxH]);

  const truncated = truncatePlacement(state.fields, placement);
  const isDesktop = device === "desktop";
  const mobileOnly = isDesktop && variant === null;

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative w-full",
        embedded ? "h-[640px]" : "h-[640px] sm:h-[720px]",
      )}
      data-testid="safe-zone-canvas"
      data-device={device}
    >
      <div
        className="absolute left-1/2 top-1/2 origin-center"
        style={{
          width: boxW,
          height: boxH,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {mobileOnly ? (
          <MobileOnlyState label={placement.label} />
        ) : isDesktop ? (
          <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-black shadow-[0_0_45px_rgba(0,0,0,0.45)]">
            {renderDesktopSurface(placement, truncated)}
          </div>
        ) : (
          <div className="relative h-full w-full overflow-hidden rounded-[42px] border border-border bg-black shadow-[0_0_45px_rgba(0,0,0,0.45)]">
            {renderSurface(placement, truncated)}
            {/* Notch */}
            <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-32 -translate-x-1/2 rounded-full bg-black" />
          </div>
        )}
      </div>
    </div>
  );
}
