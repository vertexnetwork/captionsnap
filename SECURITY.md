# CaptionSnap — Pro entitlement threat model

This documents exactly what the license system protects against, and — just as
importantly — what it **cannot** protect against, so the limits are a design
decision on the record rather than a surprise.

## Architecture

- **Merchant of Record:** LemonSqueezy. We never touch card data; LS owns
  payment, chargebacks, and global sales-tax/VAT remittance. This also keeps an
  anonymous operator out of the tax-registration paper trail.
- **Entitlement proof:** a LemonSqueezy **license key**, emailed on purchase
  (via Resend). The buyer activates it per device.
- **Per-device binding:** activation calls `POST /v1/licenses/activate`, which
  returns an `instance_id`. LemonSqueezy enforces a per-key **activation limit**
  server-side. We store `{ key, instance_id }` in a signed, HTTP-only, Secure,
  SameSite=Lax cookie (`cs_lic`). It is never exposed to client JS.
- **Working credential:** a short-lived (1 hour) HMAC-signed bearer token in
  `localStorage`, carrying `{cid, sid, jti, exp}`. Used to gate the Pro UI.
- **Revalidation:** when the bearer expires (≤1h), `/api/license/verify` calls
  `POST /v1/licenses/validate` against LS. A cancelled, refunded, or disabled
  key loses access within the hour, with no datastore on our side.

## What this DOES defend against

| Threat | Defense |
|---|---|
| Card theft / PCI scope | Out of scope — LS is MoR, we never see cards |
| Forged license token | HMAC-SHA256 over the payload; bad signature → rejected |
| Stale entitlement after cancel/refund | 1h bearer TTL + live LS re-validation |
| Cookie tampering | Cookie is HMAC-signed; mutation invalidates it |
| Cookie theft via XSS | `httpOnly` — not readable by JS |
| Token theft via network/log | 1h TTL caps the blast radius; `jti` enables audit |
| Mass key-sharing (one key, many people) | **LS activation limit** — over the cap, activation fails server-side at LemonSqueezy |
| Webhook spoofing (fake "you paid" events) | `X-Signature` HMAC verified against the raw body, constant-time compare, before any parsing |

## What this does NOT — and CANNOT — defend against

These are inherent to the product being a **100% client-side tool**. The
simulator, bulk paste, and PNG export all run in the browser; there is no
server-side computation to withhold. State the limits plainly:

1. **Client-side bypass of the Pro gate.** `isPro` is a React boolean
   ([BulkPageContent](components/bulk/BulkPageContent.tsx),
   [ExportPngButton](components/simulator/ExportPngButton.tsx)). A technical
   user can flip it in devtools or run a patched bundle. No license system can
   prevent this when the gated feature is pure client code — there is no secret
   to gate access to. **The Pro gate is an honor line, not a vault.**
2. **License-key forwarding within the activation limit.** If the limit is 3, a
   buyer can share the key with 2 friends. The limit *bounds* sharing; it does
   not eliminate it. Set the limit to the smallest number that doesn't generate
   support tickets (recommend **3**).
3. **The license email is a plaintext secret.** Anyone who reads or is
   forwarded that email can claim a device slot. Mitigations in place: the key
   alone does nothing without an open activation slot; the email states it is
   password-equivalent; revocation is possible by disabling the key in LS.
4. **Determined extraction of the tool itself.** The spec data and simulator
   logic ship to the client. They can be copied. The moat is freshness
   (dated re-verification) and brand, not code secrecy.

## Operational guidance

- Set the LS activation limit to **3**. Higher invites sharing; `1` generates
  "I switched laptops" tickets.
- Keep `LICENSE_HMAC_SECRET` byte-identical across preview and prod, and rotate
  it only with intent — rotating invalidates every issued cookie/token (all
  users must re-activate, which they can do from their email).
- `/api/*` is disallowed in [robots.ts](app/robots.ts); keep it that way.
- If abuse appears, the lever is the LS dashboard: disable the offending key.
  Because we re-validate hourly, access drops within the hour.

## Bottom line

Sharing **across people** is genuinely bounded (LemonSqueezy enforces it
server-side). Bypass **by a technical user on their own machine** is not
preventable for a client-side tool and we do not pretend otherwise. The pricing
model should assume the honest-majority case: this converts marketers who value
the verified data and convenience, not pirates.
