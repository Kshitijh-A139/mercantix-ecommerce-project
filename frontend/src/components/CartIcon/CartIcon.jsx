import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './CartIcon.module.css';

const CartIcon = () => {
  const { count } = useCart();

  return (
    <Link to="/cart" className={styles.wrap}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span className={styles.badge}>{count > 99 ? '99+' : count}</span>
      )}
    </Link>
  );
};

export default CartIcon;
