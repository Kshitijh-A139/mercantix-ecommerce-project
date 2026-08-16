export default function Textarea({ label, hint, error, rows = 4, className = "", id, ...rest }) {
  const inputId = id || rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[11px] tracking-[0.18em] uppercase text-[--color-stone]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        {...rest}
        className={
          "w-full rounded-md bg-[--color-onyx-800] border px-3 py-2 text-sm text-[--color-ivory] " +
          "placeholder:text-[--color-onyx-500] focus:outline-none transition-colors resize-y " +
          (error
            ? "border-[--color-danger] focus:border-[--color-danger]"
            : "border-[--color-onyx-600] focus:border-[--color-bronze-500]") +
          " " + className
        }
      />
      {(error || hint) && (
        <p className={`text-[11px] ${error ? "text-[--color-danger]" : "text-[--color-stone]"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
