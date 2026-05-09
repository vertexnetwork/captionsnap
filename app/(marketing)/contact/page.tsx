import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the CaptionSnap team — report a spec drift, request a placement, ask about embedding, or partner with us.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-invert">
      <h1>Contact</h1>
      <p>
        The fastest way to reach us is email — we read every message and
        typically reply within <strong>2 business days</strong>. No demo, no
        sales call, no ticketing system.
      </p>

      <h2>Email</h2>
      <p>
        <a href="mailto:hello@captionsnap.io" className="underline hover:text-accent">
          hello@captionsnap.io
        </a>
      </p>

      <h2>What to send</h2>
      <ul>
        <li>
          <strong>Spec error or drift</strong> — tell us the placement, the field
          (e.g., primary text, headline), and what you saw versus what the
          simulator shows. A screenshot of the live placement is gold.
        </li>
        <li>
          <strong>Missing placement or platform</strong> — name it, give a public
          link to the platform&apos;s ad-format documentation if available, and
          why it matters to your team.
        </li>
        <li>
          <strong>Embed support</strong> — if the iframe embed isn&apos;t rendering
          on your site, paste the URL and a description of what you see.
        </li>
        <li>
          <strong>Press, podcasts, partnerships</strong> — same email. We respond
          to everything that isn&apos;t a cold outreach template.
        </li>
      </ul>

      <h2>What not to send</h2>
      <ul>
        <li>
          Account or password resets — there are no accounts. The simulator is
          stateless and share links are URL-encoded. See{" "}
          <Link href="/privacy">Privacy</Link>.
        </li>
        <li>
          Customer-data requests — we don&apos;t collect or store user data.
        </li>
        <li>
          Refund requests — the simulator is free and ad-supported.
        </li>
      </ul>

      <h2>Response time</h2>
      <p>
        Standard: 2 business days. If you&apos;re a Pro subscriber or have hit a
        blocking embed bug on a production site, mark the subject line with{" "}
        <code>[urgent]</code> and we&apos;ll bump priority — typical response
        under 24 hours.
      </p>
    </article>
  );
}
