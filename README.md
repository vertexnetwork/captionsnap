# CaptionSnap

Free ad-copy truncation simulator covering 8 platforms (Meta, TikTok, LinkedIn, X,
YouTube, Pinterest, Reddit, Snapchat) and 55 placements. Paste your copy, see
exactly where each platform clips it and which UI overlays (CTAs, captions,
profile rows) cover your hook. Stateless: the URL is the database.

Live at [captionsnap.io](https://captionsnap.io).

## Architecture (Muse principles)

- **No accounts, no database, no server-side state.** Share-link state is
  lz-string-encoded into the URL via [lib/share.ts](lib/share.ts). Pro
  subscriptions are an HMAC-signed bearer token tied to a Stripe customer ID —
  Stripe is the database.
- **Hard ceiling: <4 hours/week of maintenance.** Every architectural decision
  is filtered against that. No newsletter, no community, no live spec scraping,
  no AI commodity layer. See the binding kill list in
  [the plan file](https://github.com/ThatMovieGuyOriginal/captionsnap/blob/main/PLAN.md)
  if available, or the in-tree decisions documented inline.
- **Single source of truth.** Platform specs ([lib/platform-specs.ts](lib/platform-specs.ts)),
  truncation logic ([lib/truncate.ts](lib/truncate.ts)), and share encoding
  ([lib/share.ts](lib/share.ts)) are reused verbatim across the website, Chrome
  extension, and any future surfaces. Re-verify a placement once → every surface
  picks it up on next deploy.

## Tech stack

- **Next.js 16.2** (App Router, Turbopack, MDX, edge + node runtimes)
- **React 19.2**, **TypeScript 5** (strict, `noUncheckedIndexedAccess` in extension)
- **Tailwind CSS 4** (zero-config, theme tokens in
  [app/globals.css](app/globals.css))
- **Stripe** (subscriptions, Customer Portal, webhooks)
- **html-to-image** (PNG export, Pro feature)
- **Preact + esbuild** (Chrome extension popup, ~48 KB minified)
- **Vitest** (unit), **Playwright** (e2e)
- **Vercel Analytics** (cookieless), **Microsoft Clarity** (consent-gated)

## Quickstart

```bash
git clone <this repo>
cd captionsnap
npm install

cp .env.example .env.local
# fill in env vars — see "Environment variables" below

npm run dev
# open http://localhost:3000
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Production server (after `build`) |
| `npm run lint` | ESLint across the project (excludes `extension/`) |
| `npm run typecheck` | `tsc --noEmit` for the Next.js app |
| `npm run test` | Vitest unit tests (`tests/unit/*`) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright e2e (`tests/e2e/*`) — needs a running dev server |
| `npm run format` | Prettier write |
| `npm run build:extension` | Build the Chrome extension to `extension/dist/` |
| `npm run dev:extension` | Watch-mode extension build |

## Environment variables

All env vars are listed in [.env.example](.env.example). Copy that file to
`.env.local` for local development; populate equivalents in the Vercel
dashboard for preview + production environments. **`LICENSE_HMAC_SECRET` must
be identical across all environments** — a license token signed in preview
must verify in production.

### Public (exposed to the browser)

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin used in `metadataBase`, OG image URLs, sitemap, llms.txt, and Stripe redirect URLs. No trailing slash. | `https://captionsnap.io` |
| `NEXT_PUBLIC_CLARITY_ID` | optional | Microsoft Clarity project ID. When set, Clarity loads only after the user accepts cookies via the consent banner. Leave empty to disable Clarity entirely. | `xxxxxxxxxx` |
| `NEXT_PUBLIC_PRO_ENABLED` | optional | Master switch for the Pro tier. When `false`, `/pricing` renders a "coming soon" state and Stripe Checkout returns 403. Used as the kill switch — flipping to `false` doesn't invalidate existing subscribers' tokens. | `false` (default) / `true` |
| `NEXT_PUBLIC_CHROME_WEBSTORE_URL` | optional | Web Store listing URL for the extension. When set, `/extension` renders an "Install for Chrome →" CTA; when unset, renders a "Coming soon" state. | `https://chromewebstore.google.com/detail/...` |

### Server-only (Stripe + license signing)

| Variable | Required when | Description | Where to get it |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | Pro tier live | Stripe server SDK auth. Use `sk_test_...` for dev, `sk_live_...` for prod. | [Stripe dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Pro tier live | Verifies `stripe-signature` header on `/api/stripe/webhook`. One per webhook endpoint. | Stripe dashboard → Developers → Webhooks → click endpoint → Signing secret |
| `STRIPE_PRICE_ID_MONTHLY` | Pro tier live | Recurring price ID for the $49/mo plan. | Stripe dashboard → Products → CaptionSnap Pro → Monthly price |
| `STRIPE_PRICE_ID_ANNUAL` | Pro tier live | Recurring price ID for the $499/yr plan (15% off). | Stripe dashboard → Products → CaptionSnap Pro → Annual price |
| `LICENSE_HMAC_SECRET` | always (when Pro is on) | 32+ bytes of randomness used to HMAC-sign license tokens (24h TTL) and customer cookies (1y TTL). Must be identical across all environments — preview-signed tokens won't verify in prod otherwise. | Generate locally: `openssl rand -hex 32` or `node -e "console.log(crypto.randomBytes(32).toString('hex'))"` |

### Setting env vars on Vercel

1. Project → Settings → Environment Variables
2. For each variable, add it for **Production**, **Preview**, and (optionally)
   **Development**.
3. **`LICENSE_HMAC_SECRET`** must use the **same value** across all three
   environments (otherwise tokens minted in one won't verify in another).
4. Redeploy after changing env vars.

### Stripe webhook setup

1. In the Stripe dashboard: **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://captionsnap.io/api/stripe/webhook` (or your preview
   URL for testing).
3. Events to listen for (lightweight — we don't act on these, but Stripe
   complains if no endpoint is configured):
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Test delivery: `stripe trigger checkout.session.completed` (Stripe CLI).

### Stripe Customer Portal setup

1. Stripe dashboard → **Settings → Customer Portal**.
2. Enable: cancel subscription, update payment method, view invoices.
3. Set the **default redirect URL** to `https://captionsnap.io/account`.
4. Pro tier users access the portal via the **Manage subscription** button on
   `/account`, which calls `/api/stripe/portal` and redirects.

## Pro tier mechanics

The full design is documented inline in [lib/license.ts](lib/license.ts). Quick
overview:

- **Subscription purchase** → Stripe Checkout (`/api/stripe/checkout`) →
  Stripe success URL is `/api/stripe/welcome` → server fetches the session,
  validates it, sets a long-lived signed `cs_cid` HTTP-only cookie tying this
  browser to the Stripe customer, redirects to `/account?welcome=1`.
- **Pro status check** ([components/pro/ProProvider.tsx](components/pro/ProProvider.tsx))
  reads `localStorage['captionsnap-license-v1']` on mount, decodes locally, and
  calls `/api/license/verify` if the token is missing or stale. The verify
  endpoint reissues fresh tokens by hitting Stripe directly using the cookie's
  customer ID.
- **Cancellation** flows through Stripe Customer Portal. We do not act on
  webhook events — the next license-token refresh (≤24h) will see the
  subscription is no longer active and downgrade the user.
- **Recovery on a new device** is automatic via the cookie. If both cookie
  and localStorage are cleared, manual fallback: email
  [hello@captionsnap.io](mailto:hello@captionsnap.io) with the Stripe receipt.

## Project structure

```
app/
├── (marketing)/      # Public marketing routes
│   ├── page.tsx              # Home / simulator
│   ├── about/                # /about
│   ├── account/              # /account (private dashboard, noindex)
│   ├── bulk/                 # /bulk (Pro-gated bulk preview)
│   ├── contact/              # /contact
│   ├── extension/            # /extension (Chrome extension info)
│   ├── pricing/              # /pricing (Pro tier signup)
│   ├── privacy/              # /privacy
│   └── terms/                # /terms
├── (pseo)/[platform]/[slug]  # 100+ pSEO content pages
├── api/
│   ├── og/                   # Dynamic OG image generation (edge)
│   ├── license/verify/       # License-token refresh
│   └── stripe/               # checkout / portal / webhook / welcome
├── embed/                    # Iframe embed for third-party sites
├── layout.tsx                # ConsentProvider + ProProvider wrap
├── llms.txt/route.ts         # LLM-discoverable URL index
├── llms-full.txt/route.ts    # Full content + platform specs (LLM-friendly)
├── robots.ts                 # robots.txt
└── sitemap.ts                # Dynamic sitemap.xml

components/
├── bulk/                     # Bulk-paste UI (Pro)
├── consent/CookieConsent.tsx # Cookie banner + Clarity gate
├── layout/                   # SiteHeader, SiteFooter
├── pro/                      # ProProvider, SubscribeButtons, AccountDashboard
├── pseo/                     # MDX components (FAQ, SpecTable, AffiliateLink, ...)
├── seo/                      # JSON-LD helpers (BreadcrumbList, Article, FAQPage)
└── simulator/                # Simulator + 18 platform-authentic surface renderers

content/pseo/                 # 100+ MDX content files, one per pSEO page
data/
├── affiliates.ts             # Affiliate registry (single source of truth, used by site + extension)
└── pseo-index.ts             # pSEO entry index (slug, title, description, related)

extension/                    # Chrome extension (Preact + esbuild)
├── manifest.json
├── popup.html
├── src/popup.tsx + styles.css
└── build.mjs                 # `npm run build:extension`

lib/
├── analytics.ts              # Vercel Analytics typed events
├── extension.ts              # CHROME_WEBSTORE_URL flag
├── license.ts                # HMAC sign/verify (license + customer cookie)
├── platform-specs.ts         # SOURCE OF TRUTH for placements + safe zones
├── share.ts                  # URL-as-database state encoding
├── stripe.ts                 # Stripe SDK singleton (lazy)
└── truncate.ts               # Grapheme-aware truncation logic

public/
└── og-default.png            # Fallback OG image

tests/
├── unit/                     # Vitest: counter, license, share, seo-coverage, truncate
└── e2e/                      # Playwright: share-and-embed
```

## Testing

```bash
npm run typecheck             # tsc --noEmit
npm run lint                  # ESLint
npm run test                  # Vitest unit (currently 389 tests)
npm run test:e2e              # Playwright (needs running dev server)
```

Unit tests cover:
- Every placement × field combo for truncation behavior
  ([tests/unit/truncate.test.ts](tests/unit/truncate.test.ts))
- License HMAC sign / verify / tamper rejection
  ([tests/unit/license.test.ts](tests/unit/license.test.ts))
- Share-link encode / decode round-trip
- Counter color thresholds
- pSEO ↔ MDX coverage (every entry has matching MDX, no orphans, every
  placement is covered)

## Chrome extension

See [extension/README.md](extension/README.md) for full instructions.
Quickstart:

```bash
npm run dev:extension                # watch mode
# Then in Chrome: chrome://extensions → Developer mode → Load unpacked →
# select extension/dist/
```

Production build: `npm run build:extension` → `extension/dist/`. Zip and
upload to the Chrome Web Store. Submission checklist (icons, screenshots,
promo tile) is in [extension/README.md](extension/README.md).

## Deploy on Vercel

1. Connect the repo to a Vercel project.
2. Set env vars per the table above.
3. Default Next.js build command and output settings work as-is.
4. Enable Vercel Analytics on the project.
5. Add the Stripe webhook endpoint at `https://<your-domain>/api/stripe/webhook`.

## Roadmap & kill rules

The plan and the binding "what NOT to build" list live in
`~/.claude/plans/review-and-audit-our-serene-ripple.md` (or your equivalent).
Summary of permanent kills:

- No Shopify sub-app
- No newsletter / autoresponder list
- No AI caption generator
- No multi-language / i18n
- No mobile native app
- No content-script extension injection
- No public truncation API (until agency demand validates it)
- No Discord / Slack community

These exist to protect the <4hr/week ceiling. Re-evaluate only on hard data
(GSC traffic, Pro MRR thresholds documented in the plan).

## License & contact

This is a private commercial codebase. For spec corrections, embed support,
or partnerships: [hello@captionsnap.io](mailto:hello@captionsnap.io).
