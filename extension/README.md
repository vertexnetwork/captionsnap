# CaptionSnap Chrome Extension

Popup-only mini simulator. Funnels back to captionsnap.io and surfaces a
featured affiliate one-liner. No host permissions, no content scripts,
no API calls — fully offline, MV3-clean, designed to survive Chrome
policy changes with zero ongoing maintenance.

## Architecture

- **Preact + Preact hooks** (~3 KB gzipped runtime).
- **esbuild** for bundling. No Vite, no Webpack.
- **Hand-rolled CSS** matching the site theme tokens.
- **Reuses `lib/platform-specs.ts`, `lib/truncate.ts`, `lib/share.ts`** verbatim from the
  Next.js app via `@root/*` tsconfig paths. One source of truth for placement
  data and truncation logic across web + extension.
- **Reuses `data/affiliates.ts`** so a featured-affiliate URL change updates
  the popup on the next build with no extension-specific code edit.

## Local development

```bash
# from the repo root
npm run dev:extension       # esbuild watch mode → extension/dist/
```

Then in Chrome:

1. Open `chrome://extensions`.
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked** → select `extension/dist/`.
4. Click the CaptionSnap icon in the toolbar to open the popup.

`dev:extension` rebuilds on save and refreshes the static assets.
Reload the extension in `chrome://extensions` after each change to pick
up the new bundle (Chrome does not hot-reload popups).

## Production build

```bash
npm run build:extension     # minified, no sourcemap → extension/dist/
```

To submit to the Chrome Web Store:

```bash
# zip the dist directory (PowerShell)
Compress-Archive -Path extension/dist/* -DestinationPath captionsnap-extension.zip
```

Upload `captionsnap-extension.zip` at <https://chrome.google.com/webstore/devconsole>.

## Web Store submission checklist

Before the first submission you need to add:

- **Icons** (PNG, transparent background) at sizes 16, 32, 48, 128. Place
  them at `extension/assets/icon-{size}.png` and add an `icons` entry to
  `manifest.json`:
  ```json
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
  ```
  Update `build.mjs` to copy the `assets/` folder to `dist/icons/`.
- **Promotional tile** (440 × 280 PNG) — required for the listing.
- **Screenshots** (1280 × 800 PNG, up to 5) — show the popup in use.
- **Privacy policy URL**: `https://captionsnap.io/privacy` (already lives on the site).
- **Single-purpose description**: the popup mirrors the captionsnap.io
  simulator. Reviewers reject extensions that bundle unrelated features —
  the manifest's `description` field is intentionally narrow.

## What the popup does NOT do

- No content scripts (no `host_permissions`). Reviewers approve faster.
- No tab/cookie/storage permissions. Future state could add `storage` to
  persist the last-used placement, but v1 keeps the permission set empty.
- No telemetry SDK. Outbound URLs (deeplink + affiliate) carry
  `utm_source=chrome-extension&utm_medium=popup` so attribution lands
  in Vercel Analytics on the website without an extension-side tracker.

## Updating the affiliate one-liner

Edit `data/affiliates.ts` at the repo root and set `featured: true` on the
entry you want surfaced. Rebuild — the popup picks it up. If no entry is
flagged featured, the footer falls back to a CaptionSnap about link.
