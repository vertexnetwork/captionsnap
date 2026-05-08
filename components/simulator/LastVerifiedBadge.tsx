import { CheckCircle2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

export function LastVerifiedBadge({
  date,
  sourceUrl,
  className,
}: {
  date: string;
  sourceUrl?: string;
  className?: string;
}) {
  const formatted = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const inner = (
    <span className="inline-flex items-center gap-1.5">
      <CheckCircle2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
      <span>Last verified {formatted}</span>
      {sourceUrl ? (
        <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
      ) : null}
    </span>
  );
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-muted",
        className,
      )}
    >
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
          aria-label={`Last verified ${formatted} — opens platform documentation in a new tab`}
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
