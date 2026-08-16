// Dark-themed native <select>. options: [{ value, label }]
export default function Select({ label, hint, error, options = [], className = "", id, ...rest }) {
  const inputId = id || rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[11px] tracking-[0.18em] uppercase text-[--color-stone]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        {...rest}
        className={
          "h-10 w-full rounded-md bg-[--color-onyx-800] border px-3 text-sm text-[--color-ivory] " +
          "focus:outline-none transition-colors appearance-none " +
          "bg-[length:14px] bg-no-repeat bg-[right_12px_center] " +
          (error
            ? "border-[--color-danger] focus:border-[--color-danger]"
            : "border-[--color-onyx-600] focus:border-[--color-bronze-500]") +
          " " + className
        }
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23b8b0a0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>\")",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {(error || hint) && (
        <p className={`text-[11px] ${error ? "text-[--color-danger]" : "text-[--color-stone]"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
