import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

// Declarative table. `columns` is the column spec; `rows` is the page slice.
// columns: [{ key, header, sortable, width, align, render?: (row) => ReactNode }]
export default function DataTable({
  columns,
  rows,
  sort,
  onSort,
  loading,
  emptyMessage = "No results",
  rowKey = (r) => r.id,
  onRowClick,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[--color-onyx-700]">
            {columns.map((c) => {
              const active = sort?.key === c.key;
              const Icon = !c.sortable ? null : active ? (sort.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
              return (
                <th
                  key={c.key}
                  style={{ width: c.width, textAlign: c.align || "left" }}
                  className="px-5 py-3 text-[11px] tracking-[0.18em] uppercase font-medium text-[--color-stone] whitespace-nowrap"
                >
                  <button
                    type="button"
                    disabled={!c.sortable}
                    onClick={() => c.sortable && onSort?.(c.key)}
                    className={
                      "inline-flex items-center gap-1.5 " +
                      (c.sortable ? "hover:text-[--color-ivory]" : "cursor-default") +
                      (active ? " text-[--color-ivory]" : "")
                    }
                  >
                    {c.header}
                    {Icon && <Icon size={12} />}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={`s-${i}`} className="border-b border-[--color-onyx-700]/60">
                {columns.map((c) => (
                  <td key={c.key} className="px-5 py-4">
                    <div className="h-3 rounded skeleton-dark" style={{ width: `${30 + (i * 7) % 60}%` }} />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-[--color-stone]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr
                key={rowKey(r)}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={
                  "border-b border-[--color-onyx-700]/60 transition-colors " +
                  (onRowClick ? "cursor-pointer hover:bg-[--color-onyx-700]/40" : "")
                }
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    style={{ textAlign: c.align || "left" }}
                    className="px-5 py-3.5 text-sm text-[--color-ivory] whitespace-nowrap"
                  >
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
