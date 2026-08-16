// Title + breadcrumb + action slot. Used at the top of every admin page.
export default function PageHeader({ kicker, title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
      <div>
        {kicker && (
          <p className="text-[10px] tracking-[0.3em] uppercase text-[--color-bronze-300]">{kicker}</p>
        )}
        <h1 className="font-display text-3xl md:text-4xl text-[--color-ivory] mt-1">{title}</h1>
        {subtitle && (
          <p className="text-sm text-[--color-stone] mt-1.5 max-w-xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
