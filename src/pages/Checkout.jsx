import API_URL from '../config';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const stripePromise = loadStripe('pk_test_51Tm59JDl0qi0i4Cq6paKiw63pPekuSV2lWCs9NcWcHkzC1YxUJ6Z2BG49COisBJfSpWBw1J0anpFoiod92rg72OE006F6jfTHX');

function PaymentForm({ address, phone }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required'
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const items = cart.map(item => ({
          product: item._id,
          quantity: item.qty,
          priceAtPurchase: item.price
        }));
        await axios.post('http://localhost:5000/api/orders', {
          items, totalAmount: cartTotal, address, phone
        }, config);
        clearCart();
        navigate('/order-success');
      } catch (err) {
        setError('Payment succeeded but order saving failed. Please contact support.');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlePay}>
      <div style={s.paymentBox}>
        <h3 style={s.stepTitle}>💳 Payment Details</h3>
        <p style={s.paymentNote}>Use test card: <strong>4242 4242 4242 4242</strong> · Any future date · Any CVC</p>
        <PaymentElement />
      </div>
      {error && <p style={s.error}>{error}</p>}
      <button type="submit" disabled={!stripe || loading} style={s.payBtn}>
        {loading ? 'Processing payment...' : `Pay ₹${cartTotal.toLocaleString()} →`}
      </button>
      <p style={s.secureNote}>🔒 Secured by Stripe. Your card info is never stored.</p>
    </form>
  );
}

function Checkout() {
  const { cart, cartTotal } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const handleGetPaymentIntent = async () => {
    if (!address || !phone) {
      setError('Please fill in both address and phone number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/orders/create-payment-intent',
        { amount: cartTotal },
        config
      );
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>

      {/* NAVBAR */}
      <nav style={s.nav}>
        <Link to="/" style={s.navLogo}>🛍️ ShopMart</Link>
        <Link to="/cart" style={s.backLink}>← Back to Cart</Link>
      </nav>

      <div style={s.container}>
        <h1 style={s.title}>Checkout</h1>

        <div style={s.layout}>

          {/* LEFT — FORM */}
          <div>
            {/* STEP 1 — DELIVERY */}
            <div style={s.card}>
              <h3 style={s.stepTitle}>📦 Delivery Details</h3>
              <div style={s.field}>
                <label style={s.label}>Full Delivery Address</label>
                <textarea
                  placeholder="Door no, Street, Area, City, Pincode"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  style={s.textarea}
                  rows={3}
                  disabled={!!clientSecret}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={s.input}
                  disabled={!!clientSecret}
                />
              </div>
              {error && <p style={s.error}>{error}</p>}
              {!clientSecret && (
                <button onClick={handleGetPaymentIntent} disabled={loading} style={s.continueBtn}>
                  {loading ? 'Setting up payment...' : 'Continue to Payment →'}
                </button>
              )}
            </div>

            {/* STEP 2 — PAYMENT */}
            {clientSecret && (
              <div style={s.card}>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm address={address} phone={phone} />
                </Elements>
              </div>
            )}
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div style={s.summary}>
            <h3 style={s.summaryTitle}>Order Summary</h3>
            {cart.map(item => (
              <div key={item._id} style={s.summaryItem}>
                <img src={item.imageUrl} alt={item.name} style={s.summaryImg} />
                <div style={s.summaryItemInfo}>
                  <div style={s.summaryItemName}>{item.name}</div>
                  <div style={s.summaryItemQty}>Qty: {item.qty}</div>
                </div>
                <div style={s.summaryItemPrice}>₹{(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}
            <div style={s.summaryDivider} />
            <div style={s.summaryRow}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div style={s.summaryRow}>
              <span>Delivery</span>
              <span style={{ color: '#16a34a' }}>{cartTotal >= 499 ? 'FREE' : '₹49'}</span>
            </div>
            <div style={s.summaryDivider} />
            <div style={s.summaryTotal}>
              <span>Total</span>
              <span>₹{(cartTotal + (cartTotal >= 499 ? 0 : 49)).toLocaleString()}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f8f9fc', minHeight: '100vh' },

  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  navLogo: { fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', textDecoration: 'none' },
  backLink: { textDecoration: 'none', color: '#6c63ff', fontSize: '0.9rem', fontWeight: '500' },

  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '1.8rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1.5rem' },

  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' },

  card: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' },
  stepTitle: { fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.25rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.82rem', fontWeight: '500', color: '#555', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' },
  error: { color: '#ef4444', fontSize: '13px', marginBottom: '1rem', background: '#fef2f2', padding: '10px', borderRadius: '8px', border: '1px solid #fecaca' },
  continueBtn: { width: '100%', padding: '12px', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' },

  paymentBox: { marginBottom: '1.25rem' },
  paymentNote: { fontSize: '12px', color: '#9ca3af', background: '#f3f4f6', padding: '8px 12px', borderRadius: '8px', marginBottom: '1rem' },
  payBtn: { width: '100%', padding: '13px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '1rem' },
  secureNote: { textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '10px' },

  summary: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.5rem', position: 'sticky', top: '80px' },
  summaryTitle: { fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.25rem' },
  summaryItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  summaryImg: { width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb', flexShrink: 0 },
  summaryItemInfo: { flex: 1 },
  summaryItemName: { fontSize: '0.85rem', fontWeight: '600', color: '#1a1a2e' },
  summaryItemQty: { fontSize: '0.78rem', color: '#9ca3af' },
  summaryItemPrice: { fontSize: '0.88rem', fontWeight: '700', color: '#1a1a2e' },
  summaryDivider: { borderTop: '1px solid #e5e7eb', margin: '12px 0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#555', marginBottom: '8px' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: '800', color: '#1a1a2e' },
};

export default Checkout;
