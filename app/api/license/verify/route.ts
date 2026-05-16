import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { validateLicense } from "@/lib/lemonsqueezy";
import {
  LICENSE_COOKIE_NAME,
  signLicense,
  verifyLicense,
  verifyLicenseCookie,
} from "@/lib/license";

export const runtime = "nodejs";

// Resolves Pro status by:
//   1. Trying to verify the bearer token (if client passed one) — fast path,
//      good for up to 1h, then forced back through LS.
//   2. Falling back to the signed HTTP-only license cookie + a live
//      LemonSqueezy validate call — slow path, the source of truth.
//
// Because the bearer TTL is short and the slow path always re-checks LS, a
// cancelled/disabled key loses access within the hour regardless of any
// cached token.

export async function POST(req: NextRequest) {
  let body: { token?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    // empty body is fine
  }

  // Fast path: existing token still valid and unexpired.
  if (typeof body.token === "string" && body.token.length > 0) {
    const verified = await verifyLicense(body.token);
    if (verified) {
      return Response.json({
        active: true,
        token: body.token,
        exp: verified.exp,
        cid: verified.cid,
        email: verified.email,
      });
    }
  }

  // Slow path: re-derive from the cookie via LemonSqueezy.
  const cookieStore = await cookies();
  const cookieRaw = cookieStore.get(LICENSE_COOKIE_NAME)?.value;
  const cookiePayload = await verifyLicenseCookie(cookieRaw);
  if (!cookiePayload) {
    return Response.json({ active: false, reason: "no_cookie" });
  }

  const result = await validateLicense(cookiePayload.key, cookiePayload.iid);
  if (!result.valid) {
    return Response.json({
      active: false,
      reason: result.status ? `license_${result.status}` : "license_invalid",
    });
  }

  const token = await signLicense({
    cid: result.customerId ?? "",
    sid: cookiePayload.iid,
    email: result.email,
  });

  return Response.json({
    active: true,
    token,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    cid: result.customerId,
    email: result.email,
  });
}
