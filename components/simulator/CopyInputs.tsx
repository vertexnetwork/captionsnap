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

const COUNTER_RAIL: Record<CounterState, string> = {
  green: "bg-accent",
  yellow: "bg-warning",
  red: "bg-danger",
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
          <div key={field.id} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor={id} className="text-sm font-medium text-foreground">
                {field.label}
              </label>
              <span
                id={counterId}
                className={cn(
                  "text-[length:var(--text-counter)] tabular-nums font-semibold",
                  COUNTER_COLORS[cs],
                )}
                aria-live="polite"
              >
                {len}/{field.max}
                <span className="ml-2 text-xs font-normal text-muted">
                  clips at {field.truncateAt}
                  {isOverCut ? " · clipped" : ""}
                </span>
              </span>
            </div>
            <div className="relative">
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute left-0 top-0 h-full w-0.5 rounded-l-md transition-colors",
                  COUNTER_RAIL[cs],
                )}
              />
              {field.multiline ? (
                <textarea
                  id={id}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  rows={4}
                  maxLength={inputCeiling * 4 /* allow surrogate pairs; grapheme cap above is the real guard */}
                  aria-describedby={counterId}
                  aria-invalid={cs === "red"}
                  className="w-full resize-y rounded-md border border-border bg-card px-3 py-2.5 pl-3.5 text-sm leading-relaxed focus:border-border-strong focus:outline-none"
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
                  className="w-full rounded-md border border-border bg-card px-3 py-2.5 pl-3.5 text-sm focus:border-border-strong focus:outline-none"
                  placeholder={`Type your ${field.label.toLowerCase()}…`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
