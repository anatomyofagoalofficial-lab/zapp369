import { cn } from "@/lib/utils";

/**
 * A single readout on the Present-page instrument panel. Presentational only —
 * the value is resolved server-side (see lib/stats.ts) so there's no layout
 * shift and a guaranteed fallback.
 */
export function LiveStat({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-6",
        className,
      )}
    >
      <span className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
        {label}
      </span>
      <span className="font-mono text-3xl text-present-white sm:text-4xl">
        {value}
      </span>
      {sub ? (
        <span className="font-mono text-xs text-present-white/40">{sub}</span>
      ) : null}
    </div>
  );
}
