# CaptionSnap — Build Plan

## Context

CaptionSnap is a free utility that lets media buyers paste ad copy and instantly see character-limit violations and UI safe-zone collisions across Meta and TikTok placements. This document is the executable spec for a solo engineer building the Next.js + Vercel app.

The intended outcome is a single shippable repo with: a homepage simulator, a stateless URL-share mechanism, an iframe-embed page, an About page, ~30–60 curated pSEO pages, full SEO/GEO/`llms.txt` coverage, MediaVine-ready ad slots (unfilled until approval), Vercel Analytics + Microsoft Clarity, and a hook to add a Chrome extension later. **No auth, no database.**

---

## Part A — Customer-Facing (lives in the product / public site)

These items belong in marketing copy, the homepage, the About page, and meta tags. Do not put internal numbers (Part B) on public pages.

### Brand
- **Name:** CaptionSnap
- **Domain:** `captionsnap.io`
- **Social handle:** `@captionsnap` (reserve on X, Instagram, TikTok, LinkedIn, YouTube, Threads, Bluesky)
- **Tagline:** "Stop getting your best hooks truncated by UI overlays."
- **Voice:** efficiency- and waste-reduction-focused; speaks to PPC managers and media buyers.

### Visual identity
- **Palette:** "Bold Contrast" — deep dark-mode background, bright white type, electric neon accents for safe-zone overlays and warnings.
- **Type:** DM Sans (primary) and/or Plus Jakarta Sans (display), via `next/font/google`.
- **Iconography:** Lucide icons.

### Public-facing pages
1. **Home** — split-screen tool (Part D) with hero "Stop guessing where your ad copy gets cut off" and proof bar (platforms supported, no signup, free).
2. **About** — origin/mission, who built it, why it's free (ad-supported), changelog of platform-spec updates.
3. **Embed** — public route documenting how to embed the simulator on third-party sites (snippet generator + live preview).
4. **pSEO pages** — see Part E. Each: unique factual content, embedded mini-simulator preset, FAQ schema.
5. **Privacy** and **Terms** — standard, with explicit Clarity / Analytics / ads disclosures.

### Marketing claims to keep accurate
- TikTok caption: 2,200 char expanded.
- Meta primary text: 125 char before "See more"; headline 27–40 char optimal; description 30 char.
- The `lib/platform-specs.ts` file is the **single source of truth**; surface its `lastVerified` date on every pSEO page.

---

## Part B — Internal Only (never shipped to the public site)

Belongs in `README.md`, `docs/internal/`, or engineer notes — never in user-facing copy.

- Niche category: B2B Marketing / Advertising. Target RPM $14 (range $8–$22).
- Traffic model: Min 5k / Avg 15k / Max 40k pageviews per month.
- Earnings model: $40 / $210 / $880 per month at the same tiers.
- Distribution playbook: r/PPC, r/digital_marketing, r/FacebookAds, Facebook ad-buyer groups, LinkedIn ad-ops communities. Frame as utility, not promotion.
- MediaVine Journey eligibility: ~50k monthly sessions; expected ~30 days post-launch given the niche. **Ad components ship with slots wired but unfilled** until approval.
- Score: 87/100 (Earning 89, Ease 85). Use to deprioritize against future niches, not to display.

---

## Part C — Tech Stack & Architecture

