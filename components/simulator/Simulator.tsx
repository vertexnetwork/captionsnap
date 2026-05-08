"use client";

import { useEffect } from "react";
import { PlatformPicker } from "./PlatformPicker";
import { PlacementPicker } from "./PlacementPicker";
import { CopyInputs } from "./CopyInputs";
import { SafeZoneCanvas } from "./SafeZoneCanvas";
import { ShareLinkButton } from "./ShareLinkButton";
import { LastVerifiedBadge } from "./LastVerifiedBadge";
import { useCurrentPlacement, useSimulator } from "./SimulatorProvider";
import { encode } from "@/lib/share";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Props = { embedded?: boolean };

export function Simulator({ embedded = false }: Props) {
  const placement = useCurrentPlacement();
  const { state } = useSimulator();

  useEffect(() => {
    if (!embedded) return;
    if (typeof window === "undefined") return;
    const post = () => {
      window.parent?.postMessage(
        {
          type: "captionsnap:state-change",
          state,
          encoded: encode(state),
        },
        "*",
      );
    };
    post();
    const sendResize = () => {
      const h = document.documentElement.scrollHeight;
      window.parent?.postMessage({ type: "captionsnap:resize", height: h }, "*");
    };
    sendResize();
    const ro = new ResizeObserver(sendResize);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [state, embedded]);

  useEffect(() => {
    track("simulator_run", { placementId: placement.id });
  }, [placement.id]);

  return (
    <section
      className={cn(
        "grid gap-6",
        embedded ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 lg:grid-cols-2",
      )}
      data-testid="simulator-root"
      data-placement-id={placement.id}
    >
      <div className="flex flex-col gap-4 order-2 lg:order-1">
        <div className="flex flex-wrap items-center gap-3">
          <PlatformPicker />
          <LastVerifiedBadge date={placement.lastVerified} sourceUrl={placement.sourceUrl} />
        </div>
        <PlacementPicker />
        <CopyInputs />
        {!embedded ? (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <ShareLinkButton />
            <span className="text-xs text-muted">URL is the database. No signup, ever.</span>
          </div>
        ) : null}
      </div>
      <div className="order-1 lg:order-2">
        <SafeZoneCanvas embedded={embedded} />
      </div>
    </section>
  );
}
