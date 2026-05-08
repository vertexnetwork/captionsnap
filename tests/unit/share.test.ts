import { describe, it, expect } from "vitest";
import { encode, decode, DEFAULT_STATE } from "@/lib/share";
import { PLACEMENTS } from "@/lib/platform-specs";
import type { SimulatorState } from "@/lib/share";

function rand(n: number) {
  return Math.floor(Math.random() * n);
}

function fuzzedState(): SimulatorState {
  const placement = PLACEMENTS[rand(PLACEMENTS.length)];
  const fields: SimulatorState["fields"] = {};
  for (const f of placement.fields) {
    if (Math.random() < 0.7) {
      const len = rand(f.max + 30);
      fields[f.id] = "x".repeat(len) + (Math.random() < 0.3 ? " 🚀 hello" : "");
    }
  }
  return {
    v: 1,
    placementId: placement.id,
    fields,
    display: { dark: Math.random() < 0.5, deviceFrame: Math.random() < 0.5 },
  };
}

describe("share encode/decode", () => {
  it("round-trips the default state", () => {
    expect(decode(encode(DEFAULT_STATE))).toEqual(DEFAULT_STATE);
  });

  it("round-trips 50 fuzzed states", () => {
    for (let i = 0; i < 50; i++) {
      const s = fuzzedState();
      const r = decode(encode(s));
      expect(r).toEqual(s);
    }
  });

  it("returns null on garbage input", () => {
    expect(decode(null)).toBeNull();
    expect(decode("")).toBeNull();
    expect(decode("not-real-data")).toBeNull();
  });

  it("returns null on unknown placementId", () => {
    const s: SimulatorState = {
      v: 1,
      placementId: "nope-not-real",
      fields: {},
    };
    expect(decode(encode(s))).toBeNull();
  });

  it("returns null on bad version", () => {
    const tampered = encode({ ...DEFAULT_STATE, v: 99 as unknown as 1 });
    expect(decode(tampered)).toBeNull();
  });
});
