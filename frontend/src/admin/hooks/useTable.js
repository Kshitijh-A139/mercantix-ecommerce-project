import { useMemo, useState } from "react";

// Generic table state: search, sort, paginate. Lifted out so every list page
// looks the same and so behaviour stays consistent.
export function useTable(rows, {
  searchKeys = [],
  initialSort = null,         // { key, dir: 'asc' | 'desc' }
  pageSize: initialPageSize = 10,
} = {}) {
  const [query, setQuery]       = useState("");
  const [sort, setSort]         = useState(initialSort);
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const { key, dir } = sort;
    const sign = dir === "desc" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      const av = a[key], bv = b[key];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * sign;
      return String(av).localeCompare(String(bv)) * sign;
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paged      = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (key) => {
    setSort((s) =>
      !s || s.key !== key ? { key, dir: "asc" }
      : s.dir === "asc"    ? { key, dir: "desc" }
      :                      null
    );
  };

  return {
    rows: paged, total: sorted.length,
    query, setQuery: (v) => { setQuery(v); setPage(1); },
    sort, toggleSort,
    page: safePage, setPage,
    pageSize, setPageSize,
    totalPages,
  };
}
