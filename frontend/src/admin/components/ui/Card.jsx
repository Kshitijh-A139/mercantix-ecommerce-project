// Surface container used by every analytical block.
export default function Card({ children, className = "", as: As = "div", ...rest }) {
  return (
    <As
      {...rest}
      className={
        "rounded-xl border border-[--color-onyx-700] bg-[--color-onyx-800]/80 " +
        "backdrop-blur-sm " + className
      }
    >
      {children}
    </As>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-[--color-ivory] truncate">{title}</h3>
        {subtitle && <p className="text-[11px] text-[--color-stone] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
