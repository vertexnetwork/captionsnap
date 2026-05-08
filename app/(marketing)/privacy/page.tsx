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
      <p>Last updated: 2026-04-15</p>
      <h2>What we collect</h2>
      <p>
        CaptionSnap does not require an account, does not store your ad copy, and does
        not write to any database. Share-link state is encoded into the URL itself —
        when you copy a share link, your ad copy travels in the URL and is not stored on
        our servers.
      </p>
      <h2>Analytics</h2>
      <p>
        We use Vercel Analytics for aggregate traffic counts (pageviews, top pages,
        referrers). Vercel Analytics does not use cookies and does not collect PII.
      </p>
      <p>
        We use Microsoft Clarity for anonymized session-replay analysis. Clarity may set
        first-party cookies. You can opt out via the Clarity opt-out page.
      </p>
      <h2>Advertising</h2>
      <p>
        When MediaVine ads are enabled, MediaVine&apos;s ad partners may use cookies and
        local storage to serve relevant advertising. See MediaVine&apos;s privacy policy
        for full disclosure.
      </p>
      <h2>Cookies</h2>
      <p>
        We do not set any first-party cookies for authentication or personalization
        because there is no authentication or personalization. Third-party cookies may
        be set by Clarity and (when enabled) MediaVine.
      </p>
      <h2>Data subject rights</h2>
      <p>
        Because we don&apos;t store user data, there is nothing to export, delete, or
        correct. If you have questions, reach out at{" "}
        <a href="mailto:hello@captionsnap.io" className="underline hover:text-accent">
          hello@captionsnap.io
        </a>
        .
      </p>
    </article>
  );
}
