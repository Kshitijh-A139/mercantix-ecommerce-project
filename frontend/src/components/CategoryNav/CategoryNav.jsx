import { useNavigate } from 'react-router-dom';
import styles from './CategoryNav.module.css';

const CATEGORIES = [
  { id: 'electronics', label: 'Electronics', icon: '💻', color: '#dbeafe' },
  { id: 'fashion', label: 'Fashion', icon: '👗', color: '#fce7f3' },
  { id: 'home', label: 'Home Goods', icon: '🏠', color: '#dcfce7' },
  { id: 'sports', label: 'Sports', icon: '⚽', color: '#fef9c3' },
  { id: 'beauty', label: 'Beauty', icon: '✨', color: '#f3e8ff' },
  { id: 'books', label: 'Books', icon: '📚', color: '#ffedd5' },
  { id: 'toys', label: 'Toys', icon: '🎮', color: '#dbeafe' },
  { id: 'appliances', label: 'Appliances', icon: '🧺', color: '#f0fdf4' },
];

const CategoryNav = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={styles.card}
            style={{ '--cat-bg': cat.color }}
            onClick={() => navigate(`/products?category=${cat.id}`)}
          >
            <span className={styles.icon}>{cat.icon}</span>
            <span className={styles.label}>{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryNav;
