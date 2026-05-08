"use client";

import { useState } from "react";
import { AlertTriangle, Info, X } from "lucide-react";
import { useSimulator } from "./SimulatorProvider";

export function SimulatorStatusBanner() {
  const { decodeFailed, shareLinkStale } = useSimulator();
  const [decodeDismissed, setDecodeDismissed] = useState(false);
  const [staleDismissed, setStaleDismissed] = useState(false);

  const showDecode = decodeFailed && !decodeDismissed;
  const showStale = shareLinkStale && !staleDismissed;
  if (!showDecode && !showStale) return null;

  return (
    <div className="flex flex-col gap-2" role="status" aria-live="polite">
      {showDecode ? (
        <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="flex-1">
            That share link couldn&apos;t be decoded — showing the default preset instead.
          </p>
          <button
            type="button"
            onClick={() => setDecodeDismissed(true)}
            aria-label="Dismiss"
            className="rounded p-0.5 text-warning/80 hover:text-warning"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
      {showStale ? (
        <div className="flex items-start gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="flex-1">
            You&apos;ve edited the copy — re-copy the share link to capture your changes.
          </p>
          <button
            type="button"
            onClick={() => setStaleDismissed(true)}
            aria-label="Dismiss"
            className="rounded p-0.5 text-muted/80 hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
