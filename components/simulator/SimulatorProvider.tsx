"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { FieldId } from "@/lib/platform-specs";
import { getPlacement, getPlacementsByPlatform } from "@/lib/platform-specs";
import type { SimulatorState } from "@/lib/share";
import { DEFAULT_STATE } from "@/lib/share";

type Ctx = {
  state: SimulatorState;
  setPlacementId: (id: string) => void;
  setField: (id: FieldId, value: string) => void;
  setDisplay: (patch: Partial<NonNullable<SimulatorState["display"]>>) => void;
  reset: () => void;
};

const SimulatorCtx = createContext<Ctx | null>(null);

export function SimulatorProvider({
  initialState,
  children,
}: {
  initialState?: SimulatorState;
  children: ReactNode;
}) {
  const [state, setState] = useState<SimulatorState>(initialState ?? DEFAULT_STATE);

  const setPlacementId = useCallback((id: string) => {
    if (!getPlacement(id)) return;
    setState((s) => ({ ...s, placementId: id }));
  }, []);

  const setField = useCallback((id: FieldId, value: string) => {
    setState((s) => ({ ...s, fields: { ...s.fields, [id]: value } }));
  }, []);

  const setDisplay = useCallback(
    (patch: Partial<NonNullable<SimulatorState["display"]>>) => {
      setState((s) => ({ ...s, display: { ...(s.display ?? {}), ...patch } }));
    },
    [],
  );

  const reset = useCallback(() => setState(DEFAULT_STATE), []);

  const value = useMemo<Ctx>(
    () => ({ state, setPlacementId, setField, setDisplay, reset }),
    [state, setPlacementId, setField, setDisplay, reset],
  );

  return <SimulatorCtx.Provider value={value}>{children}</SimulatorCtx.Provider>;
}

export function useSimulator(): Ctx {
  const ctx = useContext(SimulatorCtx);
  if (!ctx) throw new Error("useSimulator must be used inside <SimulatorProvider>");
  return ctx;
}

export function useCurrentPlacement() {
  const { state } = useSimulator();
  return getPlacement(state.placementId) ?? getPlacement(DEFAULT_STATE.placementId)!;
}

export function usePlatformPlacements() {
  const placement = useCurrentPlacement();
  return getPlacementsByPlatform(placement.platform);
}
