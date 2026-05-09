// Single source of truth for "is the Chrome extension live?" state.
// Set NEXT_PUBLIC_CHROME_WEBSTORE_URL to the Web Store listing URL once
// approval lands — site CTAs (home, about, /extension) will flip from
// "coming soon" to install links automatically.

export const CHROME_WEBSTORE_URL =
  process.env.NEXT_PUBLIC_CHROME_WEBSTORE_URL ?? null;

export const EXTENSION_AVAILABLE = CHROME_WEBSTORE_URL !== null;
