import { SimulatorProvider } from "@/components/simulator/SimulatorProvider";
import { Simulator } from "@/components/simulator/Simulator";
import { getPlacement } from "@/lib/platform-specs";
import type { SimulatorState } from "@/lib/share";
import type { FieldId } from "@/lib/platform-specs";

export function SimulatorPreset({
  placementId,
  presetCopy,
}: {
  placementId: string;
  presetCopy?: Partial<Record<FieldId, string>>;
}) {
  const placement = getPlacement(placementId);
  if (!placement) return null;
  const initial: SimulatorState = {
    v: 1,
    placementId,
    fields: presetCopy ?? {},
    display: { dark: true, deviceFrame: true },
  };
  return (
    <div className="my-8 rounded-xl border border-border bg-card/40 p-4">
      <SimulatorProvider initialState={initial}>
        <Simulator />
      </SimulatorProvider>
    </div>
  );
}
