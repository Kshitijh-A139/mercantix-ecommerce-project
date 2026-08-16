import { ChevronLeft, ChevronRight } from "lucide-react";

// Compact pagination — built to work with useTable.
export default function Pagination({ page, totalPages, onChange, total, pageSize, onPageSize }) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end   = Math.min(total, page * pageSize);

  const btn =
    "h-8 min-w-8 px-2 grid place-items-center rounded-md text-[12px] border border-[--color-onyx-600] " +
    "hover:bg-[--color-onyx-700] text-[--color-stone] disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-[--color-onyx-700]">
      <p className="text-[12px] text-[--color-stone]">
        Showing <span className="text-[--color-ivory]">{start}–{end}</span> of{" "}
        <span className="text-[--color-ivory]">{total}</span>
      </p>

      <div className="flex items-center gap-2">
        {onPageSize && (
          <select
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
            className="h-8 rounded-md bg-[--color-onyx-800] border border-[--color-onyx-600] px-2 text-[12px] text-[--color-ivory]"
          >
            {[10, 25, 50, 100].map((s) => <option key={s} value={s}>{s} / page</option>)}
          </select>
        )}

        <button className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={14} />
        </button>
        <span className="text-[12px] text-[--color-ivory] tabular-nums px-1">
          {page} / {totalPages}
        </span>
        <button className={btn} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
