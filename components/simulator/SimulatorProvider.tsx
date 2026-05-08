"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { FieldId } from "@/lib/platform-specs";
import { getPlacement, getPlacementsByPlatform } from "@/lib/platform-specs";
import type { SimulatorState } from "@/lib/share";
import { DEFAULT_STATE } from "@/lib/share";

type Ctx = {
  state: SimulatorState;
  decodeFailed: boolean;
  shareLinkStale: boolean;
  setPlacementId: (id: string) => void;
  setField: (id: FieldId, value: string) => void;
  setDisplay: (patch: Partial<NonNullable<SimulatorState["display"]>>) => void;
  markShareLinkFresh: () => void;
  reset: () => void;
};

const SimulatorCtx = createContext<Ctx | null>(null);

export function SimulatorProvider({
  initialState,
  decodeFailed = false,
  hasInitialShareLink = false,
  children,
}: {
  initialState?: SimulatorState;
  decodeFailed?: boolean;
  hasInitialShareLink?: boolean;
  children: ReactNode;
}) {
  const [state, setState] = useState<SimulatorState>(initialState ?? DEFAULT_STATE);
  const [shareLinkStale, setShareLinkStale] = useState<boolean>(false);
  const [hasShareLink, setHasShareLink] = useState<boolean>(hasInitialShareLink);

  const setPlacementId = useCallback((id: string) => {
    if (!getPlacement(id)) return;
    setState((s) => ({ ...s, placementId: id }));
    setShareLinkStale((stale) => stale || hasShareLink);
  }, [hasShareLink]);

  const setField = useCallback((id: FieldId, value: string) => {
    setState((s) => ({ ...s, fields: { ...s.fields, [id]: value } }));
    setShareLinkStale((stale) => stale || hasShareLink);
  }, [hasShareLink]);

  const setDisplay = useCallback(
    (patch: Partial<NonNullable<SimulatorState["display"]>>) => {
      setState((s) => ({ ...s, display: { ...(s.display ?? {}), ...patch } }));
      setShareLinkStale((stale) => stale || hasShareLink);
    },
    [hasShareLink],
  );

  const markShareLinkFresh = useCallback(() => {
    setShareLinkStale(false);
    setHasShareLink(true);
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    setShareLinkStale(false);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      decodeFailed,
      shareLinkStale,
      setPlacementId,
      setField,
      setDisplay,
      markShareLinkFresh,
      reset,
    }),
    [state, decodeFailed, shareLinkStale, setPlacementId, setField, setDisplay, markShareLinkFresh, reset],
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
