import type { Metadata } from "next";
import changelog from "@/content/changelog.json";

type ChangelogEntry = { date: string; title: string };

const REPO_URL = (process.env.NEXT_PUBLIC_GITHUB_REPO_URL ?? "").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Dated record of CaptionSnap updates and spec re-verifications. Full release notes live on GitHub.",
  alternates: { canonical: "/changelog" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ChangelogPage() {
  const entries = changelog as ChangelogEntry[];
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Changelog</h1>
          <p className="mt-2 text-sm text-muted">
            What changed and when. Dates + titles only — full release notes live on GitHub.
          </p>
        </div>
        {REPO_URL ? (
          <a
            href={`${REPO_URL}/releases`}
            target="_blank"
            rel="noopener"
            className="text-sm text-accent hover:underline"
          >
            Full release notes on GitHub →
          </a>
        ) : null}
      </header>

      {entries.length === 0 ? (
        <p className="text-sm text-muted">No entries yet.</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {entries.map((e, i) => (
            <li
              key={`${e.date}-${i}`}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3"
            >
              <time
                className="shrink-0 font-mono text-xs uppercase tracking-wide text-muted"
                dateTime={e.date}
              >
                {formatDate(e.date)}
              </time>
              <span className="text-sm text-foreground">{e.title}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
