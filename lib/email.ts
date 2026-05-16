// Resend over fetch — no SDK dependency, edge-compatible. The license email
// is the only transactional mail we send. If RESEND_API_KEY is unset we no-op
// and return false so the webhook can log it without 500-ing (the customer
// can still self-activate from the LS receipt page, which shows the key).

const FROM = process.env.EMAIL_FROM ?? "CaptionSnap <hello@captionsnap.io>";

export async function sendLicenseEmail(opts: {
  to: string;
  licenseKey: string;
  activateUrl: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — license email skipped");
    return false;
  }

  const text = [
    "You're in. CaptionSnap Pro is ready.",
    "",
    "Your license key:",
    opts.licenseKey,
    "",
    `Activate it here: ${opts.activateUrl}`,
    "",
    "Open that link on the device you want Pro on, then paste the key when",
    "prompted. Your key works on a limited number of devices — activate it",
    "only where you'll use it. Manage or cancel anytime from the account page.",
    "",
    "Keep this email: it is the only copy of your key. Treat it like a",
    "password — anyone with the key can claim a device slot.",
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.6;color:#111">
      <p><strong>You're in. CaptionSnap Pro is ready.</strong></p>
      <p>Your license key:</p>
      <p style="font-family:ui-monospace,monospace;font-size:16px;background:#f4f4f5;padding:12px 16px;border-radius:8px;letter-spacing:.5px">${opts.licenseKey}</p>
      <p><a href="${opts.activateUrl}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px">Activate Pro</a></p>
      <p style="color:#555">Open that link on the device you want Pro on, then paste the key when prompted. Your key activates on a limited number of devices — use it only where you need it. Manage or cancel anytime from your account page.</p>
      <p style="color:#777;font-size:13px">Keep this email: it is the only copy of your key. Treat it like a password — anyone with the key can claim a device slot.</p>
    </div>`.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: opts.to,
        subject: "Your CaptionSnap Pro license key",
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error(`[email] resend send failed ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] resend threw", err);
    return false;
  }
}
