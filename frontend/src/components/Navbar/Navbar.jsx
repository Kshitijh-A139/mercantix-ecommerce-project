import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CartIcon from '../CartIcon/CartIcon';
import Button from '../Button/Button';
import styles from './Navbar.module.css';

const Logo = () => (
  <Link to="/" className={styles.logo}>
    <span className={styles.logoMark}>m</span>
    <span className={styles.logoText}>Mercantix</span>
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Logo />

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <CartIcon />
          {user ? (
            <div className={styles.userMenu}>
              <div className={styles.avatar}>
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </div>
          )}
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
