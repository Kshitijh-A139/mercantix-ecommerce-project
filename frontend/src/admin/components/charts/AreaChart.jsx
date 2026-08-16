import { useState } from "react";

// Responsive area chart. Takes `data: [{ label, value }]`. Pure SVG.
export default function AreaChart({
  data = [],
  height = 260,
  stroke = "#41ad9f",
  format = (v) => v.toLocaleString(),
}) {
  const [hover, setHover] = useState(null);
  if (data.length < 2) return null;

  const width = 720;                  // viewBox width — scales via preserveAspectRatio
  const padX  = 28;
  const padY  = 24;
  const innerW = width  - padX * 2;
  const innerH = height - padY * 2;

  const max = Math.max(...data.map((d) => d.value));
  const min = 0;
  const range = max - min || 1;
  const stepX = innerW / (data.length - 1);

  const points = data.map((d, i) => {
    const x = padX + i * stepX;
    const y = padY + innerH - ((d.value - min) / range) * innerH;
    return { x, y, d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const fillPath = `${linePath} L${padX + innerW},${padY + innerH} L${padX},${padY + innerH} Z`;

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => i * (max / yTicks));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {ticks.map((t, i) => {
        const y = padY + innerH - (t / max) * innerH;
        return (
          <g key={i}>
            <line x1={padX} x2={padX + innerW} y1={y} y2={y} stroke="#262d31" strokeDasharray="2 4" />
            <text x={padX - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#6b6760">
              {format(t)}
            </text>
          </g>
        );
      })}

      {/* Area + Line */}
      <path d={fillPath} fill="url(#area-grad)" />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Hover hit-areas */}
      {points.map((p, i) => (
        <g key={i} onMouseEnter={() => setHover(p)}>
          <rect
            x={p.x - stepX / 2} y={padY}
            width={stepX} height={innerH}
            fill="transparent"
          />
          <circle
            cx={p.x} cy={p.y} r={hover?.d.label === p.d.label ? 4.5 : 3}
            fill="#0c0f10" stroke={stroke} strokeWidth="2"
          />
        </g>
      ))}

      {/* X labels */}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={height - 6} textAnchor="middle" fontSize="10" fill="#6b6760">
          {p.d.label}
        </text>
      ))}

      {/* Tooltip */}
      {hover && (
        <g pointerEvents="none">
          <line x1={hover.x} x2={hover.x} y1={padY} y2={padY + innerH} stroke={stroke} strokeOpacity="0.4" />
          <rect
            x={hover.x - 50} y={hover.y - 38}
            width={100} height={28} rx={6}
            fill="#14181a" stroke="#262d31"
          />
          <text x={hover.x} y={hover.y - 26} textAnchor="middle" fontSize="10" fill="#b8b0a0">
            {hover.d.label}
          </text>
          <text x={hover.x} y={hover.y - 14} textAnchor="middle" fontSize="11" fill="#faf8f4" fontWeight="600">
            {format(hover.d.value)}
          </text>
        </g>
      )}
    </svg>
  );
}
