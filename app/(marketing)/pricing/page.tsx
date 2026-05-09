import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { SubscribeButtons } from "@/components/pro/SubscribeButtons";
import { PricingViewedBeacon } from "@/components/pro/PricingViewedBeacon";
import { RoiEstimator } from "@/components/pro/RoiEstimator";

export const metadata: Metadata = {
  title: "Pricing — CaptionSnap Pro",
  description:
    "Pro at $49/mo or $499/yr (save 15%). Bulk paste 10 headlines × every placement, export simulator output as PNG, and get priority spec re-verification. Built for performance marketers and small agencies. Cancel anytime via Stripe.",
  alternates: { canonical: "/pricing" },
};

const features: { name: string; free: boolean; pro: boolean }[] = [
  { name: "Single-placement simulator", free: true, pro: true },
  { name: "8 platforms · 55 placements", free: true, pro: true },
  { name: "Share via URL (no signup)", free: true, pro: true },
  { name: "Iframe embed for blogs / agency sites", free: true, pro: true },
  { name: "Chrome extension popup", free: true, pro: true },
  { name: "Bulk paste — 10 headlines × every placement", free: false, pro: true },
  { name: "Export simulator output as PNG (2x resolution)", free: false, pro: true },
  { name: "Priority spec re-verification", free: false, pro: true },
];

export default function PricingPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12">
      <PricingViewedBeacon />
      <header className="mb-10 max-w-2xl">
        <h1 className="text-[length:var(--text-h1)] font-bold leading-[1.05] tracking-tight sm:text-[length:var(--text-display)]">
          Stop wasting ad spend on{" "}
          <span className="text-accent">truncated copy</span>.
        </h1>
        <p className="mt-5 text-base text-muted">
          One clipped headline on a $5K Meta campaign is roughly $200 in wasted
          impressions. Catch it before launch and Pro pays for itself this month.
        </p>
        <p className="mt-3 text-sm text-muted">
          $49/mo or $499/yr (save 15%). Cancel anytime via the Stripe Customer
          Portal — no questions, no retention call, no demo to sit through. Built
          for performance marketers, paid-social managers, and small agencies
          running campaigns across Meta, TikTok, LinkedIn, X, YouTube, Pinterest,
          Reddit, and Snapchat.
        </p>
      </header>

      {/* Trust object first — answers the most common pre-purchase question. */}
      <section className="mb-10 rounded-xl border border-border bg-card/40 p-6">
        <h2 className="text-lg font-semibold">No accounts. Stripe is the database.</h2>
        <p className="mt-2 text-sm text-muted">
          You don&apos;t create a CaptionSnap account. Subscribing issues an
          HMAC-signed license token tied to your Stripe customer ID. We never see
          your card. Cards, invoices, cancellations all live in the standard
          Stripe Customer Portal.
        </p>
        <p className="mt-2 text-sm text-muted">
          Lost access on a new device? Visit{" "}
          <Link className="text-accent hover:underline" href="/account">/account</Link>{" "}
          and your subscription auto-recovers via a long-lived signed cookie. If
          both cookie and localStorage are cleared, email{" "}
          <a className="text-accent hover:underline" href="mailto:hello@captionsnap.io">
            hello@captionsnap.io
          </a>{" "}
          with your Stripe receipt — typical response under 2 business days.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-xl border border-border bg-card/40 p-6">
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="mt-1 text-sm text-muted">
            Solo marketers running one-off audits and individual creative checks.
          </p>
          <p className="mt-5 text-3xl font-bold">$0</p>
          <p className="text-xs text-muted">forever, no signup</p>
          <Link
            href="/"
            className="btn-base mt-5 border border-border text-sm hover:border-border-strong hover:text-accent"
          >
            Use the free simulator →
          </Link>
        </div>

        <div className="rounded-xl border border-accent/60 bg-card/70 p-7 ring-1 ring-accent/30 sm:p-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-accent">Pro</h2>
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
              Recommended
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Agencies and in-house teams shipping 10+ creatives a week across
            multiple platforms.
          </p>
          <p className="mt-5 text-4xl font-bold">
            $49<span className="text-base font-normal text-muted">/mo</span>
          </p>
          <p className="text-xs text-muted">or $499/yr (save 15%)</p>
          <div className="mt-5">
            <SubscribeButtons />
          </div>
          <p className="mt-3 text-xs text-muted">
            Cancel anytime via the Stripe Customer Portal. No retention call.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Will Pro pay for itself?</h2>
        <p className="mt-1 text-sm text-muted">
          Estimate the ad spend recovered when CaptionSnap catches one
          truncated hook before launch.
        </p>
        <RoiEstimator />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">What&apos;s included</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-card text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 text-left">Feature</th>
                <th className="px-4 py-3 text-center">Free</th>
                <th className="px-4 py-3 text-center text-accent">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {features.map((f) => (
                <tr key={f.name}>
                  <td className="px-4 py-3 text-foreground">{f.name}</td>
                  <td className="px-4 py-3 text-center">
                    {f.free ? (
                      <Check className="mx-auto h-4 w-4 text-accent" aria-label="Included" />
                    ) : (
                      <span className="text-border-strong" aria-label="Not included">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {f.pro ? (
                      <Check className="mx-auto h-4 w-4 text-accent" aria-label="Included" />
                    ) : (
                      <span className="text-border-strong" aria-label="Not included">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
