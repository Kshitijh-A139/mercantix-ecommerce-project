export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}) {
  const alignCls =
    align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-3 ${alignCls} ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="font-display text-3xl md:text-4xl font-medium text-[--color-ink]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-[15px] text-[--color-mist] max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
