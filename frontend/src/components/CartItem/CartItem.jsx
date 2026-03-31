import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import styles from './CartItem.module.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className={styles.item}>
      <div className={styles.imageWrap}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>🛍️</div>
        )}
      </div>

      <div className={styles.details}>
        <Link to={`/product/${item.id}`} className={styles.name}>
          {item.name}
        </Link>
        <p className={styles.brand}>{item.brand}</p>
        <p className={styles.price}>{formatPrice(item.price)}</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.qtyWrap}>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >−</button>
          <span className={styles.qty}>{item.quantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >+</button>
        </div>

        <p className={styles.subtotal}>{formatPrice(item.price * item.quantity)}</p>

        <button
          className={styles.removeBtn}
          onClick={() => removeItem(item.id)}
          aria-label="Remove item"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
