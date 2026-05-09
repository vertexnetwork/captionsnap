"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProContext } from "@/components/pro/ProProvider";
import { track } from "@/lib/analytics";

export function AccountDashboard() {
  const { status, isPro, email, expiresAt, refresh, clear } = useProContext();
  const [portalPending, setPortalPending] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [welcomeShown, setWelcomeShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("welcome") === "1") {
      // SSR cannot read URL search params — we must hydrate this on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWelcomeShown(true);
      // Refresh ProProvider to pick up the cookie + mint a token.
      void refresh();
      // Fire conversion event once.
      track("checkout_completed", { plan: "monthly" });
      // Strip the query param so refresh doesn't re-fire.
      const clean = window.location.pathname;
      window.history.replaceState({}, "", clean);
    }
  }, [refresh]);

  async function openPortal() {
    if (portalPending) return;
    setPortalPending(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setPortalError(data.error ?? "portal_failed");
        setPortalPending(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setPortalError("network_error");
      setPortalPending(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      {welcomeShown && isPro ? (
        <div className="rounded-md border border-accent/60 bg-accent/10 px-4 py-3 text-sm text-foreground">
          <strong className="text-accent">Welcome to Pro.</strong> Your subscription
          is active. Bulk paste, PNG export, and ad-free browsing are unlocked on
          this device.
        </div>
      ) : null}

      {status === "loading" ? (
        <p className="text-sm text-muted">Checking subscription…</p>
      ) : isPro ? (
        <ProActiveCard email={email} expiresAt={expiresAt} />
      ) : (
        <ProInactiveCard />
      )}

      {isPro ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openPortal}
            disabled={portalPending}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
          >
            {portalPending ? "Opening Stripe…" : "Manage subscription"}
          </button>
          <button
            type="button"
            onClick={clear}
            className="rounded-md border border-border/60 px-4 py-2 text-sm text-muted hover:text-foreground"
          >
            Sign out on this device
          </button>
        </div>
      ) : null}

      {portalError ? (
        <p className="text-xs text-danger" role="alert">
          {portalError === "no_customer"
            ? "No customer cookie found on this device. Email hello@captionsnap.io with your Stripe receipt for recovery."
            : "Could not open Stripe portal. Try again or email hello@captionsnap.io."}
        </p>
      ) : null}

      <section className="rounded-md border border-border/60 bg-card/40 px-4 py-3 text-xs text-muted">
        <p className="font-semibold text-foreground">Lost access?</p>
        <p className="mt-1">
          Cookie + localStorage on this browser cleared? Email{" "}
          <a className="underline hover:text-accent" href="mailto:hello@captionsnap.io">
            hello@captionsnap.io
          </a>{" "}
          with your Stripe receipt and we&apos;ll re-issue the customer cookie.
          Standard response time: 2 business days.
        </p>
      </section>
    </div>
  );
}

function ProActiveCard({
  email,
  expiresAt,
}: {
  email: string | undefined;
  expiresAt: number | null;
}) {
  const expiry = expiresAt ? new Date(expiresAt * 1000) : null;
  return (
    <section className="rounded-lg border border-accent/40 bg-card/60 p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-accent">Pro — Active</h2>
        {expiry ? (
          <span className="text-xs text-muted">
            Token refreshes {expiry.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
          </span>
        ) : null}
      </div>
      {email ? (
        <p className="mt-2 text-sm text-muted">Billed to {email}</p>
      ) : null}
      <ul className="mt-4 space-y-1 text-sm text-foreground">
        <li>· Bulk paste at <Link className="underline hover:text-accent" href="/bulk">/bulk</Link></li>
        <li>· PNG export from any simulator preview</li>
        <li>· Ad-free pSEO + simulator pages</li>
      </ul>
    </section>
  );
}

function ProInactiveCard() {
  return (
    <section className="rounded-lg border border-border/60 bg-card/40 p-5">
      <h2 className="text-lg font-semibold">No active subscription</h2>
      <p className="mt-2 text-sm text-muted">
        You&apos;re using the free simulator. Upgrade to Pro for bulk preview,
        PNG export, and an ad-free experience.
      </p>
      <Link
        href="/pricing"
        className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
      >
        See pricing →
      </Link>
    </section>
  );
}
