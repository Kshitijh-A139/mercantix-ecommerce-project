import { forwardRef } from "react";

const InputField = forwardRef(function InputField(
  { label, error, hint, className = "", id, ...rest },
  ref
) {
  const inputId = id || `f-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-medium tracking-[0.16em] uppercase text-[--color-mist]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`w-full bg-transparent border-b ${
          error ? "border-[--color-danger]" : "border-[--color-sand]"
        } px-0 py-2.5 text-[15px] text-[--color-ink] placeholder:text-[--color-stone] focus:outline-none focus:border-[--color-bronze-600] transition-colors`}
        {...rest}
      />
      {error ? (
        <span className="text-xs text-[--color-danger]">{error}</span>
      ) : hint ? (
        <span className="text-xs text-[--color-mist]">{hint}</span>
      ) : null}
    </div>
  );
});

export default InputField;
