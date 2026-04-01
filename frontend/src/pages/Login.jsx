import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm/LoginForm';
import styles from './AuthPage.module.css';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered;

  useEffect(() => {
    if (user) navigate('/user', { replace: true });
  }, [user, navigate]);

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className={styles.layout}>
        {/* Left panel */}
        <div className={styles.panel}>
          <div className={styles.panelInner}>
            <div className={styles.panelBlob} />
            <div className={styles.panelContent}>
              <div className={styles.lockIcon}></div>
              <h2 className={styles.panelTitle}>Welcome to<br />Mercantix.</h2>
              <p className={styles.panelSub}>
                A Simple E-commerce Platform for Everyone. <br />
              </p>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className={styles.formSide}>
          <div className={styles.formCard}>
            <h1 className={styles.formTitle}>Login</h1>
            <p className={styles.formSub}>Please fill in your details to sign in.</p>

            {justRegistered && (
              <div className={styles.successBanner}>
                ✓ Account created! Please log in.
              </div>
            )}

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
