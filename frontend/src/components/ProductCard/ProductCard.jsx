import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../Button/Button';
import { formatPrice, renderStars, truncate } from '../../utils/formatters';
import styles from './ProductCard.module.css';

const StarRating = ({ rating }) => {
  const { full, half, empty } = renderStars(rating);
  return (
    <span className={styles.stars}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  );
};

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <Link to={`/product/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        {product.discount > 0 && (
          <span className={styles.badge}>-{product.discount}%</span>
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.brand}>{product.brand}</p>
        <h3 className={styles.name}>{truncate(product.name, 42)}</h3>

        <div className={styles.ratingRow}>
          <StarRating rating={product.rating || 0} />
          <span className={styles.ratingCount}>({product.reviewCount || 0})</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
          >
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
