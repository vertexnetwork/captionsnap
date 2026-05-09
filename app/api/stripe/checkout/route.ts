import { NextRequest } from "next/server";
import { getStripe, isPlan, PRICE_IDS } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_PRO_ENABLED !== "true") {
    return Response.json({ error: "pro_disabled" }, { status: 403 });
  }

  let body: { plan?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  if (!isPlan(body.plan)) {
    return Response.json({ error: "invalid_plan" }, { status: 400 });
  }

  const priceId = body.plan === "monthly" ? PRICE_IDS.monthly() : PRICE_IDS.annual();
  if (!priceId) {
    return Response.json({ error: "price_not_configured" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/api/stripe/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing?canceled=1`,
    allow_promotion_codes: true,
    customer_email: typeof body.email === "string" ? body.email : undefined,
    metadata: { plan: body.plan },
    subscription_data: { metadata: { plan: body.plan } },
  });

  if (!session.url) {
    return Response.json({ error: "no_session_url" }, { status: 500 });
  }

  return Response.json({ url: session.url });
}
