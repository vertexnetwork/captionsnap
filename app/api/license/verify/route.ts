import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";
import {
  CUSTOMER_COOKIE_NAME,
  signLicense,
  verifyCustomerCookie,
  verifyLicense,
} from "@/lib/license";

export const runtime = "nodejs";

// Resolves Pro status by:
//   1. Trying to verify the bearer token (if client passed one) — fast path.
//   2. Falling back to the customer cookie + a Stripe API call — slow path.
// Always returns a fresh token when status is active.

export async function POST(req: NextRequest) {
  let body: { token?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    // empty body is fine
  }

  // Fast path: existing token still valid.
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

  // Slow path: refresh from cookie + Stripe.
  const cookieStore = await cookies();
  const cookieRaw = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  const cookiePayload = await verifyCustomerCookie(cookieRaw);
  if (!cookiePayload) {
    return Response.json({ active: false, reason: "no_cookie" });
  }

  const stripe = getStripe();
  let subs: Awaited<ReturnType<typeof stripe.subscriptions.list>>;
  try {
    subs = await stripe.subscriptions.list({
      customer: cookiePayload.cid,
      status: "all",
      limit: 5,
    });
  } catch {
    return Response.json({ active: false, reason: "stripe_lookup_failed" });
  }

  const active = subs.data.find(
    (s) => s.status === "active" || s.status === "trialing",
  );
  if (!active) {
    return Response.json({ active: false, reason: "no_active_subscription" });
  }

  let email: string | undefined;
  try {
    const customer = await stripe.customers.retrieve(cookiePayload.cid);
    if (customer && !customer.deleted) {
      email = customer.email ?? undefined;
    }
  } catch {
    // non-fatal
  }

  const token = await signLicense({
    cid: cookiePayload.cid,
    sid: active.id,
    email,
  });

  return Response.json({
    active: true,
    token,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    cid: cookiePayload.cid,
    email,
  });
}
