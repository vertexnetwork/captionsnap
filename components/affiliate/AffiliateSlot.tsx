"use client";

import { track } from "@/lib/analytics";

const ENABLED = process.env.NEXT_PUBLIC_AFFILIATE_ENABLED === "1";
const URL = process.env.NEXT_PUBLIC_AFFILIATE_URL ?? "";
const LABEL = process.env.NEXT_PUBLIC_AFFILIATE_LABEL ?? "";
const PROVIDER = process.env.NEXT_PUBLIC_AFFILIATE_PROVIDER ?? "";

type Props = {
  surface?: "footer" | "pseo" | "extension" | "home";
  className?: string;
};

export function AffiliateSlot({ surface = "footer", className }: Props) {
  if (!ENABLED || !URL || !LABEL) return null;
  return (
    <a
      href={URL}
      target="_blank"
      rel="sponsored noopener"
      data-provider={PROVIDER || undefined}
      data-surface={surface}
      onClick={() => track("affiliate_clicked", { id: PROVIDER || "default", surface })}
      className={
        className ??
        "inline-flex items-center gap-1 text-xs text-muted/80 hover:text-muted underline-offset-2 hover:underline"
      }
    >
      {LABEL}
    </a>
  );
}
