import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { CUSTOMER_COOKIE_NAME, signCustomerCookie } from "@/lib/license";

export const runtime = "nodejs";

// Stripe Checkout success_url lands here. We:
//   1. Validate the Stripe session
//   2. Set a long-lived signed cookie (cs_cid) tying this browser to the
//      Stripe customer
//   3. Redirect to /account?welcome=1 — the client then calls
//      /api/license/verify to mint a fresh license token from the cookie
//
// We deliberately do NOT pass the token via URL — only the customer cookie
// crosses the redirect, and the cookie is HTTP-only + signed.

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;

  if (!sessionId) {
    return NextResponse.redirect(`${baseUrl}/pricing?error=missing_session`);
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.redirect(`${baseUrl}/pricing?error=session_lookup_failed`);
  }

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (!customerId) {
    return NextResponse.redirect(`${baseUrl}/pricing?error=no_customer`);
  }

  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    return NextResponse.redirect(`${baseUrl}/pricing?error=payment_incomplete`);
  }

  const cookieValue = await signCustomerCookie(customerId);

  const response = NextResponse.redirect(`${baseUrl}/account?welcome=1`);
  response.cookies.set(CUSTOMER_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
  });
  return response;
}
