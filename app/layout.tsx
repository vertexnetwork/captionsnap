import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ConsentProvider, ClarityScript } from "@/components/consent/CookieConsent";
import { ProProvider } from "@/components/pro/ProProvider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://captionsnap.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CaptionSnap — Stop ad copy from getting truncated",
    template: "%s | CaptionSnap",
  },
  description:
    "Built for performance marketers and small agencies. Paste your ad copy, see exactly where every platform clips it and which UI overlays cover your hook — Meta, TikTok, LinkedIn, X, YouTube, Pinterest, Reddit, Snapchat. No signup. Pro at $49/mo for bulk paste + PNG export.",
  applicationName: "CaptionSnap",
  authors: [{ name: "CaptionSnap" }],
  keywords: [
    "ad copy",
    "character limits",
    "safe zones",
    "performance marketing",
    "paid social",
    "media buying",
    "PPC",
    "agency tools",
    "Meta ads",
    "TikTok ads",
    "LinkedIn ads",
    "X ads",
    "YouTube ads",
    "Pinterest ads",
    "Reddit ads",
    "Snapchat ads",
  ],
  openGraph: {
    type: "website",
    siteName: "CaptionSnap",
    url: SITE_URL,
    title: "CaptionSnap — Stop ad copy from getting truncated",
    description:
      "Paste your ad copy, see exactly where every major platform clips it and which UI overlays cover your hook. Built for performance marketers and small agencies.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@captionsnap",
    creator: "@captionsnap",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ConsentProvider>
          <ProProvider>
            {children}
            <Analytics />
            {clarityId ? <ClarityScript clarityId={clarityId} /> : null}
          </ProProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