| Concern              | Choice                                                                  |
|----------------------|-------------------------------------------------------------------------|
| Framework            | Next.js 15, App Router, TypeScript strict                               |
| Hosting              | Vercel (Production + Preview per branch)                                |
| Styling              | Tailwind CSS + CSS variables for theme tokens                           |
| Components           | shadcn/ui (Radix primitives), Lucide icons                              |
| State                | React Context for tool state; URL is the persistence layer              |
| Storage              | **None** — no DB, no KV. Share state is fully URL-encoded.              |
| OG images            | `@vercel/og` (Edge runtime) reading the same URL params                 |
| Analytics            | `@vercel/analytics` + Microsoft Clarity (script in `app/layout.tsx`)    |
| Ads                  | MediaVine slot component, feature-flagged off until approval            |
| Forms / contact      | None at launch (avoid email handling)                                   |
| Testing              | Vitest (unit, character-limit logic), Playwright (E2E + share rehydrate)|
| Linting / formatting | ESLint, Prettier, `tsc --noEmit` in CI                                  |
| Repo / CI            | GitHub → Vercel auto-deploy; GitHub Actions for tests on PR             |
| Node                 | Latest LTS pinned via `.nvmrc`                                          |

### Repo layout
```
captionsnap/
├── app/
│   ├── (marketing)/page.tsx           # home (the simulator + hero)
│   ├── about/page.tsx
│   ├── embed/page.tsx                 # snippet generator (public)
│   ├── embed/render/page.tsx          # iframe-friendly bare simulator
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── (pseo)/[platform]/[slug]/page.tsx  # 30–60 curated pages
│   ├── api/og/route.tsx               # @vercel/og dynamic OG images
│   ├── llms.txt/route.ts              # plain-text route handler
│   ├── llms-full.txt/route.ts
│   ├── robots.ts
│   ├── sitemap.ts
│   └── layout.tsx
├── components/
│   ├── simulator/                     # SafeZoneCanvas, CopyInputs, PlatformPicker
│   ├── ads/MediaVineSlot.tsx          # renders nothing while flag is off
│   ├── seo/JsonLd.tsx
│   └── ui/                            # shadcn output
├── lib/
│   ├── platform-specs.ts              # SOURCE OF TRUTH for limits + safe zones
│   ├── share.ts                       # encode/decode URL state (lz-string)
│   ├── truncate.ts                    # ellipsis logic per platform
│   └── analytics.ts                   # event helpers (typed)
├── content/
│   └── pseo/*.mdx                     # one MDX per curated pSEO page
├── data/
│   └── pseo-index.ts                  # registry that drives sitemap + nav
├── public/
│   ├── og-default.png
│   └── favicon assets
├── tests/
│   ├── unit/*.test.ts
│   └── e2e/*.spec.ts
└── docs/internal/                     # traffic model, RPM math, distribution plan
```

---

## Part D — Simulator Engine (core feature)

### Inputs (left pane)
- Platform picker: Meta / TikTok (segmented control).
- Placement picker (depends on platform): Feed, Reels, Stories, Carousel, Spark Ads, etc.
- Text fields: Primary Text, Headline, Description (Meta) / Caption (TikTok).
- Display options: dark mode preview, device frame on/off.

### Output (right pane)
- A CSS-rendered phone mockup (iPhone 14-class dimensions, 390×844 logical px, scaled).
- Ad copy rendered inside the mockup with the platform's font weights and line clamps.
- Truncation performed exactly where the live engine truncates (driven by `lib/truncate.ts` + `platform-specs.ts`).
- Semi-transparent **red bounding boxes** overlay regions the live UI obscures (TikTok side-panel icons, username block; Meta CTA button, like-bar). Keyed off `platform-specs.ts → safeZones[]`.
- Per-field counters with green/yellow/red states keyed to the spec.
- A "Copy share link" button (copies the current URL).

### Single source of truth: `lib/platform-specs.ts`
```ts
export type Placement = {
  id: string;                 // 'meta-feed', 'tiktok-spark-ads'
  platform: 'meta' | 'tiktok';
  label: string;
  fields: { id: 'primary'|'headline'|'description'|'caption'; max: number; truncateAt: number; warnAt?: number }[];
  safeZones: { x: number; y: number; w: number; h: number; reason: string }[]; // % of canvas
  device: { w: number; h: number };
  lastVerified: string;       // ISO date — surfaced publicly
  sourceUrl: string;          // platform doc link, surfaced on pSEO pages
};
```
Every truncation rule, safe-zone rectangle, and limit displayed on a pSEO page comes from this file. Updating a spec is a one-line code change + `lastVerified` bump.

