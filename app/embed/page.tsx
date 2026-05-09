import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { EmbedSnippetBuilder } from "./EmbedSnippetBuilder";

export const metadata: Metadata = {
  title: "Embed CaptionSnap on your site",
  description:
    "Generate a copy-paste iframe snippet that embeds the CaptionSnap simulator on your blog, agency client portal, or internal creative docs. Free, no signup.",
  alternates: { canonical: "/embed" },
};

export default function EmbedPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Embed the simulator</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Drop CaptionSnap into your blog, agency client portal, or internal
          creative docs. Paste the snippet, set a preset placement, and your
          readers get a live truncation preview without leaving your page —
          free, no signup required from them or you.
        </p>
        <EmbedSnippetBuilder />
      </main>
      <SiteFooter />
    </>
  );
}
