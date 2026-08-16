// SVG donut with legend. `data: [{ label, value, color? }]`.
const COLORS = ["#41ad9f", "#0f766e", "#74cabc", "#a7e0d6", "#1f9286", "#0c5d57"];

export default function DonutChart({
  data = [],
  size = 200,
  thickness = 28,
  centerLabel,
  centerValue,
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r  = (size - thickness) / 2;
  const C  = 2 * Math.PI * r;
  let off = 0;

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="#1b2124" strokeWidth={thickness} fill="none"
        />
        {data.map((d, i) => {
          const len = (d.value / total) * C;
          const dash = `${len} ${C - len}`;
          const color = d.color || COLORS[i % COLORS.length];
          const el = (
            <circle
              key={d.label}
              cx={size / 2} cy={size / 2} r={r}
              stroke={color} strokeWidth={thickness}
              fill="none" strokeLinecap="butt"
              strokeDasharray={dash} strokeDashoffset={-off}
            />
          );
          off += len;
          return el;
        })}
        {(centerLabel || centerValue) && (
          <g transform={`rotate(90 ${size/2} ${size/2})`}>
            <text x="50%" y="48%" textAnchor="middle" fontSize="11" fill="#b8b0a0">
              {centerLabel}
            </text>
            <text x="50%" y="60%" textAnchor="middle" fontSize="18" fill="#faf8f4" fontWeight="600">
              {centerValue}
            </text>
          </g>
        )}
      </svg>

      <ul className="flex flex-col gap-2 flex-1 min-w-[140px]">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{ background: d.color || COLORS[i % COLORS.length] }}
              />
              <span className="text-[12px] text-[--color-ivory] truncate">{d.label}</span>
            </div>
            <span className="text-[12px] text-[--color-stone] tabular-nums">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
