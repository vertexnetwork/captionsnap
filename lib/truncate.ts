import type { Placement, SpecField, Platform } from "./platform-specs";

export type CounterState = "green" | "yellow" | "red";

export type TruncateResult = {
  display: string;
  isTruncated: boolean;
  indexCut: number;
  ellipsis: string;
};

const ELLIPSIS: Record<Platform, string> = {
  meta: "… See more",
  tiktok: "...more",
};

function segments(input: string): string[] {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(input), (s) => s.segment);
  }
  return Array.from(input);
}

export function graphemeLength(input: string): number {
  return segments(input).length;
}

export function truncateField(
  text: string,
  field: SpecField,
  platform: Platform,
): TruncateResult {
  const ellipsis = ELLIPSIS[platform];
  const graphemes = segments(text ?? "");
  const len = graphemes.length;
  if (len <= field.truncateAt) {
    return { display: text ?? "", isTruncated: false, indexCut: len, ellipsis };
  }
  const cut = field.truncateAt;
  return {
    display: graphemes.slice(0, cut).join("") + ellipsis,
    isTruncated: true,
    indexCut: cut,
    ellipsis,
  };
}

export function counterState(text: string, field: SpecField): CounterState {
  const len = graphemeLength(text ?? "");
  const warnAt = field.warnAt ?? Math.floor(field.truncateAt * 0.85);
  if (len > field.max) return "red";
  if (len >= warnAt) return "yellow";
  return "green";
}

export function truncatePlacement(
  values: Partial<Record<SpecField["id"], string>>,
  placement: Placement,
): Record<SpecField["id"], TruncateResult> {
  const out: Partial<Record<SpecField["id"], TruncateResult>> = {};
  for (const f of placement.fields) {
    out[f.id] = truncateField(values[f.id] ?? "", f, placement.platform);
  }
  return out as Record<SpecField["id"], TruncateResult>;
}
