// Single source of truth for affiliate partners.
// The Chrome extension reads from this same registry so a URL change updates
// every surface (pSEO MDX, extension popup, anywhere else) at once.
//
// Selection criteria (per plan):
//   - Cookie window ≥ 30 days
//   - Self-service signup, no rep handshake
//   - Stable deeplink (no tracking-pixel-only programs)

export type AffiliateCategory =
  | "scheduling"
  | "design"
  | "ai-copy"
  | "ad-tracking"
  | "stock-media"
  | "analytics"
  | "other";

export type AffiliateEntry = {
  id: string;
  label: string;
  url: string;
  oneLiner: string;
  categories: AffiliateCategory[];
  featured?: boolean;
};

// Populate this array as partners are signed up. The MDX component
// renders nothing when an id isn't found, so MDX referencing a future id
// is safe to commit ahead of the partner being live.
export const AFFILIATES: AffiliateEntry[] = [];

const BY_ID = new Map(AFFILIATES.map((a) => [a.id, a]));

export function getAffiliate(id: string): AffiliateEntry | null {
  return BY_ID.get(id) ?? null;
}

export function getFeaturedAffiliate(): AffiliateEntry | null {
  return AFFILIATES.find((a) => a.featured) ?? null;
}

export function getAffiliatesByCategory(category: AffiliateCategory): AffiliateEntry[] {
  return AFFILIATES.filter((a) => a.categories.includes(category));
}
