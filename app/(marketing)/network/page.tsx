import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "The Vertex Network",
  description:
    "CaptionSnap is part of the Vertex Network — focused tools for solo operators and small teams running e-commerce stores and paid-social campaigns. ShopiFont for Shopify typography, EtsyMargin for real Etsy profit, CaptionSnap for ad-copy truncation across 8 platforms.",
  alternates: { canonical: "/network" },
};

type Property = {
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  audience: string;
  current?: boolean;
};

const PROPERTIES: Property[] = [
  {
    name: "CaptionSnap",
    domain: "captionsnap.io",
    url: "https://captionsnap.io",
    tagline: "Stop ad copy from getting truncated.",
    description:
      "Free ad-copy simulator covering 8 platforms and 55 placements. Paste your copy, see exactly where each platform clips it and which UI overlays cover your hook.",
    audience: "Performance marketers · paid-social managers · small agencies",
    current: true,
  },
  {
    name: "ShopiFont",
    domain: "shopifont.app",
    url: "https://shopifont.app",
    tagline: "Pair-tested typography for Shopify storefronts.",
    description:
      "Pick header / body font combinations proven against conversion data instead of guessing. Live-preview against real product pages and copy a Shopify theme snippet in one click.",
    audience: "Shopify store owners · DTC operators · small e-commerce teams",
  },
  {
    name: "EtsyMargin",
    domain: "etsymargin.tools",
    url: "https://etsymargin.tools",
    tagline: "Real-margin calculator for Etsy sellers.",
    description:
      "Etsy fees, ad spend, materials, shipping, taxes — see what you actually keep per listing. No login, no scraping; the URL is the database so your numbers move with the link.",
    audience: "Etsy sellers · handmade-goods operators · small e-commerce teams",
  },
];

export default function NetworkPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          The Vertex Network
        </p>
        <h1 className="mt-3 text-[length:var(--text-h1)] font-bold leading-[1.05] tracking-tight sm:text-[length:var(--text-display)]">
          Operator tools for the people who actually ship.
        </h1>
        <p className="mt-5 text-base text-muted">
          The Vertex Network is a small group of focused utilities for solo
          operators and small teams running e-commerce stores and paid-social
          campaigns. Each tool is single-purpose, free to start, and built
          against the same principles: no accounts where one isn&apos;t needed,
          no upsell to a demo, no surprises in the URL bar.
        </p>
      </header>

      <section className="mt-10 grid gap-4">
        {PROPERTIES.map((p) => (
          <article
            key={p.domain}
            className="group rounded-xl border border-border bg-card/40 p-6 transition-colors hover:border-border-strong sm:p-7"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-xl font-semibold text-foreground">{p.name}</h2>
                <span className="text-xs text-muted">{p.domain}</span>
                {p.current ? (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                    You&apos;re here
                  </span>
                ) : null}
              </div>
              {p.current ? (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground"
                >
                  Open simulator
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ) : (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  Visit {p.domain}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
            <p className="mt-3 text-base font-medium text-foreground">{p.tagline}</p>
            <p className="mt-2 text-sm text-muted">{p.description}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-muted">
              For {p.audience}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-xl border border-border bg-card/30 p-6 sm:p-7">
        <h2 className="text-lg font-semibold">What ties them together</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            <span className="text-foreground">·</span> Single-purpose. Every
            tool solves one boring, expensive problem — not a suite of features.
          </li>
          <li>
            <span className="text-foreground">·</span> Free to start. Paid
            tiers exist where the work scales (bulk paste, export, advanced
            configurations). No demo, no retention call.
          </li>
          <li>
            <span className="text-foreground">·</span> URL-first state. Wherever
            possible, the share-link is the database. Nothing about your work
            is stored on our servers.
          </li>
          <li>
            <span className="text-foreground">·</span> Authentic data. Specs,
            fees, and limits are re-verified against the live source — not
            scraped, not approximated.
          </li>
        </ul>
      </section>

      <p className="mt-10 text-sm text-muted">
        Have a tool that fits the network?{" "}
        <a
          href="mailto:hello@captionsnap.io?subject=Vertex+Network+inquiry"
          className="text-accent hover:underline"
        >
          hello@captionsnap.io
        </a>
        .
      </p>
    </article>
  );
}
