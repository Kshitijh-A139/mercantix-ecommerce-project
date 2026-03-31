import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem/CartItem';
import Button from '../components/Button/Button';
import { formatPrice } from '../utils/formatters';
import styles from './Cart.module.css';

const SHIPPING_THRESHOLD = 999;

const Cart = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const shippingFee = total >= SHIPPING_THRESHOLD ? 0 : 79;
  const grandTotal = total + shippingFee;

  if (!items.length) {
    return (
      <div className={`page-wrapper ${styles.page}`}>
        <div className={`container ${styles.emptyState}`}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptySub}>Looks like you haven't added anything yet.</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Cart</h1>
          <button className={styles.clearBtn} onClick={clearCart}>Clear all</button>
        </div>

        <div className={styles.layout}>
          {/* Items list */}
          <div className={styles.itemsList}>
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order summary */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className={shippingFee === 0 ? styles.freeShipping : ''}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className={styles.freeShippingHint}>
                  Add {formatPrice(SHIPPING_THRESHOLD - total)} more for free shipping!
                </p>
              )}
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </Button>

            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
