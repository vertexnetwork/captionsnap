"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { PLACEMENTS, getPlacement } from "@/lib/platform-specs";
import { encode } from "@/lib/share";
import type { SimulatorState } from "@/lib/share";
import { track } from "@/lib/analytics";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";

export function EmbedSnippetBuilder() {
  const [placementId, setPlacementId] = useState(PLACEMENTS[0].id);
  const placement = getPlacement(placementId)!;
  const [primary, setPrimary] = useState("Stop guessing where your ad copy gets clipped.");
  const [headline, setHeadline] = useState("See exactly where your ad clips");
  const [caption, setCaption] = useState("Tap to see the truncation preview live →");
  const [copied, setCopied] = useState(false);

  const state: SimulatorState = useMemo(
    () => ({
      v: 1,
      placementId,
      fields: { primary, headline, caption },
    }),
    [placementId, primary, headline, caption],
  );

  const encoded = encode(state);
  const src = `${SITE}/embed/render?s=${encoded}`;
  const snippet = `<iframe src="${src}" width="100%" height="640" style="border:0;border-radius:12px;max-width:880px" loading="lazy" title="CaptionSnap simulator"></iframe>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      track("embed_snippet_copied", { placementId });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Placement preset</span>
          <select
            value={placementId}
            onChange={(e) => setPlacementId(e.target.value)}
            className="rounded-md border border-border bg-card px-3 py-2"
          >
            {PLACEMENTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        {placement.fields.find((f) => f.id === "primary") ? (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Primary text</span>
            <textarea
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              rows={3}
              className="rounded-md border border-border bg-card px-3 py-2"
            />
          </label>
        ) : null}
        {placement.fields.find((f) => f.id === "headline") ? (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Headline</span>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="rounded-md border border-border bg-card px-3 py-2"
            />
          </label>
        ) : null}
        {placement.fields.find((f) => f.id === "caption") ? (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Caption</span>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="rounded-md border border-border bg-card px-3 py-2"
            />
          </label>
        ) : null}

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Snippet</span>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black"
              type="button"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-snug text-muted">
            <code>{snippet}</code>
          </pre>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">Live preview</span>
        <iframe
          src={src}
          title="CaptionSnap embedded preview"
          className="h-[640px] w-full rounded-xl border border-border bg-card"
        />
      </div>
    </div>
  );
}
