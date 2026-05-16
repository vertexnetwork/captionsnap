export type Platform =
  | "meta"
  | "tiktok"
  | "linkedin"
  | "x"
  | "youtube"
  | "pinterest"
  | "snapchat"
  | "reddit";

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

export type DeviceKind = "mobile" | "desktop";

/** A rendered surface for one device: pixel box + the app-overlay no-go zones
 *  (percent of that box) the live UI paints over the creative. */
export type DeviceVariant = {
  w: number;
  h: number;
  safeZones: SafeZone[];
};

export type Placement = {
  id: string;
  platform: Platform;
  label: string;
  surface: string;
  fields: SpecField[];
  // `device` + `safeZones` ARE the mobile variant (kept flat for back-compat
  // with the OG route, llms-full, and every existing surface component).
  safeZones: SafeZone[];
  device: { w: number; h: number };
  // Present only where a genuine desktop/web ad rendering exists. Absent =>
  // mobile-only placement (Stories, Reels, vertical-video, …).
  desktop?: DeviceVariant;
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
      { id: "header", x: 0, y: 0, w: 100, h: 10, reason: "Profile, Sponsored label, ⋯ menu" },
      { id: "link-card", x: 0, y: 74, w: 100, h: 14, reason: "Headline + description + CTA button" },
      { id: "reaction-bar", x: 0, y: 88, w: 100, h: 8, reason: "Like / Comment / Share row" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1024,
      h: 768,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Facebook blue bar — search + nav" },
        { id: "left-rail", x: 0, y: 8, w: 23, h: 92, reason: "Shortcuts sidebar" },
        { id: "right-rail", x: 77, y: 8, w: 23, h: 92, reason: "Contacts / sponsored sidebar" },
        { id: "post-header", x: 23, y: 8, w: 54, h: 13, reason: "Page name + Sponsored + ⋯" },
        { id: "link-card", x: 23, y: 70, w: 54, h: 16, reason: "Headline + CTA button" },
        { id: "reaction-bar", x: 23, y: 86, w: 54, h: 8, reason: "Like / Comment / Share row" },
      ],
    },
    lastVerified: "2026-05-15",
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
      { id: "header", x: 0, y: 0, w: 100, h: 10, reason: "Profile, Sponsored label, ⋯ menu" },
      { id: "carousel-arrows", x: 90, y: 36, w: 10, h: 24, reason: "Next-card scroll arrow" },
      { id: "card-cta", x: 0, y: 74, w: 100, h: 14, reason: "Per-card headline + CTA button" },
      { id: "reaction-bar", x: 0, y: 88, w: 100, h: 8, reason: "Like / Comment / Share row" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1024,
      h: 768,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Facebook blue bar — search + nav" },
        { id: "left-rail", x: 0, y: 8, w: 23, h: 92, reason: "Shortcuts sidebar" },
        { id: "right-rail", x: 77, y: 8, w: 23, h: 92, reason: "Contacts / sponsored sidebar" },
        { id: "post-header", x: 23, y: 8, w: 54, h: 13, reason: "Page name + Sponsored + ⋯" },
        { id: "carousel-arrows", x: 71, y: 40, w: 6, h: 18, reason: "Next-card scroll arrow" },
        { id: "card-cta", x: 23, y: 72, w: 54, h: 14, reason: "Per-card headline + CTA button" },
        { id: "reaction-bar", x: 23, y: 86, w: 54, h: 8, reason: "Like / Comment / Share row" },
      ],
    },
    lastVerified: "2026-05-15",
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
      { id: "top-icons", x: 0, y: 0, w: 100, h: 6, reason: "Reels header icons (top 108px / 6%)" },
      { id: "right-rail", x: 89, y: 30, w: 11, h: 50, reason: "Like / comment / share / audio (right 120px / 11%)" },
      { id: "bottom-cluster", x: 0, y: 65, w: 72, h: 27, reason: "Username + caption + audio (bottom cluster ~35%)" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Sponsored CTA strip" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-15",
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
      { id: "header", x: 0, y: 0, w: 100, h: 10, reason: "Marketplace search + category nav" },
      { id: "price", x: 0, y: 74, w: 70, h: 6, reason: "Price + listing title" },
      { id: "cta", x: 0, y: 82, w: 100, h: 14, reason: "Send message / Save buttons" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1024,
      h: 768,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Facebook blue bar — search + nav" },
        { id: "left-rail", x: 0, y: 8, w: 26, h: 92, reason: "Marketplace category filters" },
        { id: "detail-header", x: 60, y: 8, w: 40, h: 16, reason: "Title + price + Sponsored" },
        { id: "cta", x: 60, y: 70, w: 40, h: 22, reason: "Message seller / Save panel" },
      ],
    },
    lastVerified: "2026-05-15",
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
      { id: "header", x: 0, y: 0, w: 100, h: 9, reason: "Username + Sponsored label + ⋯" },
      { id: "cta-banner", x: 0, y: 70, w: 100, h: 8, reason: "Sponsored CTA banner (Learn more)" },
      { id: "action-row", x: 0, y: 78, w: 100, h: 7, reason: "Like / comment / share / save row" },
      { id: "caption", x: 0, y: 85, w: 100, h: 12, reason: "Username + caption clamp" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1024,
      h: 768,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Instagram top bar / search" },
        { id: "left-rail", x: 0, y: 8, w: 18, h: 92, reason: "Instagram nav sidebar" },
        { id: "post-header", x: 35, y: 8, w: 47, h: 11, reason: "Username + Sponsored + ⋯" },
        { id: "cta-banner", x: 35, y: 66, w: 47, h: 8, reason: "Sponsored CTA banner" },
        { id: "action-row", x: 35, y: 74, w: 47, h: 8, reason: "Like / comment / share / save" },
        { id: "caption", x: 35, y: 82, w: 47, h: 14, reason: "Username + caption clamp" },
      ],
    },
    lastVerified: "2026-05-15",
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
      { id: "top-progress", x: 0, y: 0, w: 100, h: 13, reason: "Progress bar + profile + ⋯ (top 250px / 13%)" },
      { id: "cta", x: 0, y: 80, w: 100, h: 20, reason: "Link sticker / swipe-up CTA (bottom ~20%)" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide/instagram-stories",
  },
  {
    id: "meta-facebook-stories",
    platform: "meta",
    label: "Facebook Stories",
    surface: "stories",
    fields: [
      { id: "primary", label: "Primary text", max: 125, truncateAt: 90, warnAt: 80, multiline: true },
      { id: "headline", label: "Headline", max: 40, truncateAt: 40, warnAt: 30 },
    ],
    safeZones: [
      { id: "top-progress", x: 0, y: 0, w: 100, h: 13, reason: "Progress bar + profile + ⋯ (top 250px / 13%)" },
      { id: "cta", x: 0, y: 78, w: 100, h: 22, reason: "Swipe-up CTA card (bottom ~22%)" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-15",
    sourceUrl: "https://www.facebook.com/business/ads-guide/facebook-stories",
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
      { id: "top-icons", x: 0, y: 0, w: 100, h: 6, reason: "Reels camera + Instagram nav (top 108px / 6%)" },
      { id: "right-rail", x: 89, y: 30, w: 11, h: 50, reason: "Like / comment / share / send / audio (right 120px / 11%)" },
      { id: "bottom-cluster", x: 0, y: 65, w: 72, h: 27, reason: "Username + caption + audio (bottom cluster ~35%)" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Sponsored CTA strip" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-15",
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
      { id: "cta-banner", x: 0, y: 70, w: 100, h: 8, reason: "Sponsored CTA banner" },
      { id: "action-row", x: 0, y: 78, w: 100, h: 7, reason: "Like / comment / share / save row" },
      { id: "caption", x: 0, y: 85, w: 100, h: 12, reason: "Username + caption clamp" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1024,
      h: 768,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Instagram top bar / search" },
        { id: "left-rail", x: 0, y: 8, w: 18, h: 92, reason: "Instagram nav sidebar" },
        { id: "post-header", x: 35, y: 8, w: 47, h: 11, reason: "Username + Sponsored + ⋯" },
        { id: "cta-banner", x: 35, y: 66, w: 47, h: 8, reason: "Sponsored CTA banner" },
        { id: "action-row", x: 35, y: 74, w: 47, h: 8, reason: "Like / comment / share / save" },
        { id: "caption", x: 35, y: 82, w: 47, h: 14, reason: "Username + caption clamp" },
      ],
    },
    lastVerified: "2026-05-15",
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
      { id: "messenger-header", x: 0, y: 0, w: 100, h: 10, reason: "Chats / search / Stories row" },
      { id: "cta", x: 0, y: 82, w: 100, h: 18, reason: "Inbox ad card — image, text, CTA, dismiss" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-15",
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
      { id: "header", x: 0, y: 0, w: 100, h: 10, reason: "Profile, Sponsored label, ⋯ menu" },
      { id: "link-card", x: 0, y: 74, w: 100, h: 14, reason: "Headline + description + CTA button" },
      { id: "reaction-bar", x: 0, y: 88, w: 100, h: 8, reason: "Like / Comment / Share row" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1024,
      h: 768,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Facebook blue bar — search + nav" },
        { id: "left-rail", x: 0, y: 8, w: 23, h: 92, reason: "Shortcuts sidebar" },
        { id: "right-rail", x: 77, y: 8, w: 23, h: 92, reason: "Contacts / sponsored sidebar" },
        { id: "post-header", x: 23, y: 8, w: 54, h: 13, reason: "Page name + Sponsored + ⋯" },
        { id: "link-card", x: 23, y: 70, w: 54, h: 16, reason: "Headline + CTA button" },
        { id: "reaction-bar", x: 23, y: 86, w: 54, h: 8, reason: "Like / Comment / Share row" },
      ],
    },
    lastVerified: "2026-05-15",
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
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 7, reason: "Following / For You tabs (top 130px / 7%)" },
      { id: "right-rail", x: 88, y: 28, w: 12, h: 54, reason: "Like / comment / share / bookmark / audio (right ~120px / 12%)" },
      { id: "username", x: 0, y: 76, w: 72, h: 7, reason: "@username row" },
      { id: "caption-area", x: 0, y: 83, w: 72, h: 9, reason: "Caption clamp area (bottom ~24% cluster)" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Sponsored CTA strip" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-search", x: 0, y: 0, w: 100, h: 9, reason: "TikTok web top bar + search" },
        { id: "left-nav", x: 0, y: 9, w: 18, h: 91, reason: "For You / Following / Explore sidebar" },
        { id: "right-rail", x: 60, y: 30, w: 7, h: 50, reason: "Like / comment / share / audio column" },
        { id: "caption-area", x: 19, y: 80, w: 40, h: 14, reason: "@username + caption clamp" },
        { id: "cta", x: 19, y: 94, w: 48, h: 6, reason: "Sponsored CTA strip" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads",
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
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 7, reason: "Following / For You tabs (top 130px / 7%)" },
      { id: "right-rail", x: 88, y: 28, w: 12, h: 54, reason: "Like / comment / share / bookmark / audio (right ~120px / 12%)" },
      { id: "username", x: 0, y: 76, w: 72, h: 7, reason: "Creator @handle row" },
      { id: "caption-area", x: 0, y: 83, w: 72, h: 9, reason: "Caption clamp area (bottom ~24% cluster)" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Sponsored CTA strip" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-search", x: 0, y: 0, w: 100, h: 9, reason: "TikTok web top bar + search" },
        { id: "left-nav", x: 0, y: 9, w: 18, h: 91, reason: "For You / Following / Explore sidebar" },
        { id: "right-rail", x: 60, y: 30, w: 7, h: 50, reason: "Like / comment / share / audio column" },
        { id: "caption-area", x: 19, y: 80, w: 40, h: 14, reason: "Creator @handle + caption clamp" },
        { id: "cta", x: 19, y: 94, w: 48, h: 6, reason: "Sponsored CTA strip" },
      ],
    },
    lastVerified: "2026-05-16",
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
      { id: "top-skip", x: 66, y: 0, w: 34, h: 8, reason: "Skip + countdown overlay" },
      { id: "cta", x: 0, y: 80, w: 100, h: 20, reason: "TopView bottom CTA card (full-width)" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-16",
    sourceUrl: "https://ads.tiktok.com/help/article/tiktok-reservation-topview",
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
      { id: "right-rail", x: 88, y: 28, w: 12, h: 50, reason: "Engagement column behind effect" },
      { id: "effect-tray", x: 0, y: 76, w: 100, h: 16, reason: "Effect picker carousel tray" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Shoot-with-effect CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-16",
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
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 7, reason: "Shop / For You tabs (top 130px / 7%)" },
      { id: "right-rail", x: 88, y: 26, w: 12, h: 48, reason: "Engagement column (right ~120px / 12%)" },
      { id: "product-card", x: 0, y: 68, w: 100, h: 22, reason: "Pinned product card (title + price)" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Buy now / Add to cart CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-16",
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
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 7, reason: "Following / For You tabs (top 130px / 7%)" },
      { id: "right-rail", x: 88, y: 28, w: 12, h: 54, reason: "Engagement column (right ~120px / 12%)" },
      { id: "username", x: 0, y: 76, w: 72, h: 7, reason: "@username row" },
      { id: "caption-area", x: 0, y: 83, w: 72, h: 9, reason: "Caption clamp area (bottom ~24% cluster)" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Sponsored CTA strip" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-search", x: 0, y: 0, w: 100, h: 9, reason: "TikTok web top bar + search" },
        { id: "left-nav", x: 0, y: 9, w: 18, h: 91, reason: "For You / Following / Explore sidebar" },
        { id: "right-rail", x: 60, y: 30, w: 7, h: 50, reason: "Like / comment / share / audio column" },
        { id: "caption-area", x: 19, y: 80, w: 40, h: 14, reason: "@username + caption clamp" },
        { id: "cta", x: 19, y: 94, w: 48, h: 6, reason: "Sponsored CTA strip" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://ads.tiktok.com/help/article/creative-specifications",
  },

  // ──────────────────────────── LINKEDIN ────────────────────────────
  {
    id: "linkedin-single-image",
    platform: "linkedin",
    label: "LinkedIn Single Image",
    surface: "feed",
    fields: [
      { id: "primary", label: "Introductory text", max: 600, truncateAt: 150, warnAt: 140, multiline: true },
      { id: "headline", label: "Headline", max: 70, truncateAt: 40, warnAt: 30 },
      { id: "description", label: "Description", max: 100, truncateAt: 30, warnAt: 27 },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 8, reason: "LinkedIn nav + search" },
      { id: "actor", x: 0, y: 8, w: 100, h: 10, reason: "Page name + Promoted label" },
      { id: "cta", x: 0, y: 80, w: 100, h: 12, reason: "Headline + CTA strip" },
      { id: "reaction-bar", x: 0, y: 92, w: 100, h: 8, reason: "Like / comment / repost / send" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "LinkedIn global nav + search" },
        { id: "left-rail", x: 0, y: 8, w: 22, h: 92, reason: "Profile card sidebar" },
        { id: "right-rail", x: 74, y: 8, w: 26, h: 92, reason: "LinkedIn News / ad sidebar" },
        { id: "actor", x: 22, y: 9, w: 52, h: 10, reason: "Page name + Promoted label" },
        { id: "cta", x: 22, y: 76, w: 52, h: 13, reason: "Headline + CTA strip" },
        { id: "reaction-bar", x: 22, y: 89, w: 52, h: 8, reason: "Like / comment / repost / send" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://www.linkedin.com/help/lms/answer/a420330",
  },
  {
    id: "linkedin-video",
    platform: "linkedin",
    label: "LinkedIn Video Ad",
    surface: "feed",
    fields: [
      { id: "primary", label: "Introductory text", max: 700, truncateAt: 150, warnAt: 140, multiline: true },
      { id: "headline", label: "Headline", max: 70, truncateAt: 50, warnAt: 40 },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 8, reason: "LinkedIn nav + search" },
      { id: "actor", x: 0, y: 8, w: 100, h: 10, reason: "Page name + Promoted label" },
      { id: "cta", x: 0, y: 80, w: 100, h: 12, reason: "Headline + CTA strip" },
      { id: "reaction-bar", x: 0, y: 92, w: 100, h: 8, reason: "Like / comment / repost / send" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "LinkedIn global nav + search" },
        { id: "left-rail", x: 0, y: 8, w: 22, h: 92, reason: "Profile card sidebar" },
        { id: "right-rail", x: 74, y: 8, w: 26, h: 92, reason: "LinkedIn News / ad sidebar" },
        { id: "actor", x: 22, y: 9, w: 52, h: 10, reason: "Page name + Promoted label" },
        { id: "cta", x: 22, y: 76, w: 52, h: 13, reason: "Headline + CTA strip" },
        { id: "reaction-bar", x: 22, y: 89, w: 52, h: 8, reason: "Like / comment / repost / send" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://www.linkedin.com/help/lms/answer/a420330",
  },
  {
    id: "linkedin-carousel",
    platform: "linkedin",
    label: "LinkedIn Carousel",
    surface: "feed",
    fields: [
      { id: "primary", label: "Introductory text", max: 255, truncateAt: 150, warnAt: 140, multiline: true },
      { id: "headline", label: "Card headline", max: 45, truncateAt: 45, warnAt: 35 },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 8, reason: "LinkedIn nav + search" },
      { id: "actor", x: 0, y: 8, w: 100, h: 10, reason: "Page name + Promoted label" },
      { id: "carousel-arrows", x: 90, y: 36, w: 10, h: 24, reason: "Carousel next-card arrow" },
      { id: "cta", x: 0, y: 80, w: 100, h: 12, reason: "Per-card headline + CTA" },
      { id: "reaction-bar", x: 0, y: 92, w: 100, h: 8, reason: "Engagement row" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "LinkedIn global nav + search" },
        { id: "left-rail", x: 0, y: 8, w: 22, h: 92, reason: "Profile card sidebar" },
        { id: "right-rail", x: 74, y: 8, w: 26, h: 92, reason: "LinkedIn News / ad sidebar" },
        { id: "actor", x: 22, y: 9, w: 52, h: 10, reason: "Page name + Promoted label" },
        { id: "carousel-arrows", x: 70, y: 42, w: 5, h: 16, reason: "Carousel next-card arrow" },
        { id: "cta", x: 22, y: 78, w: 52, h: 11, reason: "Per-card headline + CTA" },
        { id: "reaction-bar", x: 22, y: 89, w: 52, h: 8, reason: "Engagement row" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://www.linkedin.com/help/lms/answer/a426145",
  },
  {
    id: "linkedin-document",
    platform: "linkedin",
    label: "LinkedIn Document Ad",
    surface: "feed",
    fields: [
      { id: "primary", label: "Introductory text", max: 150, truncateAt: 100, warnAt: 90, multiline: true },
      { id: "headline", label: "Headline", max: 70, truncateAt: 50, warnAt: 40 },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 8, reason: "LinkedIn nav + search" },
      { id: "actor", x: 0, y: 8, w: 100, h: 10, reason: "Page name + Promoted label" },
      { id: "doc-controls", x: 0, y: 76, w: 100, h: 7, reason: "Page indicator + unlock/download" },
      { id: "cta", x: 0, y: 83, w: 100, h: 9, reason: "Download CTA" },
      { id: "reaction-bar", x: 0, y: 92, w: 100, h: 8, reason: "Engagement row" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "LinkedIn global nav + search" },
        { id: "left-rail", x: 0, y: 8, w: 22, h: 92, reason: "Profile card sidebar" },
        { id: "right-rail", x: 74, y: 8, w: 26, h: 92, reason: "LinkedIn News / ad sidebar" },
        { id: "actor", x: 22, y: 9, w: 52, h: 10, reason: "Page name + Promoted label" },
        { id: "doc-controls", x: 22, y: 74, w: 52, h: 7, reason: "Page indicator + unlock/download" },
        { id: "cta", x: 22, y: 81, w: 52, h: 8, reason: "Download CTA" },
        { id: "reaction-bar", x: 22, y: 89, w: 52, h: 8, reason: "Engagement row" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://www.linkedin.com/help/lms/answer/a525399",
  },
  {
    id: "linkedin-message",
    platform: "linkedin",
    label: "LinkedIn Message Ad",
    surface: "message",
    fields: [
      { id: "headline", label: "Subject line", max: 60, truncateAt: 40, warnAt: 35 },
      { id: "primary", label: "Message body", max: 1500, truncateAt: 500, warnAt: 450, multiline: true },
      { id: "description", label: "CTA button text", max: 20, truncateAt: 20, warnAt: 16 },
    ],
    safeZones: [
      { id: "messaging-header", x: 0, y: 0, w: 100, h: 9, reason: "Messaging header + close" },
      { id: "sender", x: 0, y: 9, w: 100, h: 12, reason: "Sender + Sponsored label" },
      { id: "cta", x: 0, y: 84, w: 100, h: 16, reason: "Reply / CTA buttons" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "LinkedIn global nav + search" },
        { id: "conversation-list", x: 0, y: 8, w: 32, h: 92, reason: "Messaging conversation list" },
        { id: "thread-header", x: 32, y: 8, w: 68, h: 10, reason: "Sender + Sponsored label" },
        { id: "cta", x: 32, y: 84, w: 68, h: 16, reason: "Reply box + CTA buttons" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://www.linkedin.com/help/lms/answer/a420330",
  },
  {
    id: "linkedin-conversation",
    platform: "linkedin",
    label: "LinkedIn Conversation Ad",
    surface: "message",
    fields: [
      { id: "headline", label: "Subject line", max: 60, truncateAt: 40, warnAt: 35 },
      { id: "primary", label: "First message", max: 500, truncateAt: 300, warnAt: 270, multiline: true },
      { id: "description", label: "CTA button label", max: 25, truncateAt: 25, warnAt: 20 },
    ],
    safeZones: [
      { id: "messaging-header", x: 0, y: 0, w: 100, h: 9, reason: "Messaging header + close" },
      { id: "sender", x: 0, y: 9, w: 100, h: 12, reason: "Sender + Sponsored label" },
      { id: "cta-options", x: 0, y: 74, w: 100, h: 26, reason: "Multi-button CTA reply stack" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "LinkedIn global nav + search" },
        { id: "conversation-list", x: 0, y: 8, w: 32, h: 92, reason: "Messaging conversation list" },
        { id: "thread-header", x: 32, y: 8, w: 68, h: 10, reason: "Sender + Sponsored label" },
        { id: "cta-options", x: 32, y: 74, w: 68, h: 26, reason: "Multi-button CTA reply stack" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://www.linkedin.com/help/lms/answer/a423843",
  },

  // ──────────────────────────── X (TWITTER) ────────────────────────────
  {
    id: "x-promoted-tweet",
    platform: "x",
    label: "X Promoted Post",
    surface: "timeline",
    fields: [
      { id: "primary", label: "Post text", max: 280, truncateAt: 280, warnAt: 250, multiline: true },
      { id: "headline", label: "Card headline", max: 70, truncateAt: 50, warnAt: 40 },
    ],
    safeZones: [
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 9, reason: "For You / Following tabs" },
      { id: "actor", x: 0, y: 9, w: 100, h: 9, reason: "Handle + @user + Ad label" },
      { id: "card-cta", x: 0, y: 74, w: 100, h: 12, reason: "Website card headline + CTA" },
      { id: "engagement", x: 0, y: 90, w: 100, h: 10, reason: "Reply / repost / like / views / bookmark bar" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "left-nav", x: 0, y: 0, w: 22, h: 100, reason: "X nav rail (Home / Explore / …)" },
        { id: "right-sidebar", x: 70, y: 0, w: 30, h: 100, reason: "Search + Trends + Who to follow" },
        { id: "actor", x: 22, y: 2, w: 48, h: 9, reason: "Handle + @user + Ad label" },
        { id: "card-cta", x: 22, y: 74, w: 48, h: 13, reason: "Website card headline + CTA" },
        { id: "engagement", x: 22, y: 88, w: 48, h: 8, reason: "Reply / repost / like / views bar" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://business.x.com/en/help/campaign-setup/campaign-management/promoted-tweets",
  },
  {
    id: "x-vertical-video",
    platform: "x",
    label: "X Vertical Video Ad",
    surface: "vertical-video",
    fields: [
      { id: "primary", label: "Post text", max: 280, truncateAt: 100, warnAt: 80, multiline: true },
      { id: "headline", label: "Display name", max: 50, truncateAt: 30, warnAt: 25 },
    ],
    safeZones: [
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 7, reason: "For You / Following tabs" },
      { id: "right-rail", x: 88, y: 28, w: 12, h: 54, reason: "Like / repost / share / bookmark column" },
      { id: "username", x: 0, y: 76, w: 72, h: 7, reason: "@handle + Ad label" },
      { id: "caption-area", x: 0, y: 83, w: 72, h: 9, reason: "Caption clamp area" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Bottom Sponsored CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-16",
    sourceUrl: "https://business.x.com/en/help/campaign-setup/campaign-management/vertical-video-ads",
  },
  {
    id: "x-amplify-preroll",
    platform: "x",
    label: "X Amplify Pre-Roll",
    surface: "timeline",
    fields: [
      { id: "primary", label: "Companion post text", max: 280, truncateAt: 200, warnAt: 180, multiline: true },
      { id: "headline", label: "Display name", max: 50, truncateAt: 30, warnAt: 25 },
    ],
    safeZones: [
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 9, reason: "For You / Following tabs" },
      { id: "actor", x: 0, y: 9, w: 100, h: 9, reason: "Publisher handle + Ad label" },
      { id: "video-controls", x: 0, y: 56, w: 100, h: 8, reason: "Pre-roll countdown + advertiser" },
      { id: "engagement", x: 0, y: 90, w: 100, h: 10, reason: "Reply / repost / like / views bar" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "left-nav", x: 0, y: 0, w: 22, h: 100, reason: "X nav rail" },
        { id: "right-sidebar", x: 70, y: 0, w: 30, h: 100, reason: "Search + Trends" },
        { id: "actor", x: 22, y: 2, w: 48, h: 9, reason: "Publisher handle + Ad label" },
        { id: "video-controls", x: 22, y: 56, w: 48, h: 8, reason: "Pre-roll countdown + advertiser" },
        { id: "engagement", x: 22, y: 88, w: 48, h: 8, reason: "Reply / repost / like / views bar" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://business.x.com/en/help/campaign-setup/campaign-management/amplify",
  },

  // ──────────────────────────── YOUTUBE ────────────────────────────
  {
    id: "youtube-skippable-instream",
    platform: "youtube",
    label: "YouTube Skippable In-Stream",
    surface: "instream",
    fields: [
      { id: "headline", label: "Long headline", max: 90, truncateAt: 45, warnAt: 40 },
      { id: "description", label: "Description", max: 70, truncateAt: 60, warnAt: 50 },
    ],
    safeZones: [
      { id: "ad-badge", x: 0, y: 0, w: 28, h: 7, reason: "“Ad” badge + advertiser URL" },
      { id: "cta-card", x: 0, y: 66, w: 64, h: 14, reason: "Headline + CTA overlay (bottom-left)" },
      { id: "skip-button", x: 64, y: 72, w: 36, h: 12, reason: "Skip Ad button (after 5s)" },
      { id: "progress", x: 0, y: 96, w: 100, h: 4, reason: "Yellow progress bar" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "YouTube masthead nav + search" },
        { id: "cta-card", x: 2, y: 70, w: 40, h: 14, reason: "Headline + CTA overlay on player" },
        { id: "skip-button", x: 55, y: 78, w: 14, h: 9, reason: "Skip Ad button (after 5s)" },
        { id: "companion-banner", x: 70, y: 12, w: 28, h: 30, reason: "Companion banner 300×250 (desktop only)" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://support.google.com/google-ads/answer/6055025",
  },
  {
    id: "youtube-bumper",
    platform: "youtube",
    label: "YouTube Bumper Ad",
    surface: "instream",
    fields: [
      { id: "headline", label: "Headline", max: 90, truncateAt: 30, warnAt: 25 },
    ],
    safeZones: [
      { id: "ad-badge", x: 0, y: 0, w: 28, h: 7, reason: "“Ad” badge + advertiser URL" },
      { id: "cta-card", x: 0, y: 68, w: 64, h: 14, reason: "Headline + CTA overlay (no skip — 6s)" },
      { id: "progress", x: 0, y: 96, w: 100, h: 4, reason: "Yellow progress bar" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "YouTube masthead nav + search" },
        { id: "cta-card", x: 2, y: 70, w: 40, h: 14, reason: "Headline + CTA overlay on player" },
        { id: "companion-banner", x: 70, y: 12, w: 28, h: 30, reason: "Companion banner 300×250 (desktop only)" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://support.google.com/google-ads/answer/6233188",
  },
  {
    id: "youtube-shorts",
    platform: "youtube",
    label: "YouTube Shorts Ad",
    surface: "shorts",
    fields: [
      { id: "primary", label: "Description", max: 120, truncateAt: 60, warnAt: 50, multiline: true },
      { id: "headline", label: "Channel / display name", max: 50, truncateAt: 30, warnAt: 25 },
    ],
    safeZones: [
      { id: "top-icons", x: 0, y: 0, w: 100, h: 6, reason: "Shorts header + search" },
      { id: "right-rail", x: 88, y: 28, w: 12, h: 54, reason: "Like / dislike / comment / share / remix" },
      { id: "username", x: 0, y: 76, w: 72, h: 7, reason: "Channel name + Sponsored" },
      { id: "caption-area", x: 0, y: 83, w: 72, h: 9, reason: "Description clamp area" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Bottom CTA strip" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "YouTube top bar + search" },
        { id: "left-nav", x: 0, y: 9, w: 16, h: 91, reason: "Home / Shorts / Subscriptions rail" },
        { id: "right-rail", x: 58, y: 28, w: 7, h: 54, reason: "Like / dislike / comment / share column" },
        { id: "caption-area", x: 30, y: 82, w: 28, h: 12, reason: "Channel + description clamp" },
        { id: "cta", x: 30, y: 94, w: 35, h: 6, reason: "Sponsored CTA strip" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://support.google.com/google-ads/answer/12362050",
  },
  {
    id: "youtube-discovery",
    platform: "youtube",
    label: "YouTube In-Feed Video Ad",
    surface: "discovery",
    fields: [
      { id: "headline", label: "Long headline", max: 100, truncateAt: 40, warnAt: 35 },
      { id: "primary", label: "Description line 1", max: 35, truncateAt: 35, warnAt: 30 },
      { id: "description", label: "Description line 2", max: 35, truncateAt: 35, warnAt: 30 },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 8, reason: "YouTube top nav + search" },
      { id: "thumbnail-overlay", x: 70, y: 52, w: 30, h: 6, reason: "Duration + Ad badge overlay" },
      { id: "metadata", x: 0, y: 74, w: 100, h: 12, reason: "Channel + headline + Sponsored row" },
      { id: "tab-bar", x: 0, y: 94, w: 100, h: 6, reason: "Bottom tab bar" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "YouTube top bar + search" },
        { id: "left-nav", x: 0, y: 9, w: 16, h: 91, reason: "Home / Shorts / Subscriptions rail" },
        { id: "thumbnail-overlay", x: 16, y: 22, w: 20, h: 5, reason: "Duration + Ad badge on thumbnail" },
        { id: "metadata", x: 38, y: 13, w: 40, h: 18, reason: "Headline + channel + Sponsored" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://support.google.com/google-ads/answer/9684328",
  },
  {
    id: "youtube-masthead",
    platform: "youtube",
    label: "YouTube Masthead",
    surface: "masthead",
    fields: [
      { id: "headline", label: "Long headline", max: 90, truncateAt: 40, warnAt: 35 },
      { id: "primary", label: "Description", max: 70, truncateAt: 50, warnAt: 45, multiline: true },
    ],
    safeZones: [
      { id: "header", x: 0, y: 0, w: 100, h: 8, reason: "YouTube global nav" },
      { id: "video-controls", x: 70, y: 48, w: 30, h: 7, reason: "Mute / CTA controls" },
      { id: "panel", x: 0, y: 58, w: 100, h: 18, reason: "Channel info panel + CTA" },
      { id: "tabs", x: 0, y: 92, w: 100, h: 8, reason: "Bottom tab bar" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "YouTube global nav + search" },
        { id: "left-nav", x: 0, y: 9, w: 16, h: 91, reason: "Home / Shorts / Subscriptions rail" },
        { id: "mute-cta", x: 86, y: 52, w: 12, h: 8, reason: "Mute + CTA controls on banner" },
        { id: "info-panel", x: 16, y: 60, w: 84, h: 14, reason: "Channel avatar + headline + Visit CTA" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://support.google.com/google-ads/answer/9696790",
  },

  // ──────────────────────────── PINTEREST ────────────────────────────
  {
    id: "pinterest-standard-pin",
    platform: "pinterest",
    label: "Pinterest Standard Pin Ad",
    surface: "pin",
    fields: [
      { id: "headline", label: "Title", max: 100, truncateAt: 40, warnAt: 35 },
      { id: "primary", label: "Description", max: 500, truncateAt: 50, warnAt: 45, multiline: true },
    ],
    safeZones: [
      { id: "top-search", x: 0, y: 0, w: 100, h: 8, reason: "Pinterest search bar" },
      { id: "save-button", x: 74, y: 9, w: 26, h: 7, reason: "Save button overlay (closeup)" },
      { id: "actor", x: 0, y: 76, w: 100, h: 10, reason: "Pinner + Promoted-by label" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Title (≈40 char in feed) + Visit CTA" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "Pinterest nav + search" },
        { id: "actions", x: 53, y: 9, w: 47, h: 11, reason: "⋯ · share · Save button" },
        { id: "visit-cta", x: 53, y: 80, w: 47, h: 14, reason: "Pinner + Visit-site button" },
      ],
    },
    lastVerified: "2026-05-15",
    sourceUrl: "https://help.pinterest.com/en/business/article/pinterest-product-specs",
  },
  {
    id: "pinterest-video-pin",
    platform: "pinterest",
    label: "Pinterest Video Pin Ad",
    surface: "pin",
    fields: [
      { id: "headline", label: "Title", max: 100, truncateAt: 40, warnAt: 35 },
      { id: "primary", label: "Description", max: 500, truncateAt: 50, warnAt: 45, multiline: true },
    ],
    safeZones: [
      { id: "top-search", x: 0, y: 0, w: 100, h: 8, reason: "Pinterest search bar" },
      { id: "save-button", x: 74, y: 9, w: 26, h: 7, reason: "Save button overlay (closeup)" },
      { id: "video-controls", x: 0, y: 68, w: 100, h: 8, reason: "Mute / scrubber overlay" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Title (≈40 char in feed) + Visit CTA" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "Pinterest nav + search" },
        { id: "actions", x: 53, y: 9, w: 47, h: 11, reason: "⋯ · share · Save button" },
        { id: "video-controls", x: 0, y: 84, w: 52, h: 10, reason: "Mute / scrubber overlay" },
        { id: "visit-cta", x: 53, y: 80, w: 47, h: 14, reason: "Pinner + Visit-site button" },
      ],
    },
    lastVerified: "2026-05-15",
    sourceUrl: "https://help.pinterest.com/en/business/article/pinterest-product-specs",
  },
  {
    id: "pinterest-idea",
    platform: "pinterest",
    label: "Pinterest Idea Ad",
    surface: "idea",
    fields: [
      { id: "headline", label: "Title", max: 100, truncateAt: 40, warnAt: 35 },
      { id: "primary", label: "Page text overlay", max: 250, truncateAt: 100, warnAt: 80, multiline: true },
    ],
    safeZones: [
      { id: "top-progress", x: 0, y: 0, w: 100, h: 5, reason: "Multi-page progress bar (up to 20 pages)" },
      { id: "actor", x: 0, y: 5, w: 100, h: 9, reason: "Pinner + Promoted label" },
      { id: "cta", x: 0, y: 84, w: 100, h: 16, reason: "Title + Visit CTA card" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-15",
    sourceUrl: "https://help.pinterest.com/en/business/article/pinterest-product-specs",
  },
  {
    id: "pinterest-carousel",
    platform: "pinterest",
    label: "Pinterest Carousel Ad",
    surface: "pin",
    fields: [
      { id: "headline", label: "Card title", max: 100, truncateAt: 40, warnAt: 35 },
      { id: "primary", label: "Description", max: 500, truncateAt: 50, warnAt: 45, multiline: true },
    ],
    safeZones: [
      { id: "top-search", x: 0, y: 0, w: 100, h: 8, reason: "Pinterest search bar" },
      { id: "save-button", x: 74, y: 9, w: 26, h: 7, reason: "Save button overlay (closeup)" },
      { id: "carousel-dots", x: 0, y: 70, w: 100, h: 4, reason: "Carousel position dots (2–5 cards)" },
      { id: "actor", x: 0, y: 76, w: 100, h: 10, reason: "Pinner + Promoted-by label" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Card title + Visit CTA" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "Pinterest nav + search" },
        { id: "actions", x: 53, y: 9, w: 47, h: 11, reason: "⋯ · share · Save button" },
        { id: "carousel-arrows", x: 44, y: 45, w: 8, h: 14, reason: "Carousel next-card arrow" },
        { id: "visit-cta", x: 53, y: 80, w: 47, h: 14, reason: "Pinner + Visit-site button" },
      ],
    },
    lastVerified: "2026-05-15",
    sourceUrl: "https://help.pinterest.com/en/business/article/pinterest-product-specs",
  },

  // ──────────────────────────── REDDIT ────────────────────────────
  {
    id: "reddit-promoted-post",
    platform: "reddit",
    label: "Reddit Promoted Post",
    surface: "feed",
    fields: [
      { id: "headline", label: "Post title", max: 300, truncateAt: 70, warnAt: 60 },
      { id: "primary", label: "Body / link card text", max: 500, truncateAt: 100, warnAt: 80, multiline: true },
    ],
    safeZones: [
      { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Reddit top nav + search" },
      { id: "subreddit", x: 0, y: 8, w: 100, h: 8, reason: "Subreddit + Promoted label" },
      { id: "cta", x: 0, y: 80, w: 100, h: 6, reason: "Sponsored CTA button" },
      { id: "vote-actions", x: 0, y: 86, w: 100, h: 8, reason: "Upvote / comment / share row" },
      { id: "tab-bar", x: 0, y: 94, w: 100, h: 6, reason: "Bottom tab bar" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Reddit top nav + search" },
        { id: "left-nav", x: 0, y: 8, w: 18, h: 92, reason: "Communities sidebar" },
        { id: "right-rail", x: 72, y: 8, w: 28, h: 92, reason: "Community card / ad sidebar" },
        { id: "subreddit", x: 18, y: 9, w: 54, h: 8, reason: "Subreddit + Promoted label" },
        { id: "cta", x: 18, y: 78, w: 54, h: 8, reason: "Sponsored CTA button" },
        { id: "vote-actions", x: 18, y: 88, w: 54, h: 8, reason: "Upvote / comment / share row" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://business.reddithelp.com/helpcenter/s/article/promoted-posts",
  },
  {
    id: "reddit-conversation",
    platform: "reddit",
    label: "Reddit Conversation Ad",
    surface: "conversation",
    fields: [
      { id: "headline", label: "Post title", max: 300, truncateAt: 70, warnAt: 60 },
      { id: "primary", label: "First-comment style body", max: 500, truncateAt: 150, warnAt: 130, multiline: true },
    ],
    safeZones: [
      { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Reddit top nav + search" },
      { id: "subreddit", x: 0, y: 8, w: 100, h: 8, reason: "Subreddit + Promoted label" },
      { id: "first-comment", x: 0, y: 64, w: 100, h: 8, reason: "Pinned first-comment ad strip" },
      { id: "cta", x: 0, y: 80, w: 100, h: 6, reason: "Sponsored CTA button" },
      { id: "vote-actions", x: 0, y: 86, w: 100, h: 8, reason: "Upvote / comment / share row" },
      { id: "tab-bar", x: 0, y: 94, w: 100, h: 6, reason: "Bottom tab bar" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Reddit top nav + search" },
        { id: "left-nav", x: 0, y: 8, w: 18, h: 92, reason: "Communities sidebar" },
        { id: "right-rail", x: 72, y: 8, w: 28, h: 92, reason: "Community card / ad sidebar" },
        { id: "subreddit", x: 18, y: 9, w: 54, h: 8, reason: "Subreddit + Promoted label" },
        { id: "first-comment", x: 18, y: 62, w: 54, h: 9, reason: "Pinned first-comment ad strip" },
        { id: "cta", x: 18, y: 78, w: 54, h: 8, reason: "Sponsored CTA button" },
        { id: "vote-actions", x: 18, y: 88, w: 54, h: 8, reason: "Upvote / comment / share row" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://business.reddithelp.com/helpcenter/s/article/conversation-ads",
  },
  {
    id: "reddit-free-form",
    platform: "reddit",
    label: "Reddit Free-Form Ad",
    surface: "feed",
    fields: [
      { id: "headline", label: "Post title", max: 300, truncateAt: 70, warnAt: 60 },
      { id: "primary", label: "Rich body text", max: 4000, truncateAt: 200, warnAt: 180, multiline: true },
    ],
    safeZones: [
      { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Reddit top nav + search" },
      { id: "subreddit", x: 0, y: 8, w: 100, h: 8, reason: "Subreddit + Promoted label" },
      { id: "cta", x: 0, y: 80, w: 100, h: 6, reason: "Sponsored CTA button" },
      { id: "vote-actions", x: 0, y: 86, w: 100, h: 8, reason: "Upvote / comment / share row" },
      { id: "tab-bar", x: 0, y: 94, w: 100, h: 6, reason: "Bottom tab bar" },
    ],
    device: { w: 390, h: 844 },
    desktop: {
      w: 1280,
      h: 800,
      safeZones: [
        { id: "top-nav", x: 0, y: 0, w: 100, h: 8, reason: "Reddit top nav + search" },
        { id: "left-nav", x: 0, y: 8, w: 18, h: 92, reason: "Communities sidebar" },
        { id: "right-rail", x: 72, y: 8, w: 28, h: 92, reason: "Community card / ad sidebar" },
        { id: "subreddit", x: 18, y: 9, w: 54, h: 8, reason: "Subreddit + Promoted label" },
        { id: "cta", x: 18, y: 78, w: 54, h: 8, reason: "Sponsored CTA button" },
        { id: "vote-actions", x: 18, y: 88, w: 54, h: 8, reason: "Upvote / comment / share row" },
      ],
    },
    lastVerified: "2026-05-16",
    sourceUrl: "https://business.reddithelp.com/helpcenter/s/article/free-form-ads",
  },

  // ──────────────────────────── SNAPCHAT ────────────────────────────
  {
    id: "snap-single-image-video",
    platform: "snapchat",
    label: "Snapchat Single Image / Video",
    surface: "story",
    fields: [
      { id: "headline", label: "Brand name", max: 25, truncateAt: 25, warnAt: 20 },
      { id: "primary", label: "Headline", max: 34, truncateAt: 34, warnAt: 28 },
    ],
    safeZones: [
      { id: "top-progress", x: 0, y: 0, w: 100, h: 8, reason: "Top 150px — close + ⋯ (keep clear)" },
      { id: "actor", x: 0, y: 70, w: 100, h: 8, reason: "Brand name + headline" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Swipe-up / Attachment CTA (bottom 150px)" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-16",
    sourceUrl: "https://businesshelp.snapchat.com/s/article/snap-ad",
  },
  {
    id: "snap-story-ad",
    platform: "snapchat",
    label: "Snapchat Story Ad",
    surface: "story",
    fields: [
      { id: "headline", label: "Brand name", max: 25, truncateAt: 25, warnAt: 20 },
      { id: "primary", label: "Headline", max: 34, truncateAt: 34, warnAt: 28 },
    ],
    safeZones: [
      { id: "top-progress", x: 0, y: 0, w: 100, h: 8, reason: "Top 150px — close + ⋯ (keep clear)" },
      { id: "actor", x: 0, y: 70, w: 100, h: 8, reason: "Brand name + headline" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Swipe-up / Attachment CTA (bottom 150px)" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-16",
    sourceUrl: "https://businesshelp.snapchat.com/s/article/story-ads",
  },
  {
    id: "snap-spotlight",
    platform: "snapchat",
    label: "Snapchat Spotlight Ad",
    surface: "spotlight",
    fields: [
      { id: "headline", label: "Display name", max: 25, truncateAt: 25, warnAt: 20 },
      { id: "primary", label: "Caption", max: 100, truncateAt: 60, warnAt: 50, multiline: true },
    ],
    safeZones: [
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 7, reason: "Spotlight top bar (keep clear)" },
      { id: "right-rail", x: 88, y: 30, w: 12, h: 50, reason: "Like / share / comment column" },
      { id: "username", x: 0, y: 78, w: 72, h: 7, reason: "@username + Sponsored" },
      { id: "caption-area", x: 0, y: 85, w: 72, h: 8, reason: "Caption clamp area" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Bottom CTA strip" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-16",
    sourceUrl: "https://businesshelp.snapchat.com/s/article/spotlight-ads",
  },
  {
    id: "snap-collection",
    platform: "snapchat",
    label: "Snapchat Collection Ad",
    surface: "story",
    fields: [
      { id: "headline", label: "Brand name", max: 25, truncateAt: 25, warnAt: 20 },
      { id: "primary", label: "Headline", max: 34, truncateAt: 34, warnAt: 28 },
    ],
    safeZones: [
      { id: "top-progress", x: 0, y: 0, w: 100, h: 8, reason: "Top 150px — close + ⋯ (keep clear)" },
      { id: "actor", x: 0, y: 66, w: 100, h: 8, reason: "Brand name + headline" },
      { id: "product-tiles", x: 0, y: 76, w: 100, h: 16, reason: "4-up product tile strip" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Bottom Shop CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-05-16",
    sourceUrl: "https://businesshelp.snapchat.com/s/article/collection-ads",
  },
];

export function getPlacement(id: string): Placement | undefined {
  return PLACEMENTS.find((p) => p.id === id);
}

export function getPlacementsByPlatform(platform: Platform): Placement[] {
  return PLACEMENTS.filter((p) => p.platform === platform);
}

/** True when this placement has a real desktop/web ad rendering. */
export function hasDesktop(p: Placement): boolean {
  return p.desktop != null;
}

/** Resolve the variant to render for a device. Returns null when desktop is
 *  requested for a mobile-only placement — callers show the mobile-only state. */
export function getDeviceVariant(
  p: Placement,
  kind: DeviceKind,
): DeviceVariant | null {
  if (kind === "desktop") return p.desktop ?? null;
  return { w: p.device.w, h: p.device.h, safeZones: p.safeZones };
}

export const DEFAULT_PLACEMENT_ID = "meta-facebook-feed";

export const LAST_VERIFIED_GLOBAL = PLACEMENTS.reduce(
  (acc, p) => (p.lastVerified > acc ? p.lastVerified : acc),
  "0000-00-00",
);

export function platformLabel(p: Platform): string {
  switch (p) {
    case "meta":
      return "Meta";
    case "tiktok":
      return "TikTok";
    case "linkedin":
      return "LinkedIn";
    case "x":
      return "X";
    case "youtube":
      return "YouTube";
    case "pinterest":
      return "Pinterest";
    case "snapchat":
      return "Snapchat";
    case "reddit":
      return "Reddit";
  }
}
