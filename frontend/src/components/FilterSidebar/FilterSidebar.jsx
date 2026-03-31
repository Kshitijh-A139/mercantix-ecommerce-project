import { useState } from 'react';
import styles from './FilterSidebar.module.css';

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Zara', 'LG', 'Boat'];
const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹2,000', min: 500, max: 2000 },
  { label: '₹2,000 – ₹10,000', min: 2000, max: 10000 },
  { label: '₹10,000 – ₹50,000', min: 10000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: Infinity },
];
const RATINGS = [4, 3, 2, 1];

const Section = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.section}>
      <button className={styles.sectionHead} onClick={() => setOpen((p) => !p)}>
        <span>{title}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
};

const FilterSidebar = ({ filters, onChange, onReset }) => {
  const toggleBrand = (brand) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: next });
  };

  const setPriceRange = (range) => {
    onChange({ ...filters, priceRange: range });
  };

  const setMinRating = (r) => {
    onChange({ ...filters, minRating: filters.minRating === r ? 0 : r });
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filters</h3>
        <button className={styles.reset} onClick={onReset}>Reset all</button>
      </div>

      <Section title="Brand">
        <div className={styles.checkList}>
          {BRANDS.map((brand) => (
            <label key={brand} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className={styles.radioList}>
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className={styles.radioItem}>
              <input
                type="radio"
                name="priceRange"
                checked={
                  filters.priceRange?.min === range.min &&
                  filters.priceRange?.max === range.max
                }
                onChange={() => setPriceRange(range)}
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Rating">
        <div className={styles.ratingList}>
          {RATINGS.map((r) => (
            <button
              key={r}
              className={`${styles.ratingBtn} ${filters.minRating === r ? styles.ratingActive : ''}`}
              onClick={() => setMinRating(r)}
            >
              {'★'.repeat(r)}{'☆'.repeat(5 - r)}
              <span>&amp; above</span>
            </button>
          ))}
        </div>
      </Section>
    </aside>
  );
};

export default FilterSidebar;
