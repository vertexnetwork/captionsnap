import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
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
    template: "%s · CaptionSnap",
  },
  description:
    "Paste your ad copy and instantly see character-limit violations and UI safe-zone collisions across Meta and TikTok placements.",
  applicationName: "CaptionSnap",
  authors: [{ name: "CaptionSnap" }],
  keywords: [
    "ad copy",
    "character limits",
    "Meta ads",
    "TikTok ads",
    "safe zones",
    "media buying",
    "PPC",
  ],
  openGraph: {
    type: "website",
    siteName: "CaptionSnap",
    url: SITE_URL,
    title: "CaptionSnap — Stop ad copy from getting truncated",
    description:
      "Paste your ad copy and instantly see character-limit violations and UI safe-zone collisions across Meta and TikTok placements.",
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
        {children}
        <Analytics />
        {clarityId ? (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
