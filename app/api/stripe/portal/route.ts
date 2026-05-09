import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { CUSTOMER_COOKIE_NAME, verifyCustomerCookie } from "@/lib/license";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  const verified = await verifyCustomerCookie(raw);
  if (!verified) {
    return Response.json({ error: "no_customer" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: verified.cid,
    return_url: `${baseUrl}/account`,
  });

  return Response.json({ url: session.url });
}
