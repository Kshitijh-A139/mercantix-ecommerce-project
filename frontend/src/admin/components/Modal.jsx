import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-[--color-onyx-900]/80 backdrop-blur-sm"
      />
      <div className={`relative w-full ${maxW} rounded-xl border border-[--color-onyx-700] bg-[--color-onyx-800] shadow-2xl`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[--color-onyx-700]">
          <h3 className="text-sm font-semibold text-[--color-ivory]">{title}</h3>
          <button
            onClick={onClose}
            className="grid place-items-center h-8 w-8 rounded-md text-[--color-stone] hover:text-[--color-ivory] hover:bg-[--color-onyx-700]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[--color-onyx-700] bg-[--color-onyx-800]/70 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
