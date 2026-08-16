// Admin-themed button. Mirrors the customer Button API for muscle memory.
const VARIANTS = {
  primary:  "bg-[--color-bronze-500] hover:bg-[--color-bronze-400] text-[--color-onyx-900] border border-transparent",
  outline:  "bg-transparent hover:bg-[--color-onyx-700] text-[--color-ivory] border border-[--color-onyx-600]",
  ghost:    "bg-transparent hover:bg-[--color-onyx-700] text-[--color-stone] border border-transparent",
  danger:   "bg-[--color-danger]/90 hover:bg-[--color-danger] text-[--color-ivory] border border-transparent",
  subtle:   "bg-[--color-onyx-700] hover:bg-[--color-onyx-600] text-[--color-ivory] border border-[--color-onyx-600]",
};

const SIZES = {
  sm: "h-8  px-3   text-[12px]",
  md: "h-9  px-4   text-[13px]",
  lg: "h-11 px-5   text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  children,
  ...rest
}) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={
        "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-[0.02em] " +
        "transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-bronze-500]/40 " +
        "disabled:opacity-50 disabled:cursor-not-allowed " +
        `${VARIANTS[variant]} ${SIZES[size]} ${className}`
      }
    >
      {children}
    </button>
  );
}
