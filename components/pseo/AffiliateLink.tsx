"use client";

import { getAffiliate } from "@/data/affiliates";
import { track } from "@/lib/analytics";

type Props = {
  id: string;
  surface?: "pseo" | "extension" | "home";
  children?: React.ReactNode;
};

export function AffiliateLink({ id, surface = "pseo", children }: Props) {
  const entry = getAffiliate(id);
  if (!entry) return null;

  return (
    <span className="inline-flex items-baseline gap-1">
      <a
        href={entry.url}
        target="_blank"
        rel="sponsored noopener nofollow"
        onClick={() => track("affiliate_clicked", { id, surface })}
        className="text-accent underline-offset-4 hover:underline"
      >
        {children ?? entry.label}
      </a>
      <span
        aria-label="sponsored link"
        className="rounded-sm bg-card px-1 py-0.5 text-[10px] uppercase tracking-wide text-muted"
      >
        sponsored
      </span>
    </span>
  );
}
