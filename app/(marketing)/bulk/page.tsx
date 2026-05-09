import type { Metadata } from "next";
import { BulkPageContent } from "@/components/bulk/BulkPageContent";

export const metadata: Metadata = {
  title: "Bulk Preview — 10 Headlines × Every Placement",
  description:
    "Paste up to 10 headlines, pick a platform, see how each one truncates across every placement. Pro feature for agencies validating creative across a campaign.",
  alternates: { canonical: "/bulk" },
};

export default function BulkPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Bulk preview — <span className="text-accent">10 headlines × every placement</span>
        </h1>
        <p className="mt-3 text-base text-muted">
          Paste up to 10 headlines, pick a platform, see how each one truncates
          across every placement. Built for agencies validating creative across a
          campaign.
        </p>
      </header>
      <BulkPageContent />
    </article>
  );
}
