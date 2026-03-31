import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';
import { formatPrice } from '../utils/formatters';
import { validateCheckoutForm } from '../utils/validators';
import styles from './Checkout.module.css';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
];

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState('card');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const shippingFee = total >= 999 ? 0 : 79;
  const grandTotal = total + shippingFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateCheckoutForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!items.length) { navigate('/cart'); return; }

    setLoading(true);
    setApiError('');
    try {
      await placeOrder({
        shippingAddress: form,
        paymentMethod: payment,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity, price: i.price })),
        total: grandTotal,
      });
      clearCart();
      setSuccess(true);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`page-wrapper ${styles.page}`}>
        <div className={styles.successState}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.successTitle}>Order Placed!</h2>
          <p className={styles.successSub}>
            Thank you for shopping with mercantix.<br />
            You'll receive a confirmation email shortly.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (!items.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className={`container ${styles.inner}`}>
        <h1 className={styles.title}>Checkout</h1>

        <form className={styles.layout} onSubmit={handleSubmit} noValidate>
          {/* Left: address + payment */}
          <div className={styles.formCol}>
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepBadge}>1</span>
                Shipping Address
              </h2>
              <div className={styles.formGrid}>
                <InputField label="Full Name" name="fullName" value={form.fullName}
                  onChange={handleChange} error={errors.fullName} required />
                <InputField label="Phone Number" name="phone" type="tel" value={form.phone}
                  onChange={handleChange} error={errors.phone} required />
                <InputField label="Email" name="email" type="email" value={form.email}
                  onChange={handleChange} error={errors.email} />
                <div className={styles.fullRow}>
                  <InputField label="Address" name="address" value={form.address}
                    onChange={handleChange} error={errors.address}
                    placeholder="House / Flat No., Street, Locality" required />
                </div>
                <InputField label="City" name="city" value={form.city}
                  onChange={handleChange} error={errors.city} required />
                <InputField label="State" name="state" value={form.state}
                  onChange={handleChange} error={errors.state} />
                <InputField label="Pincode" name="pincode" value={form.pincode}
                  onChange={handleChange} error={errors.pincode} required />
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepBadge}>2</span>
                Payment Method
              </h2>
              <div className={styles.paymentList}>
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`${styles.paymentOption} ${payment === m.id ? styles.paymentSelected : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={payment === m.id}
                      onChange={() => setPayment(m.id)}
                    />
                    <span className={styles.paymentIcon}>{m.icon}</span>
                    <span className={styles.paymentLabel}>{m.label}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right: order summary */}
          <aside className={styles.summary}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.stepBadge}>3</span>
              Order Summary
            </h2>

            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryItemImg}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} />
                      : <span>🛍️</span>
                    }
                  </div>
                  <div className={styles.summaryItemInfo}>
                    <p className={styles.summaryItemName}>{item.name}</p>
                    <p className={styles.summaryItemQty}>Qty: {item.quantity}</p>
                  </div>
                  <p className={styles.summaryItemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.pricingRows}>
              <div className={styles.pricingRow}>
                <span>Subtotal</span><span>{formatPrice(total)}</span>
              </div>
              <div className={styles.pricingRow}>
                <span>Shipping</span>
                <span className={shippingFee === 0 ? styles.free : ''}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.grandTotal}>
              <span>Grand Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            {apiError && <p className={styles.apiError}>{apiError}</p>}

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Place Order
            </Button>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
