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
        return (
          <div key={field.id} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <label htmlFor={id} className="text-sm font-medium text-foreground">
                {field.label}
              </label>
              <span className={cn("text-xs tabular-nums font-medium", COUNTER_COLORS[cs])}>
                {len}/{field.max} · cuts at {field.truncateAt}
              </span>
            </div>
            {field.multiline ? (
              <textarea
                id={id}
                value={value}
                onChange={(e) => setField(field.id, e.target.value)}
                rows={4}
                className="w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-sm leading-relaxed focus:border-accent focus:outline-none"
                placeholder={`Type your ${field.label.toLowerCase()}…`}
              />
            ) : (
              <input
                id={id}
                value={value}
                onChange={(e) => setField(field.id, e.target.value)}
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
