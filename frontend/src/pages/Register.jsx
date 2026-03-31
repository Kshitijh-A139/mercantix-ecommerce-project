import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/RegisterForm/RegisterForm';
import styles from './AuthPage.module.css';

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className={styles.layout}>
        {/* Left panel */}
        <div className={styles.panel}>
          <div className={styles.panelInner}>
            <div className={styles.panelBlob} />
            <div className={styles.panelContent}>
              <div className={styles.lockIcon}>📊</div>
              <h2 className={styles.panelTitle}>Simplify Management<br />With Our Dashboard.</h2>
              <p className={styles.panelSub}>
                Simplify your e-commerce management with our<br />
                user-friendly admin dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className={styles.formSide}>
          <div className={styles.formCard}>
            <p className={styles.welcomeTag}>Welcome to mercantix</p>
            <h1 className={styles.formTitle}>Create Your Account</h1>
            <p className={styles.formSub}>Please fill in your details to register.</p>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
