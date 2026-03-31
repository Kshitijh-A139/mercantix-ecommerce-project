import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import FilterDropdown from '../components/FilterDropdown/FilterDropdown';
import ProductList from '../components/ProductList/ProductList';
import { useProducts } from '../hooks/useProducts';
import styles from './Products.module.css';

const DEFAULT_FILTERS = { brands: [], priceRange: null, minRating: 0 };

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');

  const queryParams = useMemo(() => {
    const p = {};
    if (category) p.category = category;
    if (sort) p.sort = sort;
    return p;
  }, [category, sort]);

  const { products, loading, error } = useProducts(queryParams);

  // Client-side filter + sort (supplement to server query params)
  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
      );
    }
    if (filters.brands.length) {
      list = list.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.priceRange) {
      list = list.filter(
        (p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
      );
    }
    if (filters.minRating) {
      list = list.filter((p) => (p.rating || 0) >= filters.minRating);
    }
    return list;
  }, [products, filters, search]);

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className={`container ${styles.inner}`}>
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />

        <main className={styles.main}>
          {/* Top bar */}
          <div className={styles.topBar}>
            <div className={styles.topLeft}>
              <h1 className={styles.pageTitle}>All Products</h1>
              {!loading && (
                <span className={styles.count}>{filtered.length} items</span>
              )}
            </div>
            <div className={styles.topRight}>
              <div className={styles.searchWrap}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className={styles.searchInput}
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <FilterDropdown value={sort} onChange={setSort} />
            </div>
          </div>

          <ProductList products={filtered} loading={loading} error={error} />
        </main>
      </div>
    </div>
  );
};

export default Products;
