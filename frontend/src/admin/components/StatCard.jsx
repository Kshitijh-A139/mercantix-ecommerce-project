import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Sparkline from "./charts/Sparkline";

// Headline KPI card. `delta` is the percent change vs previous period.
export default function StatCard({
  label,
  value,
  delta,                 // number; > 0 up, < 0 down
  icon: Icon,
  series,                // array of numbers — renders an inline sparkline
  format = (v) => v,
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="rounded-xl border border-[--color-onyx-700] bg-[--color-onyx-800]/80 p-5">
      <div className="flex items-start justify-between">
        <span className="text-[11px] tracking-[0.18em] uppercase text-[--color-stone]">{label}</span>
        {Icon && (
          <div className="grid place-items-center h-8 w-8 rounded-md bg-[--color-onyx-700] text-[--color-bronze-300]">
            <Icon size={15} />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="font-display text-3xl text-[--color-ivory] tabular-nums leading-none">
          {format(value)}
        </p>
        {series && <Sparkline data={series} width={92} height={32} />}
      </div>

      {delta != null && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 text-[12px] font-medium ${
              up ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-[11px] text-[--color-stone]">vs last period</span>
        </div>
      )}
    </div>
  );
}
