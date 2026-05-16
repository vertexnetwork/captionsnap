import { NextRequest } from "next/server";
import { createCheckout, isPlan } from "@/lib/lemonsqueezy";

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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;

  try {
    const url = await createCheckout({
      plan: body.plan,
      email: typeof body.email === "string" ? body.email : undefined,
      // LS does not append params to custom redirects — the key arrives by
      // email. We still send the buyer to /account so they land somewhere
      // sane and see the activation prompt.
      redirectUrl: `${baseUrl}/account?welcome=1`,
    });
    return Response.json({ url });
  } catch (err) {
    const msg = (err as Error).message;
    const status = msg === "variant_not_configured" ? 500 : 502;
    return Response.json({ error: msg }, { status });
  }
}
