// LemonSqueezy is the Merchant of Record — it owns global VAT/sales-tax
// remittance, chargebacks, and the buyer relationship. We hold no card data
// and no customer database. Pro entitlement is proven by a LemonSqueezy
// License Key whose activation limit LS enforces server-side — that is what
// bounds key-sharing without us running a datastore.
//
// The license endpoints (/v1/licenses/*) are intentionally unauthenticated —
// they are keyed by the license itself, so no API secret is exposed to the
// activate/validate paths. Only checkout creation and the customer lookup
// (for the billing portal) use LEMONSQUEEZY_API_KEY.

const API = "https://api.lemonsqueezy.com/v1";

export type Plan = "monthly" | "annual";

export function isPlan(value: unknown): value is Plan {
  return value === "monthly" || value === "annual";
}

export const VARIANT_IDS = {
  monthly: () => process.env.LEMONSQUEEZY_VARIANT_MONTHLY ?? "",
  annual: () => process.env.LEMONSQUEEZY_VARIANT_ANNUAL ?? "",
};

function apiKey(): string {
  const k = process.env.LEMONSQUEEZY_API_KEY;
  if (!k) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  return k;
}

// ───────────────────── Checkout (authenticated) ─────────────────────

/** Creates a hosted checkout and returns its URL. */
export async function createCheckout(opts: {
  plan: Plan;
  email?: string;
  redirectUrl: string;
}): Promise<string> {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) throw new Error("LEMONSQUEEZY_STORE_ID is not set");
  const variantId =
    opts.plan === "monthly" ? VARIANT_IDS.monthly() : VARIANT_IDS.annual();
  if (!variantId) throw new Error("variant_not_configured");

  const res = await fetch(`${API}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: opts.email ? { email: opts.email } : undefined,
          product_options: {
            redirect_url: opts.redirectUrl,
            // Plain English on the LS-hosted receipt page.
            receipt_button_text: "Activate CaptionSnap Pro",
            receipt_thank_you_note:
              "Your license key is in your email. Open it on the device you want Pro on, then paste the key at the activation screen.",
          },
        },
        relationships: {
          store: { data: { type: "stores", id: String(storeId) } },
          variant: { data: { type: "variants", id: String(variantId) } },
        },
      },
    }),
  });

  if (!res.ok) throw new Error(`ls_checkout_failed_${res.status}`);
  const json = (await res.json()) as { data?: { attributes?: { url?: string } } };
  const url = json.data?.attributes?.url;
  if (!url) throw new Error("ls_checkout_no_url");
  return url;
}

// ───────────────────── License keys (unauthenticated) ─────────────────────

export type LicenseStatus =
  | "active"
  | "inactive"
  | "expired"
  | "disabled";

export type ActivateResult = {
  activated: boolean;
  error?: string;
  instanceId?: string;
  status?: LicenseStatus;
  customerId?: string;
  email?: string;
};

/** Activates a key against a new instance. LS rejects with `activated:false`
 *  once the per-key activation limit is hit — this is the anti-sharing gate,
 *  enforced by LemonSqueezy, not by us. */
export async function activateLicense(
  licenseKey: string,
  instanceName: string,
): Promise<ActivateResult> {
  const res = await fetch(`${API}/licenses/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ license_key: licenseKey, instance_name: instanceName }),
  });
  const json = (await res.json().catch(() => ({}))) as {
    activated?: boolean;
    error?: string;
    instance?: { id?: string };
    license_key?: { status?: LicenseStatus };
    meta?: { customer_id?: number | string; customer_email?: string };
  };
  if (!res.ok || !json.activated) {
    return { activated: false, error: json.error ?? `activate_failed_${res.status}` };
  }
  return {
    activated: true,
    instanceId: json.instance?.id,
    status: json.license_key?.status,
    customerId:
      json.meta?.customer_id != null ? String(json.meta.customer_id) : undefined,
    email: json.meta?.customer_email,
  };
}

export type ValidateResult = {
  valid: boolean;
  status?: LicenseStatus;
  customerId?: string;
  email?: string;
};

/** Confirms a key + bound instance is still valid (subscription live, key not
 *  disabled, instance not deactivated). Called on every license refresh. */
export async function validateLicense(
  licenseKey: string,
  instanceId: string,
): Promise<ValidateResult> {
  const res = await fetch(`${API}/licenses/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ license_key: licenseKey, instance_id: instanceId }),
  });
  const json = (await res.json().catch(() => ({}))) as {
    valid?: boolean;
    license_key?: { status?: LicenseStatus };
    meta?: { customer_id?: number | string; customer_email?: string };
  };
  if (!res.ok || !json.valid || json.license_key?.status !== "active") {
    return { valid: false, status: json.license_key?.status };
  }
  return {
    valid: true,
    status: json.license_key?.status,
    customerId:
      json.meta?.customer_id != null ? String(json.meta.customer_id) : undefined,
    email: json.meta?.customer_email,
  };
}

// ───────────────────── Customer portal (authenticated) ─────────────────────

/** Returns the LemonSqueezy-hosted customer portal URL for self-service
 *  billing management (update card, cancel). */
export async function customerPortalUrl(customerId: string): Promise<string | null> {
  const res = await fetch(`${API}/customers/${customerId}`, {
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      Accept: "application/vnd.api+json",
    },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: { attributes?: { urls?: { customer_portal?: string } } };
  };
  return json.data?.attributes?.urls?.customer_portal ?? null;
}

// ───────────────────── Webhook signature ─────────────────────

/** Timing-safe verification of the X-Signature header (hex HMAC-SHA256 of the
 *  raw request body, keyed by LEMONSQUEEZY_WEBHOOK_SECRET). */
export async function verifyWebhookSignature(
  rawBody: string,
  signatureHex: string | null,
): Promise<boolean> {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signatureHex) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(rawBody),
  );
  const expected = [...new Uint8Array(sigBuf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // Constant-time compare.
  if (expected.length !== signatureHex.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signatureHex.charCodeAt(i);
  }
  return diff === 0;
}
