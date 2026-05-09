// HMAC-signed tokens for two purposes:
//
//  1. **License token** (`signLicense` / `verifyLicense`) — short-lived (24h),
//     stored in localStorage, claims `{cid, sid, email}`. Granted by
//     /api/license/verify after confirming the Stripe subscription is active.
//     Treats Pro status as a bearer claim.
//
//  2. **Customer cookie** (`signCustomerCookie` / `verifyCustomerCookie`) —
//     long-lived (1y), HTTP-only, claims only `{cid}`. Used so /account and
//     /api/stripe/portal can identify the returning customer for self-service
//     management without auth UI. Re-issuing a license still requires hitting
//     Stripe to confirm subscription status.
//
// No JWT lib — we only support HS256 and don't need a header. Token shape:
// `${base64url(payload)}.${base64url(signature)}`. Edge-compatible (Web Crypto only).

export type LicensePayload = {
  /** Stripe customer ID */
  cid: string;
  /** Stripe subscription ID */
  sid: string;
  /** Unix timestamp (seconds) when this token expires */
  exp: number;
  /** Customer email — surfaced on /account for recovery context */
  email?: string;
};

export type CustomerCookiePayload = {
  cid: string;
  exp: number;
};

const LICENSE_TTL_SECONDS = 24 * 60 * 60; // 24 hours
const COOKIE_TTL_SECONDS = 365 * 24 * 60 * 60; // 1 year

function getSecret(): string {
  const secret = process.env.LICENSE_HMAC_SECRET;
  if (!secret) {
    throw new Error("LICENSE_HMAC_SECRET is not set");
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array<ArrayBuffer> {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const buf = new ArrayBuffer(bin.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signJson(json: string): Promise<string> {
  const payloadBytes = new TextEncoder().encode(json);
  const payloadB64 = toBase64Url(payloadBytes);
  const key = await importKey(getSecret());
  const sigBuf = await crypto.subtle.sign("HMAC", key, payloadBytes);
  const sigB64 = toBase64Url(new Uint8Array(sigBuf));
  return `${payloadB64}.${sigB64}`;
}

/** Returns the raw JSON string if signature verifies, else null. Does NOT
 *  enforce expiry — caller is responsible. */
async function verifyJson(token: string): Promise<string | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts as [string, string];
  let payloadBytes: Uint8Array<ArrayBuffer>;
  let sigBytes: Uint8Array<ArrayBuffer>;
  try {
    payloadBytes = fromBase64Url(payloadB64);
    sigBytes = fromBase64Url(sigB64);
  } catch {
    return null;
  }
  let key: CryptoKey;
  try {
    key = await importKey(getSecret());
  } catch {
    return null;
  }
  let ok = false;
  try {
    ok = await crypto.subtle.verify("HMAC", key, sigBytes, payloadBytes);
  } catch {
    return null;
  }
  if (!ok) return null;
  return new TextDecoder().decode(payloadBytes);
}

// ───────────────────── License tokens (24h) ─────────────────────

export async function signLicense(
  payload: Omit<LicensePayload, "exp">,
  ttlSeconds: number = LICENSE_TTL_SECONDS,
): Promise<string> {
  const full: LicensePayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  return signJson(JSON.stringify(full));
}

/** Returns the decoded payload if the token is valid AND unexpired.
 *  Returns null on any failure (bad format, bad signature, expired). */
export async function verifyLicense(token: string): Promise<LicensePayload | null> {
  const json = await verifyJson(token);
  if (json === null) return null;
  let parsed: LicensePayload;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  if (typeof parsed.cid !== "string" || typeof parsed.sid !== "string") return null;
  if (typeof parsed.exp !== "number") return null;
  if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
  return parsed;
}

/** True if the token is within `staleSeconds` of expiry — caller should refresh. */
export function isStale(payload: LicensePayload, staleSeconds: number = 60 * 60): boolean {
  return payload.exp - Math.floor(Date.now() / 1000) < staleSeconds;
}

// ───────────────────── Customer cookie (1y) ─────────────────────

export async function signCustomerCookie(
  cid: string,
  ttlSeconds: number = COOKIE_TTL_SECONDS,
): Promise<string> {
  const full: CustomerCookiePayload = {
    cid,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  return signJson(JSON.stringify(full));
}

export async function verifyCustomerCookie(
  token: string | undefined | null,
): Promise<CustomerCookiePayload | null> {
  if (!token) return null;
  const json = await verifyJson(token);
  if (json === null) return null;
  let parsed: CustomerCookiePayload;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  if (typeof parsed.cid !== "string") return null;
  if (typeof parsed.exp !== "number") return null;
  if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
  return parsed;
}

export const CUSTOMER_COOKIE_NAME = "cs_cid";
