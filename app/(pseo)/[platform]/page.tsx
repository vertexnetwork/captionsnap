import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbListJsonLd } from "@/components/seo/BreadcrumbList";
import { PSEO_INDEX, type PseoCategory } from "@/data/pseo-index";

type RouteParams = { platform: string };

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";

// Hub-and-spoke cornerstones. Each category had 99 orphan spokes and no
// relevance sink; these are the pages link equity now concentrates into.
const CATEGORY_META: Record<
  PseoCategory,
  { label: string; title: string; description: string; intro: string }
> = {
  meta: {
    label: "Meta",
    title: "Meta Ad Character Limits — Every Placement (2026)",
    description:
      "Every Meta ad character limit and safe zone for 2026: Facebook Feed, Instagram Feed, Reels, Stories, WhatsApp, Messenger and more. Verified against live placements.",
    intro:
      "Meta has more truncation surfaces than any other platform — the same primary text clips at a different point in Feed, Reels, Stories, and Messenger. Every page below is verified against paid impressions on real devices, not the Ads Manager preview, which lies.",
  },
  tiktok: {
    label: "TikTok",
    title: "TikTok Ad Character Limits & Safe Zones (2026)",
    description:
      "Every TikTok ad character limit and UI safe zone for 2026: In-Feed, Spark Ads, TopView, Shop Ads and more. Where the side rail and CTA overlay cover your hook.",
    intro:
      "TikTok's constraint is rarely the character count — it's the UI furniture. The side rail, username, and CTA overlay cover the lower-right and bottom of every video. These pages map exactly what is hidden, per format.",
  },
  linkedin: {
    label: "LinkedIn",
    title: "LinkedIn Ad Character Limits (2026)",
    description:
      "Every LinkedIn ad character limit for 2026: Single Image, Video, Carousel, Document, Conversation and Message ads — with the see-more truncation point for each.",
    intro:
      "LinkedIn truncates introductory text early and unforgivingly on a professional feed. These pages give the exact see-more cutoff per ad format.",
  },
  x: {
    label: "X",
    title: "X (Twitter) Ad Character Limits (2026)",
    description:
      "Every X ad character limit for 2026: Promoted Posts, Vertical Video, and Amplify pre-roll — with the in-timeline truncation point for each.",
    intro:
      "X promoted copy lives or dies in the timeline's tight visible window. These pages give the verified 2026 limits per ad format.",
  },
  youtube: {
    label: "YouTube",
    title: "YouTube Ad Character Limits & Safe Zones (2026)",
    description:
      "Every YouTube ad character limit and safe zone for 2026: skippable in-stream, bumper, Shorts, in-feed video, and masthead.",
    intro:
      "YouTube's text limits are short and its overlay furniture (skip button, CTA, channel chrome) is aggressive. These pages map the visible window per format.",
  },
  pinterest: {
    label: "Pinterest",
    title: "Pinterest Ad Character Limits — Every Format (2026)",
    description:
      "Every Pinterest character limit for 2026: pin title (100 / ~40 visible), description (800 / ~50 visible), and the Standard, Video, Carousel and Idea ad formats.",
    intro:
      "Pinterest is a visual search engine, not a social feed. The title and description are matching fields — the upload form quotes the maximum, but only the first ~40 (title) and ~50 (description) characters render in the mobile feed. These pages give the spec and the strategy for every format.",
  },
  reddit: {
    label: "Reddit",
    title: "Reddit Ad Character Limits (2026)",
    description:
      "Every Reddit ad character limit for 2026: Promoted Post, Conversation, and Free-form ads — with the in-feed truncation point for each.",
    intro:
      "Reddit ads must read as native posts. These pages give the verified 2026 character limits per ad format.",
  },
  snapchat: {
    label: "Snapchat",
    title: "Snapchat Ad Character Limits (2026)",
    description:
      "Every Snapchat ad character limit for 2026: Single Image/Video, Story, Spotlight, and Collection ads — with the safe-zone overlays for each.",
    intro:
      "Snapchat is full-screen and fast. Text that survives is short and clear of the swipe-up and attachment furniture. These pages map it per format.",
  },
  guides: {
    label: "Guides",
    title: "Ad Copy Truncation Guides — Strategy & Method",
    description:
      "Cross-platform guides on why ad copy gets truncated, how to test before launch, emoji character counting, RTL languages, and mobile-first copy strategy.",
    intro:
      "The strategy layer: why truncation happens, how to test for it before spend, and how to write copy that survives every platform's visible window.",
  },
  compare: {
    label: "Comparisons",
    title: "Cross-Platform Ad Character Limit Comparisons (2026)",
    description:
      "Side-by-side ad character limit comparisons across platforms: Meta vs TikTok, LinkedIn vs Meta, Pinterest vs Instagram, and more — for repurposing one creative.",
    intro:
      "Repurposing one creative across platforms means designing for the tightest visible window among them. These pages put two placements side by side so you can write once and ship everywhere.",
  },
  glossary: {
    label: "Glossary",
    title: "Ad Copy & Truncation Glossary",
    description:
      "Plain definitions of the terms behind ad-copy truncation: safe zone, primary text, see-more cutoff, character limit, CTA truncation, 9:16, UTM character cost.",
    intro:
      "The vocabulary of ad-copy truncation, defined precisely. Each term links to the placements where it bites.",
  },
};

const CATEGORY_ORDER: PseoCategory[] = [
  "meta",
  "tiktok",
  "linkedin",
  "x",
  "youtube",
  "pinterest",
  "reddit",
  "snapchat",
  "compare",
  "guides",
  "glossary",
];

function isCategory(value: string): value is PseoCategory {
  return (CATEGORY_ORDER as string[]).includes(value);
}

export function generateStaticParams() {
  return CATEGORY_ORDER.map((platform) => ({ platform }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { platform } = await params;
  if (!isCategory(platform)) return {};
  const meta = CATEGORY_META[platform];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/${platform}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${platform}`,
    },
  };
}

export default async function CategoryHubPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { platform } = await params;
  if (!isCategory(platform)) notFound();
  const meta = CATEGORY_META[platform];
  const entries = PSEO_INDEX.filter((e) => e.category === platform);
  if (entries.length === 0) notFound();

  return (
    <>
      <SiteHeader />
      <article className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 px-4 py-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {meta.label}
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {meta.title}
          </h1>
          <p className="text-base text-muted">{meta.intro}</p>
        </header>

        <ul className="divide-y divide-border rounded-lg border border-border bg-card/40">
          {entries.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/${e.slug}`}
                className="flex flex-col gap-1 px-4 py-3 hover:bg-card"
              >
                <span className="font-semibold text-foreground">{e.title}</span>
                <span className="text-sm text-muted">{e.description}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-sm text-muted">
          Every limit on these pages is verified against paid impressions on
          real devices, then dated.{" "}
          <Link href="/" className="text-accent hover:underline">
            Open the live simulator
          </Link>{" "}
          to see exactly where your copy clips.
        </p>
      </article>
      <SiteFooter />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: meta.title,
          description: meta.description,
          url: `${BASE}/${platform}`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: entries.map((e, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `${BASE}/${e.slug}`,
              name: e.title,
            })),
          },
        }}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: meta.label, path: `/${platform}` },
        ]}
      />
    </>
  );
}
