import { describe, it, expect, beforeAll } from "vitest";
import { signLicense, verifyLicense, isStale } from "@/lib/license";

beforeAll(() => {
  process.env.LICENSE_HMAC_SECRET =
    "unit-test-secret-please-do-not-use-in-prod-32bytes";
});

describe("license token", () => {
  it("signs and verifies a round-trip", async () => {
    const token = await signLicense({ cid: "cus_abc", sid: "sub_xyz", email: "x@y.com" });
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    const payload = await verifyLicense(token);
    expect(payload).not.toBeNull();
    expect(payload!.cid).toBe("cus_abc");
    expect(payload!.sid).toBe("sub_xyz");
    expect(payload!.email).toBe("x@y.com");
    expect(payload!.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("rejects a tampered payload", async () => {
    const token = await signLicense({ cid: "cus_abc", sid: "sub_xyz" });
    const [, sig] = token.split(".");
    const tampered = `${btoa('{"cid":"cus_evil","sid":"sub_evil","exp":9999999999}').replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")}.${sig}`;
    const payload = await verifyLicense(tampered);
    expect(payload).toBeNull();
  });

  it("rejects a tampered signature", async () => {
    const token = await signLicense({ cid: "cus_abc", sid: "sub_xyz" });
    const [body] = token.split(".");
    const tampered = `${body}.AAAA${"A".repeat(40)}`;
    const payload = await verifyLicense(tampered);
    expect(payload).toBeNull();
  });

  it("rejects an expired token", async () => {
    const token = await signLicense({ cid: "cus_abc", sid: "sub_xyz" }, -10);
    const payload = await verifyLicense(token);
    expect(payload).toBeNull();
  });

  it("rejects malformed input", async () => {
    expect(await verifyLicense("")).toBeNull();
    expect(await verifyLicense("notatoken")).toBeNull();
    expect(await verifyLicense("only.one.dot.too.many")).toBeNull();
  });

  it("isStale flags tokens nearing expiry", async () => {
    const token = await signLicense({ cid: "cus_abc", sid: "sub_xyz" }, 30);
    const payload = await verifyLicense(token);
    expect(payload).not.toBeNull();
    expect(isStale(payload!, 60)).toBe(true);
    expect(isStale(payload!, 10)).toBe(false);
  });
});
