"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useProContext } from "@/components/pro/ProProvider";
import { track } from "@/lib/analytics";

export function AccountDashboard() {
  const { status, isPro, email, expiresAt, installToken, clear } =
    useProContext();
  const [portalPending, setPortalPending] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [welcomeShown, setWelcomeShown] = useState(false);

  const [keyInput, setKeyInput] = useState("");
  const [activating, setActivating] = useState(false);
  const [activateError, setActivateError] = useState<string | null>(null);
  const autoTried = useRef(false);

  const activate = useCallback(
    async (key: string) => {
      const trimmed = key.trim();
      if (!trimmed || activating) return;
      setActivating(true);
      setActivateError(null);
      try {
        const res = await fetch("/api/ls/activate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ key: trimmed }),
          credentials: "include",
        });
        const data = (await res.json()) as {
          active?: boolean;
          token?: string;
          error?: string;
        };
        if (!res.ok || !data.active || !data.token) {
          setActivateError(data.error ?? "activation_failed");
          setActivating(false);
          return;
        }
        await installToken(data.token);
        track("checkout_completed", { plan: "monthly" });
        setKeyInput("");
        setActivating(false);
      } catch {
        setActivateError("network_error");
        setActivating(false);
      }
    },
    [activating, installToken],
  );

  useEffect(() => {
    if (typeof window === "undefined" || autoTried.current) return;
    autoTried.current = true;
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");
    const welcome = params.get("welcome") === "1";
    if (welcome) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWelcomeShown(true);
    }
    if (key) {
      void activate(key);
    }
    if (key || welcome) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [activate]);

  async function openPortal() {
    if (portalPending) return;
    setPortalPending(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/ls/portal", { method: "POST" });
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
      {welcomeShown && !isPro ? (
        <div className="rounded-md border border-accent/60 bg-accent/10 px-4 py-3 text-sm text-foreground">
          <strong className="text-accent">Payment received.</strong> Your
          license key is on its way by email. Paste it below to unlock Pro on
          this device — it should arrive within a minute or two.
        </div>
      ) : null}

      {status === "loading" ? (
        <p className="text-sm text-muted">Checking subscription…</p>
      ) : isPro ? (
        <ProActiveCard email={email} expiresAt={expiresAt} />
      ) : (
        <ProInactiveCard />
      )}

      {!isPro ? (
        <section className="rounded-xl border border-border bg-card/40 p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Activate with your license key
          </h2>
          <p className="mt-1 text-xs text-muted">
            From your purchase email. Activating binds Pro to this device; your
            key works on a limited number of devices.
          </p>
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void activate(keyInput);
            }}
          >
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
              className="min-h-[44px] flex-1 rounded-md border border-border bg-background px-3 font-mono text-sm text-foreground outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={activating || keyInput.trim().length === 0}
              className="btn-base bg-accent text-sm text-black hover:opacity-90 disabled:opacity-50"
            >
              {activating ? "Activating…" : "Activate Pro"}
            </button>
          </form>
          {activateError ? (
            <p className="mt-3 text-xs text-danger" role="alert">
              {activateError.includes("limit")
                ? "This key has hit its device limit. Deactivate an old device from the customer portal, or email hello@captionsnap.io."
                : activateError === "network_error"
                  ? "Network error. Try again."
                  : "Could not activate that key. Check it matches your purchase email exactly, or email hello@captionsnap.io."}
            </p>
          ) : null}
        </section>
      ) : null}

      {isPro ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openPortal}
            disabled={portalPending}
            className="btn-base bg-accent text-sm text-black hover:opacity-90 disabled:opacity-50"
          >
            {portalPending ? "Opening portal…" : "Manage subscription"}
          </button>
          <button
            type="button"
            onClick={clear}
            className="btn-base border border-border text-sm text-muted hover:border-border-strong hover:text-foreground"
          >
            Sign out on this device
          </button>
        </div>
      ) : null}

      {portalError ? (
        <p className="text-xs text-danger" role="alert">
          {portalError === "no_customer"
            ? "No active license on this device. Activate your key above first."
            : "Could not open the billing portal. Try again or email hello@captionsnap.io."}
        </p>
      ) : null}

      <section className="rounded-md border border-border/60 bg-card/40 px-4 py-3 text-xs text-muted">
        <p className="font-semibold text-foreground">New device, or lost access?</p>
        <p className="mt-1">
          Re-enter your license key above on any device — it works until it hits
          its activation limit. Lost the key? Email{" "}
          <a className="underline hover:text-accent" href="mailto:hello@captionsnap.io">
            hello@captionsnap.io
          </a>{" "}
          from your purchase address — typical response under 2 business days.
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
    <section className="rounded-xl border border-accent/40 bg-card/60 p-6 ring-1 ring-accent/20">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-accent">Pro — Active</h2>
        {expiry ? (
          <span className="text-xs text-muted">
            Re-checks LemonSqueezy{" "}
            {expiry.toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        ) : null}
      </div>
      {email ? (
        <p className="mt-2 text-sm text-muted">Billed to {email}</p>
      ) : null}
      <ul className="mt-4 space-y-1.5 text-sm text-foreground">
        <li>
          · Bulk paste at{" "}
          <Link className="text-accent hover:underline" href="/bulk">
            /bulk
          </Link>{" "}
          — 10 headlines × every placement of a platform
        </li>
        <li>· PNG export at 2x resolution from any simulator preview</li>
        <li>· Priority spec re-verification on platform UI changes</li>
      </ul>
    </section>
  );
}

function ProInactiveCard() {
  return (
    <section className="rounded-xl border border-border bg-card/40 p-6">
      <h2 className="text-lg font-semibold">No active subscription</h2>
      <p className="mt-2 text-sm text-muted">
        You&apos;re using the free single-placement simulator. Pro adds bulk
        paste, PNG export, and priority spec re-verification for performance
        marketers and small agencies running campaigns weekly.
      </p>
      <Link
        href="/pricing"
        className="btn-base mt-4 bg-accent text-sm text-black hover:opacity-90"
      >
        Upgrade to Pro — $49/mo →
      </Link>
    </section>
  );
}
