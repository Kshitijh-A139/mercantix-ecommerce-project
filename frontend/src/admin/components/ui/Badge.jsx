// Colour-coded status pill. The `tone` keys map to common backend ENUMs.
const TONES = {
  // Order status
  PENDING:    "bg-amber-500/15  text-amber-300  ring-amber-500/30",
  CONFIRMED:  "bg-blue-500/15   text-blue-300   ring-blue-500/30",
  SHIPPED:    "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  DELIVERED:  "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  CANCELLED:  "bg-red-500/15    text-red-300    ring-red-500/30",
  REFUNDED:   "bg-zinc-500/15   text-zinc-300   ring-zinc-500/30",

  // Payment status
  PAID:       "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  UNPAID:     "bg-amber-500/15   text-amber-300   ring-amber-500/30",
  FAILED:     "bg-red-500/15     text-red-300     ring-red-500/30",

  // User status
  ACTIVE:     "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  INACTIVE:   "bg-zinc-500/15    text-zinc-300    ring-zinc-500/30",

  // Stock status
  LOW:        "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  OOS:        "bg-red-500/15   text-red-300   ring-red-500/30",

  // Role
  ADMIN:      "bg-[--color-bronze-500]/15 text-[--color-bronze-300] ring-[--color-bronze-500]/40",
  CUSTOMER:   "bg-zinc-500/15  text-zinc-300 ring-zinc-500/30",

  // Generic
  neutral:    "bg-[--color-onyx-700] text-[--color-stone] ring-[--color-onyx-600]",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  const cls = TONES[tone] || TONES.neutral;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-[0.04em] ring-1 ring-inset ${cls} ${className}`}>
      {children}
    </span>
  );
}
