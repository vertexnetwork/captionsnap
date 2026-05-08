import type { Placement, FieldId } from "@/lib/platform-specs";
import type { TruncateResult } from "@/lib/truncate";

export type SurfaceProps = {
  placement: Placement;
  truncated: Partial<Record<FieldId, TruncateResult>>;
};
