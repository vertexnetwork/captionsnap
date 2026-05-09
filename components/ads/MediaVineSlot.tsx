"use client";

import { cn } from "@/lib/cn";
import { useIsPro } from "@/components/pro/ProProvider";

// Placement-aware ads invariant:
//   - This component is rendered ONLY on pSEO long-tail content pages
//     (app/(pseo)/[platform]/[slug]/page.tsx).
//   - It is NEVER rendered on conversion surfaces: home (/), share links,
//     /embed, /embed/render, /about, /contact, /extension, /pricing,
//     /account, /bulk. If you find yourself adding a new <MediaVineSlot>,
//     reconsider — the marginal $5–15 RPM is not worth the conversion drag.
//
// SUNSET: when Pro MRR > $5K/mo, remove this component's call sites entirely
// and announce "we just removed all ads." Keep the file for ~30 days then
// delete. Track Pro MRR via the Stripe dashboard.

type Props = {
  id: string;
  className?: string;
  label?: string;
};

export function MediaVineSlot({ id, className, label }: Props) {
  const isPro = useIsPro();
  if (isPro) return null;
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") {
    return null;
  }
  return (
    <div
      data-mediavine-slot={id}
      aria-label={label ?? "Advertisement"}
      className={cn(
        "min-h-[90px] w-full rounded-md border border-border/40 bg-card/30 text-xs text-muted",
        className,
      )}
    >
      <span className="sr-only">Advertisement</span>
    </div>
  );
}
