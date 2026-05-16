import { cookies } from "next/headers";
import { customerPortalUrl, validateLicense } from "@/lib/lemonsqueezy";
import { LICENSE_COOKIE_NAME, verifyLicenseCookie } from "@/lib/license";

export const runtime = "nodejs";

// Self-service billing. We resolve the LemonSqueezy customer id by validating
// the cookie's license against its bound instance, then hand back the
// LS-hosted customer portal URL (update card, cancel). No card data touches us.

export async function POST() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LICENSE_COOKIE_NAME)?.value;
  const cookiePayload = await verifyLicenseCookie(raw);
  if (!cookiePayload) {
    return Response.json({ error: "no_customer" }, { status: 401 });
  }

  const result = await validateLicense(cookiePayload.key, cookiePayload.iid);
  if (!result.valid || !result.customerId) {
    return Response.json({ error: "license_invalid" }, { status: 403 });
  }

  const url = await customerPortalUrl(result.customerId);
  if (!url) {
    return Response.json({ error: "portal_unavailable" }, { status: 502 });
  }
  return Response.json({ url });
}