---

## Part E — Page Inventory

### Static pages (5)
- `/` Home + simulator
- `/about`
- `/embed` Public embed snippet generator (live preview iframe)
- `/privacy`, `/terms`

### Embed render route (1, distinct rendering)
- `/embed/render?s=...` — bare-chrome simulator. No header/footer, no ads. CSP allows framing. PostMessages to parent: `{ type: 'captionsnap:resize', height }` and `{ type: 'captionsnap:state-change', state }`.
- "Powered by CaptionSnap →" link bottom-right for backlinks.
- Same `<Simulator />` component with an `embedded` prop that hides chrome.

### pSEO curated pages (~30–60, registered in `data/pseo-index.ts`)
Initial set (Meta x ~12, TikTok x ~10, cross-platform x ~8):

**Meta**
- `/meta/facebook-feed-character-limits-2026`
- `/meta/facebook-carousel-character-limits`
- `/meta/instagram-feed-ad-character-limits`
- `/meta/instagram-stories-safe-zones`
- `/meta/instagram-reels-safe-zones`
- `/meta/facebook-reels-safe-zones`
- `/meta/instagram-explore-ad-character-limits`
- `/meta/messenger-ad-character-limits`
- `/meta/facebook-headline-truncation-test`
- `/meta/primary-text-see-more-truncation`
- `/meta/dynamic-creative-character-limits`
- `/meta/marketplace-ad-character-limits`

**TikTok**
- `/tiktok/in-feed-ad-character-limits-2026`
- `/tiktok/spark-ads-safe-zones-2026`
- `/tiktok/topview-character-limits`
- `/tiktok/branded-effect-safe-zones`
- `/tiktok/caption-truncation-2200-character`
- `/tiktok/cta-overlay-safe-zone`
- `/tiktok/username-overlay-safe-zone`
- `/tiktok/side-panel-icon-safe-zone`
- `/tiktok/portrait-9-16-safe-zones`
- `/tiktok/shop-ads-character-limits`

**Cross-platform / utility**
- `/guides/why-ads-get-truncated`
- `/guides/safe-zone-vs-character-limit`
- `/guides/2026-platform-spec-changes`
- `/compare/meta-vs-tiktok-character-limits`
- `/compare/instagram-reels-vs-tiktok-feed`
- `/glossary/safe-zone`
- `/glossary/primary-text`
- `/glossary/cta-truncation`

Every pSEO page MUST contain: a unique 250–400 word lede, an embedded simulator preset (deep-link via the share-state encoder), a FAQ block (3–5 Q/A) with `FAQPage` JSON-LD, the relevant fields from `platform-specs.ts` rendered as a table, and a `lastVerified` timestamp.

### Generated routes (3)
- `/sitemap.xml` (Next.js `sitemap.ts` walks `pseo-index.ts` + static list)
- `/robots.txt`
- `/llms.txt` and `/llms-full.txt` (see Part F)

### OG image route (1)
- `/api/og?s=...` — Edge runtime, renders 1200×630 PNG of the simulated phone with the user's actual copy. This is what makes share links go viral.

---

## Part F — SEO, GEO, and LLM-discovery

### Standard SEO
- Per-page `<title>`, `<meta description>`, canonical, OpenGraph, Twitter card.
- `app/sitemap.ts` enumerates every static + pSEO route.
- `app/robots.ts` allows everything except `/api/`.
- Internal linking: every pSEO page links to 2–3 sibling pSEO pages (related-placements component).

### GEO (Generative Engine Optimization)
- Each pSEO page emits `JSON-LD` for `Article`, `FAQPage`, and `HowTo` (when applicable).
- Specs rendered as `<table>` with semantic headers — easier for retrieval pipelines to extract.
- Authoritative-style writing: declarative facts, dates, numeric limits with citations to the platform's docs (`sourceUrl` from `platform-specs.ts`).
- Author + publisher schema on every page.

