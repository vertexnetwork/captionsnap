import { cn } from "@/lib/cn";

type Props = {
  id: string;
  className?: string;
  label?: string;
};

export function MediaVineSlot({ id, className, label }: Props) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") {
    return null;
  }
  return (
    <div
      data-mediavine-slot={id}
      aria-label={label ?? "Advertisement"}
      className={cn(
        "min-h-[90px] w-full rounded-md border border-border/40 bg-card/30 text-xs text-muted",
        className,
      )}
    >
      <span className="sr-only">Advertisement</span>
    </div>
  );
}
