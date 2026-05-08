import { getPlacement } from "@/lib/platform-specs";

export function SpecTable({ placementId }: { placementId: string }) {
  const placement = getPlacement(placementId);
  if (!placement) return null;
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-card text-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Field</th>
            <th className="px-3 py-2 text-right font-semibold">Hard max</th>
            <th className="px-3 py-2 text-right font-semibold">Visible before truncate</th>
            <th className="px-3 py-2 text-right font-semibold">Warn at</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-muted">
          {placement.fields.map((f) => (
            <tr key={f.id}>
              <td className="px-3 py-2 text-foreground">{f.label}</td>
              <td className="px-3 py-2 text-right tabular-nums">{f.max}</td>
              <td className="px-3 py-2 text-right tabular-nums">{f.truncateAt}</td>
              <td className="px-3 py-2 text-right tabular-nums">{f.warnAt ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-3 py-2 text-xs text-muted">
        Source: <a className="underline" href={placement.sourceUrl} target="_blank" rel="noopener noreferrer">{placement.sourceUrl}</a>
        {" · "}Last verified {placement.lastVerified}.
      </p>
    </div>
  );
}
