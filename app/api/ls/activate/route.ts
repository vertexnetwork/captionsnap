import { NextRequest, NextResponse } from "next/server";
import { activateLicense } from "@/lib/lemonsqueezy";
import {
  LICENSE_COOKIE_NAME,
  signLicense,
  signLicenseCookie,
} from "@/lib/license";

export const runtime = "nodejs";

// Binds a license key to THIS browser by activating a new LemonSqueezy
// instance. LS enforces the per-key activation limit here — over the limit,
// LS returns activated:false and we surface it. On success we set the signed
// HTTP-only license cookie and return a short-lived bearer token.

export async function POST(req: NextRequest) {
  let body: { key?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const key = typeof body.key === "string" ? body.key.trim() : "";
  if (!key) {
    return Response.json({ error: "missing_key" }, { status: 400 });
  }

  const instanceName = `captionsnap-${crypto.randomUUID()}`;
  const result = await activateLicense(key, instanceName);

  if (!result.activated || !result.instanceId) {
    // LS error strings are safe to forward (e.g. activation limit reached,
    // license not found, expired). They are not secret.
    return Response.json(
      { active: false, error: result.error ?? "activation_failed" },
      { status: 403 },
    );
  }

  const cookieValue = await signLicenseCookie({
    key,
    iid: result.instanceId,
  });
  const token = await signLicense({
    cid: result.customerId ?? "",
    sid: result.instanceId,
    email: result.email,
  });

  const res = NextResponse.json({
    active: true,
    token,
    cid: result.customerId,
    email: result.email,
  });
  res.cookies.set(LICENSE_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
  });
  return res;
}
