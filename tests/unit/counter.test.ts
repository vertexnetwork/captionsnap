import { describe, it, expect } from "vitest";
import { counterState } from "@/lib/truncate";
import type { SpecField } from "@/lib/platform-specs";

const field: SpecField = {
  id: "primary",
  label: "Primary",
  max: 100,
  truncateAt: 80,
  warnAt: 70,
};

describe("counterState", () => {
  it("green below warnAt", () => {
    expect(counterState("x".repeat(69), field)).toBe("green");
  });
  it("yellow at warnAt", () => {
    expect(counterState("x".repeat(70), field)).toBe("yellow");
  });
  it("yellow at truncateAt", () => {
    expect(counterState("x".repeat(80), field)).toBe("yellow");
  });
  it("red just past truncateAt", () => {
    expect(counterState("x".repeat(81), field)).toBe("red");
  });
  it("red between truncateAt and max", () => {
    expect(counterState("x".repeat(95), field)).toBe("red");
  });
  it("red above max", () => {
    expect(counterState("x".repeat(101), field)).toBe("red");
  });
  it("derives warnAt when not provided", () => {
    const f: SpecField = { id: "primary", label: "P", max: 50, truncateAt: 40 };
    // floor(40 * 0.85) = 34 → warnAt
    expect(counterState("x".repeat(33), f)).toBe("green");
    expect(counterState("x".repeat(34), f)).toBe("yellow");
    expect(counterState("x".repeat(40), f)).toBe("yellow");
    expect(counterState("x".repeat(41), f)).toBe("red");
  });
});
