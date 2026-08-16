const variants = {
  primary:
    "bg-[--color-ink] text-[--color-ivory] hover:bg-[--color-bronze-700] active:bg-[--color-bronze-800]",
  bronze:
    "bg-[--color-bronze-600] text-[--color-ivory] hover:bg-[--color-bronze-700] active:bg-[--color-bronze-800]",
  outline:
    "border border-[--color-ink] text-[--color-ink] hover:bg-[--color-ink] hover:text-[--color-ivory]",
  ghost:
    "text-[--color-ink] hover:bg-[--color-cream]",
  danger:
    "bg-[--color-danger] text-white hover:opacity-90",
};

const sizes = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-3.5 text-sm",
};

export default function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium tracking-[0.08em] uppercase rounded-[--radius-xs] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-bronze-400] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-ivory]";
  return (
    <As
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </As>
  );
}
