"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import Script from "next/script";

const STORAGE_KEY = "captionsnap-consent-v1";

type ConsentState = "accepted" | "declined" | null;

type ConsentContextValue = {
  consent: ConsentState;
  accept: () => void;
  decline: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    return { consent: null, accept: () => {}, decline: () => {} };
  }
  return ctx;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted" || stored === "declined") {
        // SSR snapshot is null; hydration reads localStorage. Documented
        // React 18+ pattern for external-storage state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConsent(stored);
      }
    } catch {
      // localStorage may be unavailable (private mode, sandboxed iframe)
    }
    setHydrated(true);
  }, []);

  const accept = useCallback(() => {
    setConsent("accepted");
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {}
  }, []);

  const decline = useCallback(() => {
    setConsent("declined");
    try {
      window.localStorage.setItem(STORAGE_KEY, "declined");
    } catch {}
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, accept, decline }}>
      {children}
      {hydrated && consent === null ? <CookieBanner /> : null}
    </ConsentContext.Provider>
  );
}

function CookieBanner() {
  const { accept, decline } = useConsent();
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-lg border border-border/60 bg-card/95 p-4 shadow-lg backdrop-blur sm:inset-x-auto sm:right-4 sm:left-auto"
    >
      <p className="text-sm text-foreground">
        We use Microsoft Clarity for anonymized session analytics and (when enabled)
        MediaVine for advertising. Vercel Analytics is cookieless and runs regardless.{" "}
        <Link href="/privacy" className="underline hover:text-accent">
          Privacy policy
        </Link>
        .
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={decline}
          className="rounded-md border border-border/60 px-3 py-1.5 text-sm text-muted hover:text-foreground"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

export function ClarityScript({ clarityId }: { clarityId: string }) {
  const { consent } = useConsent();
  if (consent !== "accepted") return null;
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");`}
    </Script>
  );
}
