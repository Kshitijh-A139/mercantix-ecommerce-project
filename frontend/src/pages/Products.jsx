import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { productService } from "../services/productService";
import { categories } from "../data/categories";

const SORTS = [
  { id: "popular", label: "Popular" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low → High" },
  { id: "price-desc", label: "Price: High → Low" },
  { id: "rating", label: "Highest Rated" },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || "";
  const sub = params.get("sub") || "";
  const q = params.get("q") || "";

  const [sort, setSort] = useState("popular");
  const [priceMax, setPriceMax] = useState(500);
  const [sizeFilter, setSizeFilter] = useState(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = categories.find((c) => c.id === cat);

  // Fetch from the backend whenever server-side params change.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    productService
      .list({
        category: cat || undefined,
        q: q || undefined,
        sort,
        maxPrice: priceMax < 500 ? priceMax : undefined,
        size: 60,
      })
      .then((res) => {
        if (active) setItems(res.items);
      })
      .catch((e) => {
        if (active) setError(e.message || "Failed to load products");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [cat, q, sort, priceMax]);

  // Sub-category and size are refined client-side (not server-filtered).
  const filtered = useMemo(() => {
    let list = items;
    if (sub) list = list.filter((p) => p.sub === sub);
    if (sizeFilter) list = list.filter((p) => p.sizes?.includes(sizeFilter));
    return list;
  }, [items, sub, sizeFilter]);

  const allSizes = useMemo(
    () => [...new Set(items.flatMap((p) => p.sizes || []))],
    [items]
  );

  const removeParam = (key) => {
    const next = new URLSearchParams(params);
    next.delete(key);
    setParams(next);
  };

  return (
    <div className="container-luxe py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <nav className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-[--color-mist]">
          <Link to="/home" className="hover:text-[--color-ink]">Home</Link>
          <span>·</span>
          <span className="text-[--color-ink]">{category?.label || (q ? `Search: ${q}` : "All")}</span>
        </nav>
        <h1 className="font-display text-4xl md:text-5xl text-[--color-ink]">
          {q ? `Results for “${q}”` : category?.label || "All Products"}
        </h1>
        {category?.blurb && !q && (
          <p className="text-sm text-[--color-mist]">{category.blurb}</p>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-[--color-sand]/70">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase border border-[--color-ink]/15 hover:border-[--color-ink] text-[--color-ink]"
            aria-expanded={filterOpen}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
          {/* Active filter chips */}
          {cat && (
            <Chip onClear={() => removeParam("cat")}>{category?.label}</Chip>
          )}
          {sub && <Chip onClear={() => removeParam("sub")}>{sub}</Chip>}
          {q && <Chip onClear={() => removeParam("q")}>“{q}”</Chip>}
          {sizeFilter && <Chip onClear={() => setSizeFilter(null)}>Size {sizeFilter}</Chip>}
          {priceMax < 500 && <Chip onClear={() => setPriceMax(500)}>Under ${priceMax}</Chip>}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[--color-mist]">
            {loading ? "…" : `${filtered.length} items`}
          </span>
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-[11px] tracking-[0.18em] uppercase text-[--color-ink] hover:text-[--color-bronze-700]"
              aria-expanded={sortOpen}
            >
              Sort: {SORTS.find((s) => s.id === sort)?.label}
              <ChevronDown size={12} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-11 w-52 bg-[--color-ivory] border border-[--color-sand] rounded-md shadow-[--shadow-card] z-20 animate-fade-up">
                <ul className="py-1.5 text-sm">
                  {SORTS.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => { setSort(s.id); setSortOpen(false); }}
                        className={`flex w-full items-center px-4 py-2 ${
                          sort === s.id ? "text-[--color-bronze-700]" : "text-[--color-ink]"
                        } hover:bg-[--color-cream]`}
                      >
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {filterOpen && (
        <div className="border border-[--color-sand] rounded-md p-5 mt-5 bg-[--color-ivory] animate-fade-up grid md:grid-cols-3 gap-8">
          <div>
            <p className="eyebrow !text-[--color-mist] mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {allSizes.length === 0 && (
                <span className="text-xs text-[--color-stone]">No sizes available</span>
              )}
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSizeFilter(sizeFilter === s ? null : s)}
                  className={`min-w-[44px] h-11 px-3 text-xs border transition-colors ${
                    sizeFilter === s
                      ? "border-[--color-ink] bg-[--color-ink] text-[--color-ivory]"
                      : "border-[--color-sand] text-[--color-ink] hover:border-[--color-ink]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow !text-[--color-mist] mb-3">Price up to ${priceMax}</p>
            <input
              type="range" min={50} max={500} step={10}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[--color-bronze-600]"
              aria-label={`Maximum price ${priceMax} dollars`}
            />
            <div className="flex justify-between text-[10px] text-[--color-mist] mt-1">
              <span>$50</span><span>$500</span>
            </div>
          </div>
          <div>
            <p className="eyebrow !text-[--color-mist] mb-3">Category</p>
            <div className="flex flex-col gap-1.5">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/products?cat=${c.id}`}
                  className={`text-sm ${cat === c.id ? "text-[--color-bronze-700]" : "text-[--color-ink-soft] hover:text-[--color-ink]"}`}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : error ? (
          <div className="col-span-full text-center py-20">
            <p className="font-display text-2xl text-[--color-ink]">Couldn’t load products</p>
            <p className="text-sm text-[--color-mist] mt-2">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="font-display text-2xl text-[--color-ink]">No products found</p>
            <p className="text-sm text-[--color-mist] mt-2">Try adjusting your filters.</p>
          </div>
        ) : (
          filtered.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  );
}

function Chip({ children, onClear }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 text-[11px] tracking-[0.12em] uppercase border border-[--color-sand] rounded-full text-[--color-ink-soft] bg-[--color-ivory]">
      {children}
      <button onClick={onClear} aria-label="Remove filter" className="text-[--color-mist] hover:text-[--color-ink]">
        <X size={12} />
      </button>
    </span>
  );
}