### `llms.txt`
- Short index file at `/llms.txt` per the [llms.txt convention](https://llmstxt.org/): site description, primary URLs, key endpoints (the simulator, embed page, sitemap).

### `llms-full.txt`
- Concatenated full content of every pSEO page in plain text/markdown, generated at build time from MDX files plus `platform-specs.ts`. Implementation: a route handler that streams the assembled markdown.

### Social proof / share links
- The "Copy share link" button writes the encoded state into `?s=<lz-compressed-base64>` on the homepage URL. **No backend.**
- Visiting any URL with `?s=...` rehydrates the simulator state on first paint (`useSearchParams` + `decode()` in a Server Component for SSR, then hydrates).
- The OG image at `/api/og?s=...` shows the user's actual ad copy on a phone preview, so when they paste the link in Slack/Twitter/LinkedIn the unfurled card is the simulator output. **This is the viral loop.**

---

## Part G — Embed (iframe) Strategy

- `/embed` (snippet generator, public) — users build an embed code with platform/placement preset and a copy-paste `<iframe>` snippet.
- `/embed/render?s=...` — the iframe target. Bare-chrome simulator, no ads, no nav, no footer. CSP `frame-ancestors *` (revisit if anti-abuse becomes an issue). PostMessages to parent for resize and state changes.
- "Powered by CaptionSnap →" link in the bottom-right for backlinks.
- Same `<Simulator />` component with `embedded` prop.

---

## Part H — Analytics, Ads, Privacy

### Analytics
- `@vercel/analytics` `<Analytics />` in `app/layout.tsx`.
- Microsoft Clarity script in `app/layout.tsx`, gated by `NEXT_PUBLIC_CLARITY_ID`.
- Custom events via `lib/analytics.ts`: `simulator_run`, `share_link_copied`, `embed_snippet_copied`, `pseo_view`, `platform_switched`.

### Ads
- `<MediaVineSlot id="..." />` component renders nothing while `NEXT_PUBLIC_ADS_ENABLED=false`. After MediaVine Journey approval, flip the flag and drop in their script tag.
- Slot positions: home (below-fold), pSEO pages (after lede + after FAQ), about page (sidebar).
- **No ads on the embed render page** (would harm partner trust and breach MediaVine's policy).

### Privacy / consent
- Privacy page lists analytics + ads.
- Consent banner: skip for v1 (US-first audience, no PII collected, no auth). Add an EU consent banner before any paid EU traffic acquisition.

---

## Part I — Build Phases

### Phase 1: Skeleton (day 1)
- `create-next-app` with TypeScript, Tailwind, App Router.
- shadcn init, fonts wired (DM Sans).
- Vercel project linked, GitHub repo, Vercel Analytics enabled, Clarity script in layout, env vars set.
- CI: GitHub Action runs `tsc`, `eslint`, `vitest`, `playwright install` + a smoke E2E.

### Phase 2: Simulator MVP (day 2–4)
- `lib/platform-specs.ts` with Meta + TikTok placements (~6 placements at MVP).
- `<Simulator />` with split-screen, phone mockup, truncation, safe-zone overlays, counters.
- Vitest covers `truncate.ts` and counter thresholds against fixture cases.

### Phase 3: Share + OG (day 5–6)
- `lib/share.ts` encode/decode with `lz-string` (URLs <2kB worst case).
- `/api/og` Edge route renders the phone preview as PNG from `?s=`.
- Playwright spec: paste copy → click share → open the resulting URL → assert state matches.

### Phase 4: Embed (day 7)
- `/embed/render` route, `embedded` prop on `<Simulator />`, `postMessage` resize.
- `/embed` snippet generator with live preview iframe + copy-snippet button.

### Phase 5: pSEO content (day 8–12)
- `data/pseo-index.ts` registry.
- 30 MDX pages to start; expand to 60 across week 2.
- Each page: lede, embedded preset, FAQ JSON-LD, related-pages, table, `lastVerified`.

### Phase 6: SEO surface (day 13)
- `sitemap.ts`, `robots.ts`, `/llms.txt`, `/llms-full.txt`.
- About, Privacy, Terms pages.

### Phase 7: Ads + launch polish (day 14)
- `<MediaVineSlot />` component, feature flag, slot positions.
- Apply for MediaVine Journey.
- Submit sitemap to Google Search Console + Bing Webmaster.
- Distribution per Part B (one channel at a time, log responses in `docs/internal/distribution-log.md`).

### Phase 8 (later): Chrome extension
- Wrap the simulator as a side-panel extension using existing components.
- Manifest V3, side panel API, reuse `lib/share.ts` so pasting copy in the extension can deep-link to the site.
- Ship after the site is generating ad revenue — not part of MVP.

---

## Part J — Critical Files

| File                                | Why it matters                                       |
|-------------------------------------|------------------------------------------------------|
| `lib/platform-specs.ts`             | Single source of truth for all limits + safe zones   |
| `lib/share.ts`                      | URL encoding — must round-trip cleanly               |
| `lib/truncate.ts`                   | Per-platform truncation rules; covered by Vitest     |
| `components/simulator/SafeZoneCanvas.tsx` | The visual core; render correctness lives here |
| `app/api/og/route.tsx`              | Determines what link unfurls look like (viral loop)  |
| `app/embed/render/page.tsx`         | Determines partner trust + backlink quality          |
| `data/pseo-index.ts`                | Drives sitemap, nav, llms-full.txt, related-pages    |
| `app/llms-full.txt/route.ts`        | LLM-discovery payload; assembled at request time     |

---

## Part K — Verification

Before declaring the MVP shippable:

### Unit tests (`pnpm test`)
- `truncate.ts`: every placement in `platform-specs.ts` truncates at the documented index for inputs of length `max-1`, `max`, `max+1`, `max*10`.
- Counters: green below `warnAt`, yellow between `warnAt` and `max`, red above `max`.
- `share.ts`: `decode(encode(x)) === x` for 50 fuzzed states.

### E2E tests (`pnpm playwright test`)
- Type ad copy → click "Copy share link" → open the copied URL in a new context → assert the simulator renders identical state.
- Switch platform → confirm safe-zone overlay positions move to spec-defined coordinates within ±1px.
- Visit `/embed/render?s=...` inside an iframe in a test page → assert no header/footer/ads and `postMessage` resize fires.
- Visit 3 random pSEO pages → assert FAQ JSON-LD parses, simulator preset loads, `lastVerified` date renders.

### Manual QA (record in `docs/internal/launch-checklist.md`)
- Open the share-link OG image URL on Twitter/X, LinkedIn, Slack — confirm unfurl shows the phone preview with user's copy.
- Lighthouse: ≥95 Performance, ≥95 SEO, ≥95 Accessibility on home and a pSEO page.
- Verify Clarity is recording sessions on staging.
- Verify Vercel Analytics shows pageviews + custom events.
- `curl https://captionsnap.io/llms.txt` and `…/llms-full.txt` return 200 with correct content-type.
- `curl https://captionsnap.io/sitemap.xml` enumerates every pSEO + static URL.
- Confirm `<MediaVineSlot />` renders an empty placeholder when `NEXT_PUBLIC_ADS_ENABLED=false`, and a slot when `=true`.

---

## Out of scope (explicit non-goals for v1)

- User accounts, login, dashboards.
- Database, KV, persistent storage of any kind.
- Email collection, newsletter, contact form.
- Live ad delivery (slots wired only).
- Chrome extension (post-MVP).
- Additional platforms (LinkedIn, X, Pinterest, Snapchat) — wait for traffic data.
- Paid tier — v1 is fully free, ad-supported.
