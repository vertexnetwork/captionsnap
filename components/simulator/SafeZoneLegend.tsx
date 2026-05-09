export function SafeZoneLegend() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted">
      <span
        aria-hidden="true"
        className="inline-block h-3 w-4 rounded-sm"
        style={{
          background: "var(--danger-overlay)",
          outline: "1px dashed var(--danger-overlay-stroke)",
        }}
      />
      <span>Red dashed = covered by platform UI</span>
    </div>
  );
}
