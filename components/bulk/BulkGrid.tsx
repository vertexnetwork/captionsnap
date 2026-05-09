"use client";

import { useMemo } from "react";
import {
  PLACEMENTS,
  type Placement,
  type Platform,
} from "@/lib/platform-specs";
import { counterState, truncateField } from "@/lib/truncate";
import { cn } from "@/lib/cn";

const PLATFORM_ORDER: Platform[] = [
  "meta",
  "tiktok",
  "linkedin",
  "x",
  "youtube",
  "pinterest",
  "reddit",
  "snapchat",
];

const PLATFORM_LABEL: Record<Platform, string> = {
  meta: "Meta",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  pinterest: "Pinterest",
  reddit: "Reddit",
  snapchat: "Snapchat",
};

export function BulkGrid({
  platform,
  setPlatform,
  lines,
  setLines,
}: {
  platform: Platform;
  setPlatform: (p: Platform) => void;
  lines: string[];
  setLines: (lines: string[]) => void;
}) {
  const placements = useMemo(
    () => PLACEMENTS.filter((p) => p.platform === platform),
    [platform],
  );

  function updateText(value: string) {
    const next = value.split("\n").slice(0, 10);
    setLines(next);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-wide text-muted">
          Platform
        </label>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_ORDER.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPlatform(p)}
              className={cn(
                "btn-pill border text-sm",
                platform === p
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:text-foreground hover:border-border-strong",
              )}
            >
              {PLATFORM_LABEL[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="bulk-input"
            className="text-xs uppercase tracking-wide text-muted"
          >
            Headlines (one per line, max 10)
          </label>
          <span className="text-xs text-muted">
            {lines.filter((l) => l.length > 0).length}/10
          </span>
        </div>
        <textarea
          id="bulk-input"
          rows={10}
          value={lines.join("\n")}
          onChange={(e) => updateText(e.target.value)}
          placeholder={"Headline 1\nHeadline 2\nHeadline 3"}
          className="w-full rounded-md border border-border bg-card/60 p-3 font-mono text-sm focus:border-border-strong focus:outline-none"
        />
      </div>

      <ResultsTable lines={lines} placements={placements} />
    </div>
  );
}

function ResultsTable({
  lines,
  placements,
}: {
  lines: string[];
  placements: Placement[];
}) {
  const filtered = lines.filter((l) => l.length > 0);
  if (filtered.length === 0) {
    return (
      <p className="text-sm text-muted">
        Paste up to 10 headlines above to see truncation across every{" "}
        {placements[0]?.platform ?? "platform"} placement.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full text-sm">
        <thead className="bg-card text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="sticky left-0 z-10 bg-card px-3 py-3 text-left">
              Headline
            </th>
            {placements.map((p) => (
              <th key={p.id} className="px-3 py-3 text-left">
                {p.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {filtered.map((line, idx) => {
            const rowBg = idx % 2 === 0 ? "bg-card/30" : "bg-card/10";
            return (
              <tr key={idx} className={rowBg}>
                <td
                  className={cn(
                    "sticky left-0 z-10 max-w-[240px] truncate px-3 py-3 align-top text-foreground",
                    rowBg,
                  )}
                >
                  {line}
                </td>
                {placements.map((p) => {
                  const headlineField = p.fields.find(
                    (f) => f.id === "headline",
                  ) ?? p.fields[0];
                  if (!headlineField) {
                    return (
                      <td key={p.id} className="px-3 py-3 align-top text-muted">
                        —
                      </td>
                    );
                  }
                  const state = counterState(line, headlineField);
                  const result = truncateField(line, headlineField, p.platform);
                  const len = Array.from(line).length;
                  return (
                    <td key={p.id} className="px-3 py-3 align-top">
                      <div
                        className={cn(
                          "text-[length:var(--text-counter)] font-semibold tabular-nums",
                          state === "green"
                            ? "text-accent"
                            : state === "yellow"
                              ? "text-warning"
                              : "text-danger",
                        )}
                      >
                        {len}/{headlineField.truncateAt}
                      </div>
                      <div className="mt-1 text-xs text-muted line-clamp-2">
                        {result.isTruncated ? (
                          <>
                            <span className="text-foreground">
                              {result.display.replace(result.ellipsis, "")}
                            </span>
                            <span className="text-danger">{result.ellipsis}</span>
                          </>
                        ) : (
                          <span className="text-foreground">{line}</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
