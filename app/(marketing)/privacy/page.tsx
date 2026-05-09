import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CaptionSnap handles data. We don't collect personally identifiable information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: 2026-05-09 (Pro-only revenue; advertising program retired)</p>
      <h2>What we collect</h2>
      <p>
        CaptionSnap does not require a CaptionSnap account, does not store your
        ad copy, and does not write your copy to any database. Share-link state
        is encoded into the URL itself — when you copy a share link, your ad copy
        travels in the URL and is not stored on our servers.
      </p>
      <h2>Pro subscribers (Stripe)</h2>
      <p>
        Pro subscriptions are processed by Stripe. We never see your card. Stripe
        provides us with your billing email and customer ID; we sign that
        customer ID into a long-lived HTTP-only cookie so you can manage your
        subscription on return visits without a login. We do not store your
        billing email or customer ID in any database — Stripe is the source of
        truth, the cookie is the only thing on our side.
      </p>
      <p>
        Cancel, update payment method, view invoices: all handled by the standard
        Stripe Customer Portal.
      </p>
      <h2>Analytics</h2>
      <p>
        We use Vercel Analytics for aggregate traffic counts (pageviews, top
        pages, referrers). Vercel Analytics does not use cookies and does not
        collect PII.
      </p>
      <p>
        We use Microsoft Clarity for anonymized session-replay analysis. Clarity
        may set first-party cookies, and is loaded only after you accept cookies
        in the consent banner. You can also opt out via the Clarity opt-out page.
      </p>
      <h2>Cookies</h2>
      <p>
        First-party cookies we set:
      </p>
      <ul>
        <li>
          <code>cs_cid</code> — long-lived (1 year), HTTP-only, signed.
          Identifies a Pro subscriber&apos;s Stripe customer ID for self-service
          subscription management. Set only after a successful Stripe checkout.
        </li>
        <li>
          <code>captionsnap-consent-v1</code> — local-storage only (not a cookie),
          stores your accept/decline choice for the cookie banner.
        </li>
        <li>
          <code>captionsnap-license-v1</code> — local-storage only, stores the
          short-lived (24h) HMAC-signed license token granting Pro access on this
          device.
        </li>
      </ul>
      <p>
        Third-party cookies may be set by Microsoft Clarity (after you accept
        the cookie banner).
      </p>
      <h2>Data subject rights</h2>
      <p>
        We don&apos;t store user data on our side. To request deletion of your
        Stripe customer record, contact Stripe directly or email us at{" "}
        <a href="mailto:hello@captionsnap.io" className="underline hover:text-accent">
          hello@captionsnap.io
        </a>{" "}
        and we&apos;ll initiate the deletion via the Stripe API.
      </p>
    </article>
  );
}
