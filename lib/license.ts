// HMAC-signed tokens for two purposes:
//
//  1. **License token** (`signLicense` / `verifyLicense`) — SHORT-lived (1h),
//     stored in localStorage, claims `{cid, sid, jti, email}`. Granted by
//     /api/license/verify only after LemonSqueezy confirms the license key +
//     bound instance is still valid. A short TTL is the security trade: a
//     leaked bearer token is useless within an hour, and every refresh
//     re-checks LS (so cancellation/disable propagates fast). `jti` makes
//     every issued token unique (audit / future revocation).
//
//  2. **License cookie** (`signLicenseCookie` / `verifyLicenseCookie`) —
//     long-lived (1y), HTTP-only, Secure, SameSite=Lax. Claims `{key, iid}`:
//     the LemonSqueezy license key and the activated instance id bound to
//     THIS browser. Server-only — never exposed to client JS. Refreshing a
//     license token still requires LS to confirm the instance is valid, so
//     possession of the cookie alone is not a durable entitlement.
//
// No JWT lib — we only support HS256 and don't need a header. Token shape:
// `${base64url(payload)}.${base64url(signature)}`. Edge-compatible (Web Crypto only).

export type LicensePayload = {
  /** LemonSqueezy customer ID */
  cid: string;
  /** LemonSqueezy license instance ID bound to this device */
  sid: string;
  /** Unique token id — makes each issued token distinct */
  jti: string;
  /** Unix timestamp (seconds) when this token expires */
  exp: number;
  /** Customer email — surfaced on /account for recovery context */
  email?: string;
};

export type LicenseCookiePayload = {
  /** LemonSqueezy license key */
  key: string;
  /** LemonSqueezy instance id this browser activated */
  iid: string;
  exp: number;
};

const LICENSE_TTL_SECONDS = 60 * 60; // 1 hour — short by design (see header)
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

// ───────────────────── License tokens (1h) ─────────────────────

export async function signLicense(
  payload: Omit<LicensePayload, "exp" | "jti">,
  ttlSeconds: number = LICENSE_TTL_SECONDS,
): Promise<string> {
  const full: LicensePayload = {
    ...payload,
    jti: crypto.randomUUID(),
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
  if (typeof parsed.jti !== "string") return null;
  if (typeof parsed.exp !== "number") return null;
  if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
  return parsed;
}

/** True if the token is within `staleSeconds` of expiry — caller should refresh. */
export function isStale(payload: LicensePayload, staleSeconds: number = 60 * 60): boolean {
  return payload.exp - Math.floor(Date.now() / 1000) < staleSeconds;
}

// ───────────────────── License cookie (1y, HTTP-only) ─────────────────────

export async function signLicenseCookie(
  payload: Omit<LicenseCookiePayload, "exp">,
  ttlSeconds: number = COOKIE_TTL_SECONDS,
): Promise<string> {
  const full: LicenseCookiePayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  return signJson(JSON.stringify(full));
}

export async function verifyLicenseCookie(
  token: string | undefined | null,
): Promise<LicenseCookiePayload | null> {
  if (!token) return null;
  const json = await verifyJson(token);
  if (json === null) return null;
  let parsed: LicenseCookiePayload;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  if (typeof parsed.key !== "string" || typeof parsed.iid !== "string") return null;
  if (typeof parsed.exp !== "number") return null;
  if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
  return parsed;
}

export const LICENSE_COOKIE_NAME = "cs_lic";
