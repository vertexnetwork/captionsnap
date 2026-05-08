import type { Metadata } from "next";
import Link from "next/link";
import { SimulatorProvider } from "@/components/simulator/SimulatorProvider";
import { Simulator } from "@/components/simulator/Simulator";
import { decode, DEFAULT_STATE } from "@/lib/share";

export const metadata: Metadata = {
  title: "Embedded simulator",
  robots: { index: false, follow: false },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";

export default async function EmbedRenderPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const params = await searchParams;
  const decoded = decode(params.s ?? null);
  const initialState = decoded ?? DEFAULT_STATE;
  const decodeFailed = Boolean(params.s) && decoded === null;
  const hasInitialShareLink = Boolean(params.s) && decoded !== null;
  const poweredHref = params.s ? `${SITE_URL}/?s=${params.s}` : `${SITE_URL}/`;

  return (
    <div className="relative min-h-screen bg-background p-3" data-embed="true">
      <SimulatorProvider
        initialState={initialState}
        decodeFailed={decodeFailed}
        hasInitialShareLink={hasInitialShareLink}
      >
        <Simulator embedded />
      </SimulatorProvider>
      <Link
        href={poweredHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-2 right-3 text-[11px] text-muted hover:text-accent"
      >
        Powered by CaptionSnap →
      </Link>
    </div>
  );
}
