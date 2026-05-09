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
    id: "meta-facebook-stories",
    platform: "meta",
    label: "Facebook Stories",
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
      { id: "header", x: 0, y: 0, w: 100, h: 9, reason: "LinkedIn nav + search" },
      { id: "actor", x: 0, y: 9, w: 100, h: 8, reason: "Page name + Promoted label" },
      { id: "cta", x: 0, y: 80, w: 100, h: 12, reason: "Headline + CTA strip" },
      { id: "reaction-bar", x: 0, y: 92, w: 100, h: 8, reason: "Like / comment / repost / send" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "header", x: 0, y: 0, w: 100, h: 9, reason: "LinkedIn nav + search" },
      { id: "actor", x: 0, y: 9, w: 100, h: 8, reason: "Page name + Promoted label" },
      { id: "cta", x: 0, y: 80, w: 100, h: 12, reason: "Headline + CTA strip" },
      { id: "reaction-bar", x: 0, y: 92, w: 100, h: 8, reason: "Like / comment / repost / send" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "header", x: 0, y: 0, w: 100, h: 9, reason: "LinkedIn nav + search" },
      { id: "actor", x: 0, y: 9, w: 100, h: 8, reason: "Page name + Promoted label" },
      { id: "carousel-arrows", x: 88, y: 35, w: 12, h: 30, reason: "Carousel arrows" },
      { id: "cta", x: 0, y: 82, w: 100, h: 10, reason: "Per-card headline + CTA" },
      { id: "reaction-bar", x: 0, y: 92, w: 100, h: 8, reason: "Engagement row" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "header", x: 0, y: 0, w: 100, h: 9, reason: "LinkedIn nav + search" },
      { id: "actor", x: 0, y: 9, w: 100, h: 8, reason: "Page name + Promoted label" },
      { id: "doc-controls", x: 0, y: 78, w: 100, h: 6, reason: "Page indicator + download" },
      { id: "cta", x: 0, y: 84, w: 100, h: 8, reason: "Download CTA" },
      { id: "reaction-bar", x: 0, y: 92, w: 100, h: 8, reason: "Engagement row" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Reply / CTA buttons" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "cta-options", x: 0, y: 78, w: 100, h: 22, reason: "Multi-button CTA stack" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "actor", x: 0, y: 9, w: 100, h: 8, reason: "Handle + Ad label" },
      { id: "card-cta", x: 0, y: 76, w: 100, h: 12, reason: "Website card headline + CTA" },
      { id: "engagement", x: 0, y: 90, w: 100, h: 10, reason: "Reply / repost / like / view bar" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 8, reason: "For You / Following tabs" },
      { id: "right-rail", x: 86, y: 28, w: 14, h: 54, reason: "Like / repost / share / bookmark column" },
      { id: "username", x: 0, y: 76, w: 70, h: 8, reason: "@handle + Ad label" },
      { id: "caption-area", x: 0, y: 82, w: 70, h: 10, reason: "Caption clamp area" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Bottom Sponsored CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "actor", x: 0, y: 9, w: 100, h: 8, reason: "Publisher handle + Ad label" },
      { id: "video-controls", x: 0, y: 60, w: 100, h: 8, reason: "Pre-roll skip + countdown" },
      { id: "engagement", x: 0, y: 90, w: 100, h: 10, reason: "Engagement bar" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "video-controls", x: 0, y: 75, w: 100, h: 12, reason: "Skip ad button + countdown" },
      { id: "companion-banner", x: 0, y: 87, w: 100, h: 13, reason: "Companion banner overlay" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://support.google.com/google-ads/answer/2375464",
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
      { id: "video-controls", x: 0, y: 88, w: 100, h: 12, reason: "Progress + brand label (no skip)" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "top-icons", x: 0, y: 0, w: 100, h: 8, reason: "Shorts header + search" },
      { id: "right-rail", x: 86, y: 28, w: 14, h: 54, reason: "Like / dislike / comment / share / remix" },
      { id: "username", x: 0, y: 76, w: 70, h: 8, reason: "Channel name + Sponsored" },
      { id: "caption-area", x: 0, y: 82, w: 70, h: 10, reason: "Description clamp area" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Bottom CTA strip" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "header", x: 0, y: 0, w: 100, h: 9, reason: "YouTube top nav" },
      { id: "thumbnail-overlay", x: 0, y: 60, w: 100, h: 6, reason: "Duration + Ad badge overlay" },
      { id: "metadata", x: 0, y: 84, w: 100, h: 10, reason: "Channel info + view count area" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "video-controls", x: 0, y: 60, w: 100, h: 8, reason: "Mute / volume controls" },
      { id: "panel", x: 0, y: 76, w: 100, h: 16, reason: "Companion panel + CTA" },
      { id: "tabs", x: 0, y: 92, w: 100, h: 8, reason: "Bottom tab bar" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "primary", label: "Description", max: 800, truncateAt: 50, warnAt: 45, multiline: true },
    ],
    safeZones: [
      { id: "top-search", x: 0, y: 0, w: 100, h: 8, reason: "Pinterest search bar" },
      { id: "save-button", x: 80, y: 8, w: 20, h: 8, reason: "Save button overlay" },
      { id: "actor", x: 0, y: 78, w: 100, h: 8, reason: "Pinner + Promoted label" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Title + Visit CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://help.pinterest.com/en/business/article/promoted-pins",
  },
  {
    id: "pinterest-video-pin",
    platform: "pinterest",
    label: "Pinterest Video Pin Ad",
    surface: "pin",
    fields: [
      { id: "headline", label: "Title", max: 100, truncateAt: 40, warnAt: 35 },
      { id: "primary", label: "Description", max: 800, truncateAt: 50, warnAt: 45, multiline: true },
    ],
    safeZones: [
      { id: "top-search", x: 0, y: 0, w: 100, h: 8, reason: "Pinterest search bar" },
      { id: "save-button", x: 80, y: 8, w: 20, h: 8, reason: "Save button overlay" },
      { id: "video-controls", x: 0, y: 70, w: 100, h: 8, reason: "Mute / scrubber overlay" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Title + Visit CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://help.pinterest.com/en/business/article/video-ads",
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
      { id: "top-progress", x: 0, y: 0, w: 100, h: 6, reason: "Multi-page progress bar" },
      { id: "actor", x: 0, y: 6, w: 100, h: 8, reason: "Pinner + Promoted label" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Title + Visit CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://help.pinterest.com/en/business/article/idea-ads",
  },
  {
    id: "pinterest-carousel",
    platform: "pinterest",
    label: "Pinterest Carousel Ad",
    surface: "pin",
    fields: [
      { id: "headline", label: "Card title", max: 100, truncateAt: 40, warnAt: 35 },
      { id: "primary", label: "Description", max: 800, truncateAt: 50, warnAt: 45, multiline: true },
    ],
    safeZones: [
      { id: "top-search", x: 0, y: 0, w: 100, h: 8, reason: "Pinterest search bar" },
      { id: "carousel-dots", x: 0, y: 70, w: 100, h: 4, reason: "Carousel position dots" },
      { id: "actor", x: 0, y: 78, w: 100, h: 8, reason: "Pinner + Promoted label" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Title + Visit CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://help.pinterest.com/en/business/article/carousel-ads",
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
      { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "Reddit top nav + search" },
      { id: "subreddit", x: 0, y: 9, w: 100, h: 7, reason: "Subreddit + Promoted label" },
      { id: "vote-actions", x: 0, y: 86, w: 100, h: 8, reason: "Upvote / comment / share row" },
      { id: "tab-bar", x: 0, y: 94, w: 100, h: 6, reason: "Bottom tab bar" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "Reddit top nav + search" },
      { id: "subreddit", x: 0, y: 9, w: 100, h: 7, reason: "Subreddit + Promoted label" },
      { id: "vote-actions", x: 0, y: 86, w: 100, h: 8, reason: "Upvote / comment / share row" },
      { id: "tab-bar", x: 0, y: 94, w: 100, h: 6, reason: "Bottom tab bar" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "top-nav", x: 0, y: 0, w: 100, h: 9, reason: "Reddit top nav + search" },
      { id: "subreddit", x: 0, y: 9, w: 100, h: 7, reason: "Subreddit + Promoted label" },
      { id: "vote-actions", x: 0, y: 86, w: 100, h: 8, reason: "Upvote / comment / share row" },
      { id: "tab-bar", x: 0, y: 94, w: 100, h: 6, reason: "Bottom tab bar" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "top-progress", x: 0, y: 0, w: 100, h: 8, reason: "Story progress + close" },
      { id: "actor", x: 0, y: 8, w: 100, h: 8, reason: "Brand chip + Sponsored label" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Swipe-up / CTA card" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "discover-tile", x: 0, y: 0, w: 100, h: 14, reason: "Discover tile chrome" },
      { id: "actor", x: 0, y: 14, w: 100, h: 8, reason: "Brand chip + Sponsored label" },
      { id: "cta", x: 0, y: 86, w: 100, h: 14, reason: "Swipe-up / CTA card" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "top-tabs", x: 0, y: 0, w: 100, h: 8, reason: "Spotlight tab bar" },
      { id: "right-rail", x: 86, y: 30, w: 14, h: 50, reason: "Like / share / comment column" },
      { id: "username", x: 0, y: 78, w: 70, h: 8, reason: "@username + Sponsored" },
      { id: "caption-area", x: 0, y: 84, w: 70, h: 10, reason: "Caption clamp area" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Bottom CTA strip" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
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
      { id: "top-progress", x: 0, y: 0, w: 100, h: 8, reason: "Story progress + close" },
      { id: "actor", x: 0, y: 8, w: 100, h: 8, reason: "Brand chip + Sponsored label" },
      { id: "product-tiles", x: 0, y: 76, w: 100, h: 16, reason: "4-up product tile strip" },
      { id: "cta", x: 0, y: 92, w: 100, h: 8, reason: "Bottom Shop CTA" },
    ],
    device: { w: 390, h: 844 },
    lastVerified: "2026-04-15",
    sourceUrl: "https://businesshelp.snapchat.com/s/article/collection-ads",
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
