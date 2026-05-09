import { JsonLd } from "@/components/seo/JsonLd";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";

export type BreadcrumbItem = {
  name: string;
  /** Absolute or site-relative path. Optional — items without a URL are rendered
   *  as label-only entries (allowed by schema.org). */
  path?: string;
};

export function BreadcrumbListJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: it.name,
          ...(it.path
            ? { item: it.path.startsWith("http") ? it.path : `${SITE}${it.path}` }
            : {}),
        })),
      }}
    />
  );
}
