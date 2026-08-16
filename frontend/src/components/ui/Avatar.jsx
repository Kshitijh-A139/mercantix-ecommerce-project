export default function Avatar({ name, size = 36, tone = "bronze", className = "" }) {
  const initial = (name || "?").trim()[0]?.toUpperCase() || "?";
  const tones = {
    bronze: "bg-[--color-bronze-600] text-[--color-ivory]",
    ink:    "bg-[--color-ink]        text-[--color-ivory]",
    cream:  "bg-[--color-cream]      text-[--color-ink]",
  };
  return (
    <span
      className={`inline-grid place-items-center rounded-full font-sans font-medium select-none ${tones[tone] || tones.bronze} ${className}`}
      style={{ height: size, width: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
