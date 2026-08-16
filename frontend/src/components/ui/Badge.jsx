export default function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-[--color-cream] text-[--color-ink]",
    bronze:  "bg-[--color-bronze-600] text-[--color-ivory]",
    sand:    "bg-[--color-sand] text-[--color-ink]",
    success: "bg-[--color-success]/10 text-[--color-success]",
    warning: "bg-[--color-warning]/10 text-[--color-warning]",
    danger: "bg-[--color-danger]/10 text-[--color-danger]",
    dark: "bg-[--color-ink] text-[--color-ivory]",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] font-medium tracking-[0.18em] uppercase rounded-sm ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
