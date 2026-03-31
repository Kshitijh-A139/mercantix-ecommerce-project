import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import Button from '../components/Button/Button';
import { formatPrice, renderStars } from '../utils/formatters';
import styles from './ProductDetail.module.css';

const StarRating = ({ rating, count }) => {
  const { full, half, empty } = renderStars(rating);
  return (
    <div className={styles.ratingRow}>
      <span className={styles.stars}>
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
      </span>
      <span className={styles.ratingVal}>{Number(rating).toFixed(1)}</span>
      <span className={styles.ratingCount}>({count || 0} reviews)</span>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = items.some((i) => i.id === product?.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className={`page-wrapper ${styles.page}`}>
        <div className={`container ${styles.skeleton}`}>
          <div className={`${styles.skImg} skeleton`} />
          <div className={styles.skBody}>
            {[80, 50, 100, 60, 40].map((w, i) => (
              <div key={i} className={`${styles.skLine} skeleton`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`page-wrapper ${styles.page}`}>
        <div className={`container ${styles.errorState}`}>
          <p>Product not found.</p>
          <Button variant="primary" onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className={`container ${styles.inner}`}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <button onClick={() => navigate('/')}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')}>Products</button>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className={styles.layout}>
          {/* Image panel */}
          <div className={styles.imagePanel}>
            <div className={styles.mainImageWrap}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className={styles.mainImage} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span style={{ fontSize: 64 }}>🛍️</span>
                </div>
              )}
              {product.discount > 0 && (
                <span className={styles.discountBadge}>-{product.discount}%</span>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className={styles.infoPanel}>
            <span className={styles.brand}>{product.brand}</span>
            <h1 className={styles.name}>{product.name}</h1>

            <StarRating rating={product.rating || 0} count={product.reviewCount} />

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className={styles.description}>
              {product.description || 'No description available for this product.'}
            </p>

            {/* Quantity + Add to cart */}
            <div className={styles.actions}>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >−</button>
                <span className={styles.qty}>{qty}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => q + 1)}
                >+</button>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className={styles.addBtn}
              >
                {added ? '✓ Added to Cart!' : inCart ? 'Add More' : 'Add to Cart'}
              </Button>

              <Button variant="secondary" size="lg" onClick={() => navigate('/cart')}>
                View Cart
              </Button>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className={styles.tags}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}

            {/* Meta */}
            <div className={styles.meta}>
              {[
                ['Category', product.category],
                ['Stock', product.stock > 0 ? `${product.stock} units` : 'Out of Stock'],
                ['SKU', product.sku || `SKU-${product.id}`],
              ].map(([k, v]) => v && (
                <div key={k} className={styles.metaRow}>
                  <span className={styles.metaKey}>{k}:</span>
                  <span className={styles.metaVal}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
