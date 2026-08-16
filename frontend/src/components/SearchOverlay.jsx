import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, ArrowRight, Clock } from "lucide-react";
import { productService } from "../services/productService";
import { categories } from "../data/categories";

const RECENT_KEY = "mercantix.recent-searches";

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function saveRecent(list) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6)));
}

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(loadRecent);
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setRecent(loadRecent());
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      // Popular picks for the empty state (fetched once per open if not loaded).
      if (popular.length === 0) {
        productService
          .list({ sort: "popular", size: 6 })
          .then((res) => setPopular(res.items))
          .catch(() => {});
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Debounced server-side search.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      productService
        .list({ q, sort: "popular", size: 8 })
        .then((res) => setResults(res.items))
        .catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const trending = categories.slice(0, 4);

  const submit = (term) => {
    const t = (term || query).trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 6);
    setRecent(next);
    saveRecent(next);
    onClose();
    navigate(`/products?q=${encodeURIComponent(t)}`);
  };

  const clearRecent = () => { setRecent([]); saveRecent([]); };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[--color-ivory]/98 backdrop-blur-md animate-fade-up">
      {/* Header / input */}
      <div className="border-b border-[--color-sand]/70">
        <div className="container-luxe flex items-center gap-4 h-[68px]">
          <Search size={20} className="text-[--color-mist] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Search products, brands, categories…"
            className="flex-1 bg-transparent border-none outline-none text-[--color-ink] placeholder:text-[--color-stone] font-display text-2xl md:text-3xl"
          />
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-[--color-cream] text-[--color-ink]"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="container-luxe py-10 grid md:grid-cols-[280px_1fr] gap-10">
          {/* Sidebar */}
          <aside className="flex flex-col gap-8">
            <section>
              <div className="flex items-center justify-between mb-3">
                <p className="eyebrow !text-[--color-mist]">Recent</p>
                {recent.length > 0 && (
                  <button
                    onClick={clearRecent}
                    className="text-[10px] tracking-[0.18em] uppercase text-[--color-mist] hover:text-[--color-ink]"
                  >
                    Clear
                  </button>
                )}
              </div>
              <ul className="flex flex-col gap-1.5">
                {recent.length === 0 && (
                  <li className="text-xs text-[--color-stone]">No recent searches</li>
                )}
                {recent.map((r) => (
                  <li key={r}>
                    <button
                      onClick={() => submit(r)}
                      className="group flex items-center gap-2 text-sm text-[--color-ink-soft] hover:text-[--color-bronze-700] py-1"
                    >
                      <Clock size={13} className="text-[--color-mist]" />
                      <span>{r}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="eyebrow !text-[--color-mist] mb-3">Trending</p>
              <ul className="flex flex-col gap-1.5">
                {trending.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => submit(c.label)}
                      className="text-sm text-[--color-ink-soft] hover:text-[--color-bronze-700] py-1"
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          {/* Results */}
          <section>
            {!query && (
              <div>
                <p className="eyebrow !text-[--color-mist] mb-5">Popular Picks</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {popular.map((p) => (
                    <SearchTile key={p.id} product={p} onClick={onClose} />
                  ))}
                </div>
              </div>
            )}

            {query && results.length > 0 && (
              <div>
                <p className="eyebrow !text-[--color-mist] mb-5">
                  {results.length} {results.length === 1 ? "result" : "results"} for “{query}”
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {results.map((p) => (
                    <SearchTile key={p.id} product={p} onClick={onClose} />
                  ))}
                </div>
                <button
                  onClick={() => submit()}
                  className="mt-8 inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase text-[--color-ink] hover:text-[--color-bronze-700] border-b border-[--color-ink] pb-0.5"
                >
                  See all results <ArrowRight size={12} />
                </button>
              </div>
            )}

            {query && results.length === 0 && (
              <div className="py-20 text-center">
                <p className="font-display text-2xl text-[--color-ink]">No results</p>
                <p className="text-sm text-[--color-mist] mt-2">
                  Try a different keyword or browse our collections.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="border-t border-[--color-sand]/70">
        <div className="container-luxe py-3 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-[--color-mist]">
          <span>Press <kbd className="px-1.5 py-0.5 border border-[--color-sand] rounded text-[10px]">Esc</kbd> to close</span>
          <span>Enter to search</span>
        </div>
      </div>
    </div>
  );
}

function SearchTile({ product, onClick }) {
  return (
    <Link
      to={`/products/${product.id}`}
      onClick={onClick}
      className="group flex flex-col gap-2"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[--color-cream] rounded-sm">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[--color-mist]">{product.brand}</p>
        <p className="font-display text-[14px] text-[--color-ink] leading-snug group-hover:text-[--color-bronze-700]">
          {product.name}
        </p>
        <p className="text-xs text-[--color-ink]">${product.price}</p>
      </div>
    </Link>
  );
}
