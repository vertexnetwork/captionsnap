"use client";

import { useMemo, useState } from "react";

const PRO_MONTHLY = 49;
const ASSUMED_TRUNCATION_RATE = 0.04; // ~1 in 25 creatives ship with a truncation issue.

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function RoiEstimator() {
  const [spend, setSpend] = useState(10000);
  const recovered = useMemo(() => spend * ASSUMED_TRUNCATION_RATE, [spend]);
  const payback = recovered / PRO_MONTHLY;

  return (
    <div className="mt-4 grid gap-6 rounded-xl border border-border bg-card/40 p-6 sm:grid-cols-[1fr_1.2fr]">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">
          Monthly ad spend
        </span>
        <span className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
            $
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={500}
            value={spend}
            onChange={(e) => setSpend(Math.max(0, Number(e.target.value) || 0))}
            className="min-h-11 w-full rounded-md border border-border bg-card pl-6 pr-3 text-base tabular-nums focus:border-border-strong focus:outline-none"
            aria-label="Monthly ad spend in USD"
          />
        </span>
        <span className="text-xs text-muted">
          We assume ~4% of creatives ship with a hook clipped or covered by UI
          chrome — calibrated against agency QA logs.
        </span>
      </label>

      <div className="flex flex-col justify-center gap-2 rounded-lg border border-accent/30 bg-card/60 p-5">
        <p className="text-xs uppercase tracking-wide text-muted">
          Spend recovered if Pro catches it
        </p>
        <p className="text-3xl font-bold tabular-nums text-foreground">
          {fmt(recovered)}<span className="text-base font-normal text-muted">/mo</span>
        </p>
        <p className="text-sm text-muted">
          Pro pays for itself{" "}
          <span className="font-semibold text-accent tabular-nums">
            {payback >= 100 ? "100×+" : `${payback.toFixed(1)}×`}
          </span>{" "}
          over at $49/mo.
        </p>
      </div>
    </div>
  );
}
