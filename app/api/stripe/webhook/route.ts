import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

// We don't act on webhook events — /api/license/verify reads Stripe truth
// directly on each refresh, so subscriptions become inactive within 24h
// of cancellation regardless of webhook delivery. The webhook exists so
// Stripe stops complaining at us, and so we can log delivery for debugging.

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("webhook_secret_not_configured", { status: 500 });
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response("missing_signature", { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    return new Response(
      `signature_verification_failed: ${(err as Error).message}`,
      { status: 400 },
    );
  }

  // Light logging — full state is owned by Stripe.
  if (
    event.type === "checkout.session.completed" ||
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    console.log(`[stripe-webhook] ${event.type} id=${event.id}`);
  }

  return Response.json({ received: true });
}
