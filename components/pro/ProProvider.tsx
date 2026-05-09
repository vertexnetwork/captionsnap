"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "captionsnap-license-v1";
const STALE_BEFORE_EXP_SECONDS = 60 * 60; // refresh if <1h until expiry

type Status = "loading" | "active" | "inactive";

type ProContextValue = {
  status: Status;
  isPro: boolean;
  email?: string;
  expiresAt: number | null;
  refresh: () => Promise<void>;
  installToken: (token: string) => Promise<void>;
  clear: () => void;
};

const ProContext = createContext<ProContextValue | null>(null);

export function useProContext(): ProContextValue {
  const ctx = useContext(ProContext);
  if (!ctx) {
    return {
      status: "inactive",
      isPro: false,
      expiresAt: null,
      refresh: async () => {},
      installToken: async () => {},
      clear: () => {},
    };
  }
  return ctx;
}

/** Convenience hook — returns boolean directly. */
export function useIsPro(): boolean {
  return useProContext().isPro;
}

type StoredPayload = {
  cid: string;
  sid: string;
  email?: string;
  exp: number;
};

function decodeLocal(token: string): StoredPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [b64] = parts;
  if (!b64) return null;
  try {
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(b64.replace(/-/g, "+").replace(/_/g, "/") + pad);
    const parsed = JSON.parse(json);
    if (
      typeof parsed.cid !== "string" ||
      typeof parsed.sid !== "string" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }
    return parsed as StoredPayload;
  } catch {
    return null;
  }
}

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [payload, setPayload] = useState<StoredPayload | null>(null);
  const refreshing = useRef(false);

  const writeToken = useCallback((token: string | null) => {
    try {
      if (token) window.localStorage.setItem(STORAGE_KEY, token);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const refresh = useCallback(async () => {
    if (refreshing.current) return;
    refreshing.current = true;
    try {
      let currentToken: string | null = null;
      try {
        currentToken = window.localStorage.getItem(STORAGE_KEY);
      } catch {}
      const res = await fetch("/api/license/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: currentToken }),
        credentials: "include",
      });
      if (!res.ok) {
        setStatus("inactive");
        setPayload(null);
        writeToken(null);
        return;
      }
      const data = (await res.json()) as {
        active: boolean;
        token?: string;
        exp?: number;
        cid?: string;
        email?: string;
      };
      if (!data.active || !data.token) {
        setStatus("inactive");
        setPayload(null);
        writeToken(null);
        return;
      }
      const decoded = decodeLocal(data.token);
      if (!decoded) {
        setStatus("inactive");
        setPayload(null);
        writeToken(null);
        return;
      }
      writeToken(data.token);
      setPayload(decoded);
      setStatus("active");
    } catch {
      // network failure — keep current state, don't downgrade unexpectedly
      setStatus((prev) => (prev === "loading" ? "inactive" : prev));
    } finally {
      refreshing.current = false;
    }
  }, [writeToken]);

  const installToken = useCallback(
    async (token: string) => {
      writeToken(token);
      const decoded = decodeLocal(token);
      if (decoded) {
        setPayload(decoded);
        setStatus("active");
      }
      await refresh();
    },
    [refresh, writeToken],
  );

  const clear = useCallback(() => {
    writeToken(null);
    setPayload(null);
    setStatus("inactive");
  }, [writeToken]);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {}
    const decoded = stored ? decodeLocal(stored) : null;
    const now = Math.floor(Date.now() / 1000);
    if (decoded && decoded.exp > now) {
      // SSR snapshot is `loading`; hydration must read localStorage to flip
      // status to `active`. This is the documented React 18+ pattern for
      // external-storage hydration — the lint rule's "you might not need
      // an effect" doctrine does not apply.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPayload(decoded);
      setStatus("active");
      if (decoded.exp - now < STALE_BEFORE_EXP_SECONDS) {
        void refresh();
      }
    } else {
      void refresh();
    }
  }, [refresh]);

  const value: ProContextValue = {
    status,
    isPro: status === "active",
    email: payload?.email,
    expiresAt: payload?.exp ?? null,
    refresh,
    installToken,
    clear,
  };

  return <ProContext.Provider value={value}>{children}</ProContext.Provider>;
}
