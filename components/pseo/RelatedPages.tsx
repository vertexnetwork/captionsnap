import Link from "next/link";
import { getPseoEntry } from "@/data/pseo-index";

export function RelatedPages({ slugs }: { slugs: string[] }) {
  const entries = slugs.map(getPseoEntry).filter(Boolean);
  if (entries.length === 0) return null;
  return (
    <aside className="my-8 rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Related</h2>
      <ul className="mt-3 space-y-2">
        {entries.map((e) => (
          <li key={e!.slug}>
            <Link href={`/${e!.slug}`} className="text-foreground hover:text-accent">
              {e!.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
