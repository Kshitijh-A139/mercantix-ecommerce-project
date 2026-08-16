// Horizontal bar chart for category share. `data: [{ label, value, revenue? }]`.
export default function BarChart({ data = [], format = (v) => v.toLocaleString() }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-[12px] text-[--color-ivory]">{d.label}</span>
              <span className="text-[11px] text-[--color-stone] tabular-nums">
                {format(d.revenue ?? d.value)}{" "}
                <span className="text-[--color-onyx-500]">· {d.value}%</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-[--color-onyx-700] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[--color-bronze-500] to-[--color-bronze-300] rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
