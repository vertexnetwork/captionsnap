import type { Metadata } from "next";
import Link from "next/link";
import { SubscribeButtons } from "@/components/pro/SubscribeButtons";
import { PricingViewedBeacon } from "@/components/pro/PricingViewedBeacon";

export const metadata: Metadata = {
  title: "Pricing — CaptionSnap Pro",
  description:
    "$49/mo or $499/yr (15% off). Bulk-preview 10 headlines × all placements, export simulator output as PNG, and remove ads. Cancel anytime via Stripe.",
  alternates: { canonical: "/pricing" },
};

const features: { name: string; free: boolean; pro: boolean }[] = [
  { name: "Single-placement simulator", free: true, pro: true },
  { name: "All 8 platforms / 55 placements", free: true, pro: true },
  { name: "Share via URL (no signup)", free: true, pro: true },
  { name: "Iframe embed for blogs / agency sites", free: true, pro: true },
  { name: "Chrome extension popup", free: true, pro: true },
  { name: "Bulk paste — 10 headlines × all placements", free: false, pro: true },
  { name: "Export simulator output as PNG", free: false, pro: true },
  { name: "Ad-free experience", free: false, pro: true },
  { name: "Priority spec re-verification", free: false, pro: true },
];

export default function PricingPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <PricingViewedBeacon />
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Stop wasting ad spend on <span className="text-accent glow">truncated copy</span>.
        </h1>
        <p className="mt-3 text-base text-muted">
          $49/mo or $499/yr (save 15%). Cancel anytime via Stripe — no questions, no
          retention call. Built for agencies and in-house paid-social teams running
          campaigns across multiple platforms.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-card/40 p-6">
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="mt-1 text-sm text-muted">For solo marketers and one-off checks.</p>
          <p className="mt-4 text-3xl font-bold">$0</p>
          <p className="text-xs text-muted">forever</p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-md border border-border/60 px-4 py-2 text-sm hover:border-accent"
          >
            Use the free simulator →
          </Link>
        </div>

        <div className="rounded-lg border border-accent/60 bg-card/60 p-6 shadow-[0_0_0_1px_rgba(0,255,163,0.08)]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-accent">Pro</h2>
            <span className="text-xs uppercase tracking-wide text-accent">Recommended</span>
          </div>
          <p className="mt-1 text-sm text-muted">
            For agencies and paid-social teams. Save more in ad-spend than the cost
            in the first week.
          </p>
          <p className="mt-4 text-3xl font-bold">
            $49<span className="text-base font-normal text-muted">/mo</span>
          </p>
          <p className="text-xs text-muted">or $499/yr (15% off)</p>
          <div className="mt-5">
            <SubscribeButtons />
          </div>
          <p className="mt-3 text-xs text-muted">
            Cancel anytime via Stripe Customer Portal. No retention call.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">What&apos;s included</h2>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-card/60 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 text-left">Feature</th>
                <th className="px-4 py-3 text-center">Free</th>
                <th className="px-4 py-3 text-center text-accent">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {features.map((f) => (
                <tr key={f.name}>
                  <td className="px-4 py-3">{f.name}</td>
                  <td className="px-4 py-3 text-center">
                    {f.free ? <span className="text-accent">✓</span> : <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {f.pro ? <span className="text-accent">✓</span> : <span className="text-muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 rounded-lg border border-border/60 bg-card/40 p-6">
        <h2 className="text-lg font-semibold">No accounts. Stripe is the database.</h2>
        <p className="mt-2 text-sm text-muted">
          You don&apos;t create a CaptionSnap account. Subscribing issues an HMAC-signed
          license token tied to your Stripe customer ID. Manage everything — cards,
          invoices, cancellations — through the standard Stripe Customer Portal.
        </p>
        <p className="mt-2 text-sm text-muted">
          Lost access on a new device? Visit <Link className="underline hover:text-accent" href="/account">/account</Link>{" "}
          and your subscription auto-recovers via a long-lived signed cookie. If both
          cookie and localStorage are cleared, email{" "}
          <a className="underline hover:text-accent" href="mailto:hello@captionsnap.io">
            hello@captionsnap.io
          </a>{" "}
          with your Stripe receipt.
        </p>
      </section>
    </article>
  );
}
