import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbListJsonLd } from "@/components/seo/BreadcrumbList";
import { LastVerifiedBadge } from "@/components/simulator/LastVerifiedBadge";
import { getPseoEntry, pseoSlugs, type PseoCategory } from "@/data/pseo-index";
import { getPlacement } from "@/lib/platform-specs";
import { encode } from "@/lib/share";
import { loadPseoMdx } from "@/content/pseo/load";

type RouteParams = { platform: string; slug: string };

const CATEGORY_LABEL: Record<PseoCategory, string> = {
  meta: "Meta",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  pinterest: "Pinterest",
  reddit: "Reddit",
  snapchat: "Snapchat",
  guides: "Guides",
  compare: "Comparisons",
  glossary: "Glossary",
};

export async function generateStaticParams() {
  return pseoSlugs().map((s) => {
    const [platform, slug] = s.split("/");
    return { platform, slug };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { platform, slug } = await params;
  const entry = getPseoEntry(`${platform}/${slug}`);
  if (!entry) return {};
  const ogState = encode({ v: 1, placementId: entry.placementId, fields: entry.presetCopy ?? {} });
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: `/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: `/${entry.slug}`,
      images: [{ url: `/api/og?s=${ogState}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function PseoPage({ params }: { params: Promise<RouteParams> }) {
  const { platform, slug } = await params;
  const fullSlug = `${platform}/${slug}`;
  const entry = getPseoEntry(fullSlug);
  if (!entry) notFound();
  const placement = getPlacement(entry.placementId);
  if (!placement) notFound();

  const Mdx = await loadPseoMdx(fullSlug);
  if (!Mdx) notFound();

  return (
    <>
      <SiteHeader />
      <article className="mx-auto flex max-w-3xl flex-1 flex-col gap-4 px-4 py-12">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {entry.category}
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{entry.title}</h1>
          <p className="text-base text-muted">{entry.description}</p>
          <LastVerifiedBadge date={placement.lastVerified} sourceUrl={placement.sourceUrl} />
        </header>
        <div className="prose prose-invert max-w-none [&_p]:leading-relaxed [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:font-semibold [&_a]:text-accent">
          <Mdx />
        </div>
      </article>
      <SiteFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: entry.description,
          datePublished: entry.publishedAt,
          dateModified: placement.lastVerified,
          author: { "@type": "Organization", name: "CaptionSnap" },
          publisher: {
            "@type": "Organization",
            name: "CaptionSnap",
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io",
          },
          mainEntityOfPage: `/${entry.slug}`,
        }}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: CATEGORY_LABEL[entry.category] },
          { name: entry.title, path: `/${entry.slug}` },
        ]}
      />
    </>
  );
}
