import { NextRequest } from "next/server";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { sendLicenseEmail } from "@/lib/email";

export const runtime = "nodejs";

// LemonSqueezy webhook. The only event we act on is `license_key_created`:
// we email the buyer their key + an activation link. Everything else is
// logged — entitlement is re-derived live from LS on every license refresh
// (see /api/license/verify), so we never need to persist subscription state.
//
// Signature is verified against the RAW body before any parsing. An invalid
// signature is a hard 401 — we do not leak why.

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("X-Signature");

  if (!(await verifyWebhookSignature(raw, sig))) {
    return new Response("invalid_signature", { status: 401 });
  }

  let event: {
    meta?: { event_name?: string };
    data?: {
      attributes?: {
        key?: string;
        user_email?: string;
        status?: string;
      };
    };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("bad_json", { status: 400 });
  }

  const name = event.meta?.event_name;

  if (name === "license_key_created") {
    const key = event.data?.attributes?.key;
    const email = event.data?.attributes?.user_email;
    if (key && email) {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
      const activateUrl = `${baseUrl}/account?key=${encodeURIComponent(key)}`;
      const sent = await sendLicenseEmail({ to: email, licenseKey: key, activateUrl });
      console.log(`[ls-webhook] license_key_created email_sent=${sent}`);
    } else {
      console.warn("[ls-webhook] license_key_created missing key/email");
    }
  } else if (
    name === "subscription_created" ||
    name === "subscription_updated" ||
    name === "subscription_cancelled" ||
    name === "subscription_expired"
  ) {
    console.log(`[ls-webhook] ${name} status=${event.data?.attributes?.status}`);
  }

  return Response.json({ received: true });
}
