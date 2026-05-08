"use client";

import { RotateCcw } from "lucide-react";
import { useSimulator } from "./SimulatorProvider";

export function ResetButton() {
  const { reset } = useSimulator();
  return (
    <button
      type="button"
      onClick={reset}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-muted hover:text-foreground hover:border-foreground/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
      Reset
    </button>
  );
}
