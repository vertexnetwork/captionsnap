"use client";

import { useCurrentPlacement, useSimulator } from "./SimulatorProvider";
import { counterState, graphemeLength } from "@/lib/truncate";
import type { CounterState } from "@/lib/truncate";
import { cn } from "@/lib/cn";

const COUNTER_COLORS: Record<CounterState, string> = {
  green: "text-accent",
  yellow: "text-warning",
  red: "text-danger",
};

// Hard ceiling so paste-bombs don't blow URL size budgets even when a placement's max is huge.
const HARD_INPUT_CEILING = 4000;

export function CopyInputs() {
  const placement = useCurrentPlacement();
  const { state, setField } = useSimulator();

  return (
    <div className="flex flex-col gap-4">
      {placement.fields.map((field) => {
        const value = state.fields[field.id] ?? "";
        const len = graphemeLength(value);
        const cs = counterState(value, field);
        const id = `field-${field.id}`;
        const counterId = `${id}-count`;
        const inputCeiling = Math.min(field.max, HARD_INPUT_CEILING);
        const isOverCut = len > field.truncateAt;
        const onChange = (v: string) => {
          // Defensive cap: never write more than the per-field max into state.
          // We let the user see the warning all the way up to max but never blow URL budgets.
          if (graphemeLength(v) > inputCeiling) return;
          setField(field.id, v);
        };
        return (
          <div key={field.id} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <label htmlFor={id} className="text-sm font-medium text-foreground">
                {field.label}
              </label>
              <span
                id={counterId}
                className={cn("text-xs tabular-nums font-medium", COUNTER_COLORS[cs])}
                aria-live="polite"
              >
                {len}/{field.max} · clips at {field.truncateAt}
                {isOverCut ? " · clipped" : ""}
              </span>
            </div>
            {field.multiline ? (
              <textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
                maxLength={inputCeiling * 4 /* allow surrogate pairs; grapheme cap above is the real guard */}
                aria-describedby={counterId}
                aria-invalid={cs === "red"}
                className="w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-sm leading-relaxed focus:border-accent focus:outline-none"
                placeholder={`Type your ${field.label.toLowerCase()}…`}
              />
            ) : (
              <input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                maxLength={inputCeiling * 4}
                aria-describedby={counterId}
                aria-invalid={cs === "red"}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-accent focus:outline-none"
                placeholder={`Type your ${field.label.toLowerCase()}…`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
