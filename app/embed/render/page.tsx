import type { Metadata } from "next";
import Link from "next/link";
import { SimulatorProvider } from "@/components/simulator/SimulatorProvider";
import { Simulator } from "@/components/simulator/Simulator";
import { decodeOrDefault } from "@/lib/share";

export const metadata: Metadata = {
  title: "Embedded simulator",
  robots: { index: false, follow: false },
};

export default async function EmbedRenderPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const params = await searchParams;
  const initialState = decodeOrDefault(params.s ?? null);

  return (
    <div className="relative min-h-screen bg-background p-3" data-embed="true">
      <SimulatorProvider initialState={initialState}>
        <Simulator embedded />
      </SimulatorProvider>
      <Link
        href={`https://captionsnap.io/?s=${params.s ?? ""}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-2 right-3 text-[11px] text-muted hover:text-accent"
      >
        Powered by CaptionSnap →
      </Link>
    </div>
  );
}
