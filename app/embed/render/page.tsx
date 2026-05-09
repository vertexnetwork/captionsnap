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
        className="fixed bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur hover:border-accent hover:text-accent"
      >
        <svg viewBox="0 0 32 32" width="14" height="14" aria-hidden="true">
          <path
            d="M22 6 H10 a4 4 0 0 0 -4 4 v12 a4 4 0 0 0 4 4 h12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
          />
          <circle cx="16" cy="16" r="1.4" fill="currentColor" />
          <circle cx="20" cy="16" r="1.4" fill="currentColor" />
          <circle cx="24" cy="16" r="1.4" fill="currentColor" />
        </svg>
        <span>Powered by CaptionSnap</span>
      </Link>
    </div>
  );
}
