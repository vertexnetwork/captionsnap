"use client";

import { RotateCcw } from "lucide-react";
import { useSimulator } from "./SimulatorProvider";

export function ResetButton() {
  const { reset } = useSimulator();
  return (
    <button
      type="button"
      onClick={reset}
      className="btn-base border border-border bg-card text-sm font-medium text-muted hover:border-border-strong hover:text-foreground"
    >
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      Reset
    </button>
  );
}
