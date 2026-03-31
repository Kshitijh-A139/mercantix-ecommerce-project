import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductList.module.css';

const SkeletonCard = () => (
  <div className={styles.skeleton}>
    <div className={`${styles.skeletonImg} skeleton`} />
    <div className={styles.skeletonBody}>
      <div className={`${styles.skeletonLine} skeleton`} style={{ width: '40%' }} />
      <div className={`${styles.skeletonLine} skeleton`} style={{ width: '80%' }} />
      <div className={`${styles.skeletonLine} skeleton`} style={{ width: '55%' }} />
    </div>
  </div>
);

const ProductList = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.empty}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>{error}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className={styles.empty}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <p>No products found</p>
        <span>Try adjusting your filters</span>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductList;
