import { describe, it, expect } from "vitest";
import { PLACEMENTS } from "@/lib/platform-specs";
import { truncateField, graphemeLength } from "@/lib/truncate";

describe("truncateField — boundaries for every placement field", () => {
  for (const placement of PLACEMENTS) {
    for (const field of placement.fields) {
      it(`${placement.id}.${field.id}: max-1 not truncated`, () => {
        const text = "x".repeat(field.truncateAt - 1);
        const r = truncateField(text, field, placement.platform);
        expect(r.isTruncated).toBe(false);
        expect(r.display).toBe(text);
      });

      it(`${placement.id}.${field.id}: max not truncated`, () => {
        const text = "x".repeat(field.truncateAt);
        const r = truncateField(text, field, placement.platform);
        expect(r.isTruncated).toBe(false);
      });

      it(`${placement.id}.${field.id}: max+1 truncated`, () => {
        const text = "x".repeat(field.truncateAt + 1);
        const r = truncateField(text, field, placement.platform);
        expect(r.isTruncated).toBe(true);
        expect(r.indexCut).toBe(field.truncateAt);
        expect(graphemeLength(r.display.slice(0, field.truncateAt))).toBe(field.truncateAt);
        expect(r.display.endsWith(r.ellipsis)).toBe(true);
      });

      it(`${placement.id}.${field.id}: max*10 truncated to truncateAt`, () => {
        const text = "x".repeat(field.truncateAt * 10);
        const r = truncateField(text, field, placement.platform);
        expect(r.isTruncated).toBe(true);
        expect(r.indexCut).toBe(field.truncateAt);
      });
    }
  }
});

describe("graphemeLength", () => {
  it("counts emoji as one grapheme", () => {
    expect(graphemeLength("🇺🇸")).toBe(1);
    expect(graphemeLength("👨‍👩‍👧‍👦")).toBe(1);
  });
  it("counts plain ASCII", () => {
    expect(graphemeLength("hello")).toBe(5);
  });
});
