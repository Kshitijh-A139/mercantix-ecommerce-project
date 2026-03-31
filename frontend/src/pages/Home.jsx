import { useNavigate } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav/CategoryNav';
import ProductList from '../components/ProductList/ProductList';
import Button from '../components/Button/Button';
import { useProducts } from '../hooks/useProducts';
import styles from './Home.module.css';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.heroBadge}>✦ New arrivals every week</span>
        <h1 className={styles.heroHeadline}>
          Experience<br />
          <span className={styles.heroGradient}>Effortless</span><br />
          Shopping.
        </h1>
        <p className={styles.heroSub}>
          Simplify your e-commerce management with our<br />
          user-friendly dashboard and smart product discovery.
        </p>
        <div className={styles.heroCtas}>
          <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
            Get Started
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/register')}>
            Create Account
          </Button>
        </div>
        <div className={styles.heroStats}>
          {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([n, l]) => (
            <div key={l} className={styles.stat}>
              <span className={styles.statNum}>{n}</span>
              <span className={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.heroCard}>
          <div className={styles.heroCardInner}>
            <div className={styles.heroBlob} />
            <div className={styles.heroIconGrid}>
              {['💻', '👗', '🏠', '⚽', '✨', '📚', '🎮', '🧺', '📱'].map((icon, i) => (
                <div key={i} className={styles.heroIconItem} style={{ animationDelay: `${i * 0.1}s` }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const { products, loading, error } = useProducts({ limit: 8 });

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        <Hero />
        <section>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <CategoryNav />
        </section>
        <section className={styles.featured}>
          <div className={styles.featuredHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <Button variant="secondary" size="sm" onClick={() => window.location.href = '/products'}>
              View All →
            </Button>
          </div>
          <ProductList products={products} loading={loading} error={error} />
        </section>
      </div>
    </div>
  );
};

export default Home;
