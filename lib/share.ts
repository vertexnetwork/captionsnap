import LZString from "lz-string";
import { DEFAULT_PLACEMENT_ID, getPlacement } from "./platform-specs";
import type { FieldId } from "./platform-specs";

export type SimulatorState = {
  v: 1;
  placementId: string;
  fields: Partial<Record<FieldId, string>>;
  display?: { dark?: boolean; deviceFrame?: boolean };
};

export const DEFAULT_STATE: SimulatorState = {
  v: 1,
  placementId: DEFAULT_PLACEMENT_ID,
  fields: {
    primary: "Stop guessing where your ad copy gets cut off — preview truncation across every major ad platform in real time.",
    headline: "See exactly where your ad cuts off",
    description: "Free, no signup, no database",
  },
  display: { dark: true, deviceFrame: true },
};

export function encode(state: SimulatorState): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(state));
}

export function decode(s: string | null | undefined): SimulatorState | null {
  if (!s) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(s);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.v !== 1) return null;
    if (typeof parsed.placementId !== "string") return null;
    if (!getPlacement(parsed.placementId)) return null;
    if (parsed.fields && typeof parsed.fields !== "object") return null;
    return parsed as SimulatorState;
  } catch {
    return null;
  }
}

export function decodeOrDefault(s: string | null | undefined): SimulatorState {
  return decode(s) ?? DEFAULT_STATE;
}

export function buildShareUrl(baseUrl: string, state: SimulatorState): string {
  const url = new URL(baseUrl);
  url.searchParams.set("s", encode(state));
  return url.toString();
}
