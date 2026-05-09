import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Lazy singleton — avoids exploding at import time if STRIPE_SECRET_KEY
 *  is not set (e.g. in non-Pro environments or unit tests). */
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  _stripe = new Stripe(key);
  return _stripe;
}

export const PRICE_IDS = {
  monthly: () => process.env.STRIPE_PRICE_ID_MONTHLY ?? "",
  annual: () => process.env.STRIPE_PRICE_ID_ANNUAL ?? "",
};

export type Plan = "monthly" | "annual";

export function isPlan(value: unknown): value is Plan {
  return value === "monthly" || value === "annual";
}
