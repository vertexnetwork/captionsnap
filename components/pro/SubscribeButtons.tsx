"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type Plan = "monthly" | "annual";

export function SubscribeButtons() {
  const [pending, setPending] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enabled = process.env.NEXT_PUBLIC_PRO_ENABLED === "true";

  async function startCheckout(plan: Plan) {
    if (!enabled || pending) return;
    setError(null);
    setPending(plan);
    track("checkout_started", { plan });
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "checkout_failed");
        setPending(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("network_error");
      setPending(null);
    }
  }

  if (!enabled) {
    return (
      <div className="rounded-md border border-border/60 bg-card/40 px-4 py-3 text-sm text-muted">
        Pro tier is not yet live. Check back shortly, or email{" "}
        <a className="underline hover:text-accent" href="mailto:hello@captionsnap.io">
          hello@captionsnap.io
        </a>{" "}
        to be notified at launch.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => startCheckout("monthly")}
        disabled={pending !== null}
        className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
      >
        {pending === "monthly" ? "Redirecting…" : "Subscribe — $49/mo"}
      </button>
      <button
        type="button"
        onClick={() => startCheckout("annual")}
        disabled={pending !== null}
        className="rounded-md border border-accent/60 bg-card px-5 py-3 text-sm font-semibold text-accent hover:bg-accent/10 disabled:opacity-50"
      >
        {pending === "annual" ? "Redirecting…" : "Annual — $499/yr (save 15%)"}
      </button>
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error === "pro_disabled"
            ? "Pro tier is currently disabled."
            : error === "price_not_configured"
              ? "Pricing not configured — please email hello@captionsnap.io."
              : "Could not start checkout. Try again or email hello@captionsnap.io."}
        </p>
      ) : null}
    </div>
  );
}
