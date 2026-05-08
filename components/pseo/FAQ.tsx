import { JsonLd } from "@/components/seo/JsonLd";

export type FAQItem = { q: string; a: string };

export function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="my-8 space-y-3">
      <h2 className="text-xl font-semibold">FAQ</h2>
      <dl className="divide-y divide-border/60 rounded-lg border border-border bg-card">
        {items.map((it) => (
          <div key={it.q} className="px-4 py-3">
            <dt className="font-medium text-foreground">{it.q}</dt>
            <dd className="mt-1 text-sm text-muted">{it.a}</dd>
          </div>
        ))}
      </dl>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }}
      />
    </div>
  );
}
