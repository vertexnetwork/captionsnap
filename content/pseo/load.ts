import type { ComponentType } from "react";

type MdxModule = { default: ComponentType };

const loaders: Record<string, () => Promise<MdxModule>> = {
  // Meta
  "meta/facebook-feed-character-limits-2026": () => import("./meta/facebook-feed-character-limits-2026.mdx"),
  "meta/facebook-carousel-character-limits": () => import("./meta/facebook-carousel-character-limits.mdx"),
  "meta/instagram-feed-ad-character-limits": () => import("./meta/instagram-feed-ad-character-limits.mdx"),
  "meta/instagram-stories-safe-zones": () => import("./meta/instagram-stories-safe-zones.mdx"),
  "meta/instagram-reels-safe-zones": () => import("./meta/instagram-reels-safe-zones.mdx"),
  "meta/facebook-reels-safe-zones": () => import("./meta/facebook-reels-safe-zones.mdx"),
  "meta/instagram-explore-ad-character-limits": () => import("./meta/instagram-explore-ad-character-limits.mdx"),
  "meta/messenger-ad-character-limits": () => import("./meta/messenger-ad-character-limits.mdx"),
  "meta/facebook-headline-truncation-test": () => import("./meta/facebook-headline-truncation-test.mdx"),
  "meta/primary-text-see-more-truncation": () => import("./meta/primary-text-see-more-truncation.mdx"),
  "meta/dynamic-creative-character-limits": () => import("./meta/dynamic-creative-character-limits.mdx"),
  "meta/marketplace-ad-character-limits": () => import("./meta/marketplace-ad-character-limits.mdx"),
  "meta/instagram-stories-character-limits": () => import("./meta/instagram-stories-character-limits.mdx"),
  "meta/facebook-stories-character-limits": () => import("./meta/facebook-stories-character-limits.mdx"),
  "meta/audience-network-character-limits": () => import("./meta/audience-network-character-limits.mdx"),
  "meta/lead-ad-character-limits": () => import("./meta/lead-ad-character-limits.mdx"),
  "meta/collection-ad-character-limits": () => import("./meta/collection-ad-character-limits.mdx"),
  "meta/instant-experience-character-limits": () => import("./meta/instant-experience-character-limits.mdx"),
  "meta/instagram-shopping-ad-character-limits": () => import("./meta/instagram-shopping-ad-character-limits.mdx"),
  "meta/whatsapp-click-to-chat-character-limits": () => import("./meta/whatsapp-click-to-chat-character-limits.mdx"),
  "meta/facebook-video-ad-character-limits": () => import("./meta/facebook-video-ad-character-limits.mdx"),
  "meta/advantage-plus-character-limits": () => import("./meta/advantage-plus-character-limits.mdx"),

  // TikTok
  "tiktok/in-feed-ad-character-limits-2026": () => import("./tiktok/in-feed-ad-character-limits-2026.mdx"),
  "tiktok/spark-ads-safe-zones-2026": () => import("./tiktok/spark-ads-safe-zones-2026.mdx"),
  "tiktok/topview-character-limits": () => import("./tiktok/topview-character-limits.mdx"),
  "tiktok/branded-effect-safe-zones": () => import("./tiktok/branded-effect-safe-zones.mdx"),
  "tiktok/caption-truncation-2200-character": () => import("./tiktok/caption-truncation-2200-character.mdx"),
  "tiktok/cta-overlay-safe-zone": () => import("./tiktok/cta-overlay-safe-zone.mdx"),
  "tiktok/username-overlay-safe-zone": () => import("./tiktok/username-overlay-safe-zone.mdx"),
  "tiktok/side-panel-icon-safe-zone": () => import("./tiktok/side-panel-icon-safe-zone.mdx"),
  "tiktok/portrait-9-16-safe-zones": () => import("./tiktok/portrait-9-16-safe-zones.mdx"),
  "tiktok/shop-ads-character-limits": () => import("./tiktok/shop-ads-character-limits.mdx"),
  "tiktok/lead-generation-ad-character-limits": () => import("./tiktok/lead-generation-ad-character-limits.mdx"),
  "tiktok/dynamic-showcase-character-limits": () => import("./tiktok/dynamic-showcase-character-limits.mdx"),
  "tiktok/playable-ad-character-limits": () => import("./tiktok/playable-ad-character-limits.mdx"),
  "tiktok/carousel-image-ad-character-limits": () => import("./tiktok/carousel-image-ad-character-limits.mdx"),
  "tiktok/branded-mission-character-limits": () => import("./tiktok/branded-mission-character-limits.mdx"),
  "tiktok/livestream-ad-character-limits": () => import("./tiktok/livestream-ad-character-limits.mdx"),
  "tiktok/pulse-ad-character-limits": () => import("./tiktok/pulse-ad-character-limits.mdx"),
  "tiktok/symphony-character-limits": () => import("./tiktok/symphony-character-limits.mdx"),

  // Guides
  "guides/why-ads-get-truncated": () => import("./guides/why-ads-get-truncated.mdx"),
  "guides/safe-zone-vs-character-limit": () => import("./guides/safe-zone-vs-character-limit.mdx"),
  "guides/2026-platform-spec-changes": () => import("./guides/2026-platform-spec-changes.mdx"),
  "guides/how-to-test-ad-truncation-before-launch": () => import("./guides/how-to-test-ad-truncation-before-launch.mdx"),
  "guides/headline-vs-primary-text-strategy": () => import("./guides/headline-vs-primary-text-strategy.mdx"),
  "guides/ad-copy-mobile-first-checklist": () => import("./guides/ad-copy-mobile-first-checklist.mdx"),
  "guides/emoji-character-counting-meta-tiktok": () => import("./guides/emoji-character-counting-meta-tiktok.mdx"),
  "guides/right-to-left-language-truncation": () => import("./guides/right-to-left-language-truncation.mdx"),

  // Compare
  "compare/meta-vs-tiktok-character-limits": () => import("./compare/meta-vs-tiktok-character-limits.mdx"),
  "compare/instagram-reels-vs-tiktok-feed": () => import("./compare/instagram-reels-vs-tiktok-feed.mdx"),
  "compare/facebook-feed-vs-instagram-feed": () => import("./compare/facebook-feed-vs-instagram-feed.mdx"),
  "compare/instagram-stories-vs-tiktok-spark-ads": () => import("./compare/instagram-stories-vs-tiktok-spark-ads.mdx"),
  "compare/meta-reels-vs-tiktok-in-feed": () => import("./compare/meta-reels-vs-tiktok-in-feed.mdx"),

  // Glossary
  "glossary/safe-zone": () => import("./glossary/safe-zone.mdx"),
  "glossary/primary-text": () => import("./glossary/primary-text.mdx"),
  "glossary/cta-truncation": () => import("./glossary/cta-truncation.mdx"),
  "glossary/character-limit": () => import("./glossary/character-limit.mdx"),
  "glossary/see-more-cutoff": () => import("./glossary/see-more-cutoff.mdx"),
  "glossary/aspect-ratio-9-16": () => import("./glossary/aspect-ratio-9-16.mdx"),
  "glossary/utm-character-cost": () => import("./glossary/utm-character-cost.mdx"),

  // LinkedIn
  "linkedin/single-image-character-limits-2026": () => import("./linkedin/single-image-character-limits-2026.mdx"),
  "linkedin/video-ad-character-limits": () => import("./linkedin/video-ad-character-limits.mdx"),
  "linkedin/carousel-character-limits": () => import("./linkedin/carousel-character-limits.mdx"),
  "linkedin/document-ad-character-limits": () => import("./linkedin/document-ad-character-limits.mdx"),
  "linkedin/message-vs-conversation-ads": () => import("./linkedin/message-vs-conversation-ads.mdx"),
  "linkedin/conversation-ad-character-limits": () => import("./linkedin/conversation-ad-character-limits.mdx"),
  "linkedin/lead-gen-form-strategy": () => import("./linkedin/lead-gen-form-strategy.mdx"),

  // X
  "x/promoted-post-character-limits-2026": () => import("./x/promoted-post-character-limits-2026.mdx"),
  "x/vertical-video-ad-character-limits": () => import("./x/vertical-video-ad-character-limits.mdx"),
  "x/amplify-pre-roll-character-limits": () => import("./x/amplify-pre-roll-character-limits.mdx"),

  // YouTube
  "youtube/skippable-in-stream-character-limits": () => import("./youtube/skippable-in-stream-character-limits.mdx"),
  "youtube/bumper-ad-character-limits": () => import("./youtube/bumper-ad-character-limits.mdx"),
  "youtube/shorts-ad-character-limits-2026": () => import("./youtube/shorts-ad-character-limits-2026.mdx"),
  "youtube/in-feed-video-character-limits": () => import("./youtube/in-feed-video-character-limits.mdx"),
  "youtube/masthead-character-limits": () => import("./youtube/masthead-character-limits.mdx"),

  // Pinterest
  "pinterest/standard-pin-ad-character-limits": () => import("./pinterest/standard-pin-ad-character-limits.mdx"),
  "pinterest/video-pin-character-limits": () => import("./pinterest/video-pin-character-limits.mdx"),
  "pinterest/idea-ad-character-limits": () => import("./pinterest/idea-ad-character-limits.mdx"),
  "pinterest/carousel-character-limits": () => import("./pinterest/carousel-character-limits.mdx"),

  // Reddit
  "reddit/promoted-post-character-limits": () => import("./reddit/promoted-post-character-limits.mdx"),
  "reddit/conversation-ad-character-limits": () => import("./reddit/conversation-ad-character-limits.mdx"),
  "reddit/free-form-ad-character-limits": () => import("./reddit/free-form-ad-character-limits.mdx"),

  // Snapchat
  "snapchat/single-image-video-character-limits": () => import("./snapchat/single-image-video-character-limits.mdx"),
  "snapchat/story-ad-character-limits": () => import("./snapchat/story-ad-character-limits.mdx"),
  "snapchat/spotlight-ad-character-limits": () => import("./snapchat/spotlight-ad-character-limits.mdx"),
  "snapchat/collection-ad-character-limits": () => import("./snapchat/collection-ad-character-limits.mdx"),

  // Cross-platform compare (new)
  "compare/linkedin-vs-meta-feed": () => import("./compare/linkedin-vs-meta-feed.mdx"),
  "compare/linkedin-video-vs-meta-video": () => import("./compare/linkedin-video-vs-meta-video.mdx"),
  "compare/x-vs-tiktok-character-limits": () => import("./compare/x-vs-tiktok-character-limits.mdx"),
  "compare/x-vertical-vs-youtube-shorts": () => import("./compare/x-vertical-vs-youtube-shorts.mdx"),
  "compare/x-vs-youtube-pre-roll": () => import("./compare/x-vs-youtube-pre-roll.mdx"),
  "compare/youtube-shorts-vs-tiktok-in-feed": () => import("./compare/youtube-shorts-vs-tiktok-in-feed.mdx"),
  "compare/youtube-vs-meta-video": () => import("./compare/youtube-vs-meta-video.mdx"),
  "compare/youtube-bumper-vs-meta-stories": () => import("./compare/youtube-bumper-vs-meta-stories.mdx"),
  "compare/pinterest-vs-instagram-feed": () => import("./compare/pinterest-vs-instagram-feed.mdx"),
  "compare/pinterest-idea-vs-instagram-stories": () => import("./compare/pinterest-idea-vs-instagram-stories.mdx"),
  "compare/reddit-vs-x-promoted-post": () => import("./compare/reddit-vs-x-promoted-post.mdx"),
  "compare/snapchat-vs-tiktok-character-limits": () => import("./compare/snapchat-vs-tiktok-character-limits.mdx"),

  // New cross-platform guide
  "guides/which-platform-for-which-niche": () => import("./guides/which-platform-for-which-niche.mdx"),
};

export async function loadPseoMdx(slug: string): Promise<ComponentType | null> {
  const loader = loaders[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

export const PSEO_MDX_SLUGS = Object.keys(loaders);
