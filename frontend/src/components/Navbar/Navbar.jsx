import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => (
  <header className={styles.header}>
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoMark}>m</span>
        <span className={styles.logoText}>Mercantix</span>
      </Link>
    </nav>
  </header>
);

export default Navbar;
