import { Smartphone } from "lucide-react";

/** Shown when desktop view is requested for a placement that has no real
 *  desktop ad rendering (Stories, Reels, vertical video, …). We deliberately
 *  do NOT fabricate a desktop frame for surfaces that don't exist on web. */
export function MobileOnlyState({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 text-center">
      <Smartphone className="h-8 w-8 text-muted" aria-hidden />
      <p className="text-sm font-semibold text-foreground">
        {label} is a mobile-only placement
      </p>
      <p className="max-w-xs text-xs text-muted">
        This ad surface has no desktop/web rendering — it only serves on the
        mobile app. Switch back to <strong>Mobile</strong> to preview it.
      </p>
    </div>
  );
}
