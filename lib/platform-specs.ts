export type Platform = "meta" | "tiktok";

export type FieldId = "primary" | "headline" | "description" | "caption";

export type SpecField = {
  id: FieldId;
  label: string;
  max: number;
  truncateAt: number;
  warnAt?: number;
  multiline?: boolean;
};

export type SafeZone = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  reason: string;
};

export type Placement = {
  id: string;
  platform: Platform;
  label: string;
  surface: string;
  fields: SpecField[];
  safeZones: SafeZone[];
  device: { w: number; h: number };
  lastVerified: string;
  sourceUrl: string;
};

export const PLACEMENTS: Placement[] = [
  // ──────────────────────────── META ────────────────────────────
  {
    id: "meta-facebook-feed",
    platform: "meta",
    label: "Facebook Feed",
    surface: "feed",
    fields: [
      { id: "primary", label: "Primary text", max: 500, truncateAt: 125, warnAt: 110, multiline: true },
      { id: "headline", label: "Headline", max: 255, truncateAt: 40, warnAt: 27 },
      { id: "description", label: "Description", max: 200, truncateAt: 30, warnAt: 27 },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 9, reason: "Profile + sponsored label" },
      { id: "cta", x: 0, y: 80, w: 100, h: 12, reason: "CTA button + headline strip" },
      { id: "reaction-bar", x: 0, y: 92, w: 100, h: 8, reason: "Like, comment, share row" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide",
  },
  {
    id: "meta-facebook-carousel",
    platform: "meta",
    label: "Facebook Carousel",
    surface: "feed",
    fields: [
      { id: "primary", label: "Primary text", max: 500, truncateAt: 125, warnAt: 110, multiline: true },
      { id: "headline", label: "Headline", max: 255, truncateAt: 40, warnAt: 27 },
      { id: "description", label: "Description", max: 200, truncateAt: 20, warnAt: 18 },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 9, reason: "Profile + sponsored label" },
      { id: "carousel-arrows", x: 88, y: 35, w: 12, h: 30, reason: "Carousel scroll arrows" },
      { id: "cta", x: 0, y: 78, w: 100, h: 14, reason: "Per-card headline + CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide/carousel",
  },
  {
    id: "meta-facebook-reels",
    platform: "meta",
    label: "Facebook Reels",
    surface: "reels",
    fields: [
      { id: "primary", label: "Primary text", max: 500, truncateAt: 72, warnAt: 60, multiline: true },
      { id: "headline", label: "Headline", max: 100, truncateAt: 10, warnAt: 8 },
    ],
    safeZones: [
      { id: "top-icons", x: 0, y: 0, w: 100, h: 8, reason: "Reels header icons" },
      { id: "right-rail", x: 86, y: 30, w: 14, h: 50, reason: "Like / comment / share / audio" },
      { id: "bottom-username", x: 0, y: 78, w: 70, h: 14, reason: "Username + caption stack" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Bottom CTA strip" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide/video/facebook-reels",
  },
  {
    id: "meta-facebook-marketplace",
    platform: "meta",
    label: "Facebook Marketplace",
    surface: "marketplace",
    fields: [
      { id: "primary", label: "Primary text", max: 500, truncateAt: 125, warnAt: 110, multiline: true },
      { id: "headline", label: "Headline", max: 255, truncateAt: 40, warnAt: 30 },
      { id: "description", label: "Description", max: 200, truncateAt: 30, warnAt: 27 },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 9, reason: "Marketplace search + nav" },
      { id: "price", x: 0, y: 78, w: 60, h: 6, reason: "Price + listing meta" },
      { id: "cta", x: 0, y: 86, w: 100, h: 12, reason: "Send message / save buttons" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide/marketplace",
  },
  {
    id: "meta-instagram-feed",
    platform: "meta",
    label: "Instagram Feed",
    surface: "feed",
    fields: [
      { id: "primary", label: "Primary text", max: 2200, truncateAt: 125, warnAt: 110, multiline: true },
      { id: "headline", label: "Headline", max: 255, truncateAt: 40, warnAt: 27 },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 8, reason: "Username + sponsored label" },
      { id: "action-row", x: 0, y: 76, w: 100, h: 6, reason: "Like / comment / share row" },
      { id: "cta", x: 0, y: 82, w: 100, h: 12, reason: "Caption + CTA stack" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide/instagram-feed",
  },
  {
    id: "meta-instagram-stories",
    platform: "meta",
    label: "Instagram Stories",
    surface: "stories",
    fields: [
      { id: "primary", label: "Primary text", max: 125, truncateAt: 90, warnAt: 80, multiline: true },
      { id: "headline", label: "Headline", max: 40, truncateAt: 40, warnAt: 30 },
    ],
    safeZones: [
      { id: "top-progress", x: 0, y: 0, w: 100, h: 14, reason: "Progress bar + profile" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Sticker / swipe-up CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide/instagram-stories",
  },
  {
    id: "meta-instagram-reels",
    platform: "meta",
    label: "Instagram Reels",
    surface: "reels",
    fields: [
      { id: "primary", label: "Primary text", max: 2200, truncateAt: 72, warnAt: 60, multiline: true },
      { id: "headline", label: "Headline", max: 100, truncateAt: 10, warnAt: 8 },
    ],
    safeZones: [
      { id: "top-icons", x: 0, y: 0, w: 100, h: 8, reason: "Reels camera + Instagram nav" },
      { id: "right-rail", x: 86, y: 30, w: 14, h: 50, reason: "Like / comment / share / send / audio" },
      { id: "bottom-username", x: 0, y: 78, w: 70, h: 14, reason: "Username + caption" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Sponsored CTA strip" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide/instagram-reels",
  },
  {
    id: "meta-instagram-explore",
    platform: "meta",
    label: "Instagram Explore",
    surface: "explore",
    fields: [
      { id: "primary", label: "Primary text", max: 2200, truncateAt: 125, warnAt: 110, multiline: true },
      { id: "headline", label: "Headline", max: 255, truncateAt: 40, warnAt: 27 },
    ],
    safeZones: [
      { id: "explore-header", x: 0, y: 0, w: 100, h: 8, reason: "Explore search bar" },
      { id: "cta", x: 0, y: 82, w: 100, h: 12, reason: "Caption + CTA stack" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide/instagram-explore",
  },
  {
    id: "meta-messenger",
    platform: "meta",
    label: "Messenger Inbox",
    surface: "messenger",
    fields: [
      { id: "primary", label: "Primary text", max: 125, truncateAt: 100, warnAt: 90, multiline: true },
      { id: "headline", label: "Headline", max: 40, truncateAt: 25, warnAt: 22 },
      { id: "description", label: "Description", max: 30, truncateAt: 30, warnAt: 27 },
    ],
    safeZones: [
      { id: "messenger-header", x: 0, y: 0, w: 100, h: 9, reason: "Chats / Marketplace tabs" },
      { id: "cta", x: 0, y: 84, w: 100, h: 16, reason: "Inbox CTA + dismiss" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide/messenger-inbox",
  },
  {
    id: "meta-dynamic-creative",
    platform: "meta",
    label: "Meta Dynamic Creative",
    surface: "feed",
    fields: [
      { id: "primary", label: "Primary text (per variation)", max: 500, truncateAt: 125, warnAt: 110, multiline: true },
      { id: "headline", label: "Headline (per variation)", max: 255, truncateAt: 40, warnAt: 27 },
      { id: "description", label: "Description (per variation)", max: 200, truncateAt: 30, warnAt: 27 },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 9, reason: "Profile + sponsored label" },
      { id: "cta", x: 0, y: 80, w: 100, h: 12, reason: "CTA + headline strip" },
      { id: "reaction-bar", x: 0, y: 92, w: 100, h: 8, reason: "Reaction row" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://www.facebook.com/business/help/170372403538781",
  },

  // ──────────────────────────── TIKTOK ────────────────────────────
  {
    id: "tiktok-in-feed",
    platform: "tiktok",
    label: "TikTok In-Feed Ad",
    surface: "for-you",
    fields: [
      { id: "caption", label: "Caption", max: 2200, truncateAt: 100, warnAt: 80, multiline: true },
      { id: "headline", label: "Display name", max: 40, truncateAt: 40, warnAt: 30 },
    ],
    safeZones: [
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 7, reason: "Following / For You tabs" },
      { id: "right-rail", x: 86, y: 28, w: 14, h: 54, reason: "Like / comment / share / bookmark / audio" },
      { id: "username", x: 0, y: 76, w: 70, h: 8, reason: "@username row" },
      { id: "caption-area", x: 0, y: 82, w: 70, h: 10, reason: "Caption clamp area" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Sponsored CTA strip" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://ads.tiktok.com/help/article/in-feed-ads-overview",
  },
  {
    id: "tiktok-spark-ads",
    platform: "tiktok",
    label: "TikTok Spark Ads",
    surface: "for-you",
    fields: [
      { id: "caption", label: "Caption", max: 2200, truncateAt: 100, warnAt: 80, multiline: true },
      { id: "headline", label: "Display name", max: 40, truncateAt: 40, warnAt: 30 },
    ],
    safeZones: [
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 7, reason: "Following / For You tabs" },
      { id: "right-rail", x: 86, y: 28, w: 14, h: 54, reason: "Like / comment / share / bookmark / audio" },
      { id: "username", x: 0, y: 76, w: 70, h: 8, reason: "@username row" },
      { id: "caption-area", x: 0, y: 82, w: 70, h: 10, reason: "Caption clamp area" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Sponsored CTA strip" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://ads.tiktok.com/help/article/spark-ads",
  },
  {
    id: "tiktok-topview",
    platform: "tiktok",
    label: "TikTok TopView",
    surface: "topview",
    fields: [
      { id: "caption", label: "Caption", max: 100, truncateAt: 60, warnAt: 50, multiline: true },
      { id: "headline", label: "Display name", max: 40, truncateAt: 40, warnAt: 30 },
    ],
    safeZones: [
      { id: "top-skip", x: 70, y: 0, w: 30, h: 8, reason: "Skip / countdown overlay" },
      { id: "cta", x: 0, y: 88, w: 100, h: 12, reason: "Bottom CTA card" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://ads.tiktok.com/help/article/topview",
  },
  {
    id: "tiktok-branded-effect",
    platform: "tiktok",
    label: "TikTok Branded Effect",
    surface: "branded-effect",
    fields: [
      { id: "caption", label: "Effect description", max: 100, truncateAt: 50, warnAt: 40 },
    ],
    safeZones: [
      { id: "effect-tray", x: 0, y: 78, w: 100, h: 14, reason: "Effect picker tray" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Use effect CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://ads.tiktok.com/help/article/branded-effect",
  },
  {
    id: "tiktok-shop-ads",
    platform: "tiktok",
    label: "TikTok Shop Ads",
    surface: "shop",
    fields: [
      { id: "caption", label: "Caption", max: 2200, truncateAt: 100, warnAt: 80, multiline: true },
      { id: "headline", label: "Product title", max: 60, truncateAt: 34, warnAt: 30 },
      { id: "description", label: "Product description", max: 200, truncateAt: 80, warnAt: 70 },
    ],
    safeZones: [
      { id: "shop-tabs", x: 0, y: 0, w: 100, h: 7, reason: "Shop nav tabs" },
      { id: "right-rail", x: 86, y: 28, w: 14, h: 54, reason: "Engagement icons" },
      { id: "product-card", x: 0, y: 70, w: 100, h: 22, reason: "Pinned product card" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Buy / Add to cart CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://ads.tiktok.com/help/article/tiktok-shop-ads",
  },
  {
    id: "tiktok-portrait",
    platform: "tiktok",
    label: "TikTok Portrait 9:16",
    surface: "for-you",
    fields: [
      { id: "caption", label: "Caption", max: 2200, truncateAt: 100, warnAt: 80, multiline: true },
    ],
    safeZones: [
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 8, reason: "Following / For You tabs" },
      { id: "right-rail", x: 86, y: 28, w: 14, h: 54, reason: "Engagement column" },
      { id: "username", x: 0, y: 76, w: 70, h: 8, reason: "@username row" },
      { id: "caption-area", x: 0, y: 82, w: 70, h: 10, reason: "Caption clamp area" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Sponsored CTA strip" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://ads.tiktok.com/help/article/creative-specifications",
  },
];

export function getPlacement(id: string): Placement | undefined {
  return PLACEMENTS.find((p) => p.id === id);
}

export function getPlacementsByPlatform(platform: Platform): Placement[] {
  return PLACEMENTS.filter((p) => p.platform === platform);
}

export const DEFAULT_PLACEMENT_ID = "meta-facebook-feed";

export const LAST_VERIFIED_GLOBAL = PLACEMENTS.reduce(
  (acc, p) => (p.lastVerified > acc ? p.lastVerified : acc),
  "0000-00-00",
);

export function platformLabel(p: Platform): string {
  return p === "meta" ? "Meta" : "TikTok";
}
