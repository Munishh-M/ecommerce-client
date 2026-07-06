import { Link } from 'react-router-dom';

function OrderSuccess() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link to="/" style={s.navLogo}>🛍️ ShopMart</Link>
      </nav>

      <div style={s.container}>
        <div style={s.card}>
          <div style={s.iconCircle}>✅</div>
          <h1 style={s.title}>Order Placed Successfully!</h1>
          <p style={s.desc}>Thank you for shopping with us! Your order has been confirmed and is being processed. You will receive a confirmation shortly.</p>

          <div style={s.infoBox}>
            <div style={s.infoRow}>
              <span>🚚</span>
              <span>Your order will be delivered within 3-5 business days</span>
            </div>
            <div style={s.infoRow}>
              <span>📦</span>
              <span>You can track your order in "My Orders" section</span>
            </div>
            <div style={s.infoRow}>
              <span>💬</span>
              <span>Need help? Contact our 24/7 support team</span>
            </div>
          </div>

          <div style={s.btns}>
            <Link to="/orders" style={s.ordersBtn}>📦 View My Orders</Link>
            <Link to="/shop" style={s.shopBtn}>Continue Shopping →</Link>
          </div>
        </div>
      </div>

      <footer style={s.footer}>
        <p style={s.footerText}>© 2026 ShopMart. Built with MERN Stack.</p>
      </footer>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f8f9fc', minHeight: '100vh' },
  nav: { display: 'flex', alignItems: 'center', padding: '1rem 2rem', background: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  navLogo: { fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', textDecoration: 'none' },
  container: { maxWidth: '600px', margin: '4rem auto', padding: '0 1rem' },
  card: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '3rem 2rem', textAlign: 'center' },
  iconCircle: { width: '80px', height: '80px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' },
  title: { fontSize: '1.8rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1rem' },
  desc: { color: '#6b7280', lineHeight: '1.7', marginBottom: '2rem', fontSize: '0.95rem' },
  infoBox: { background: '#f8f9fc', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' },
  infoRow: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#555', marginBottom: '10px' },
  btns: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  ordersBtn: { background: '#6c63ff', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' },
  shopBtn: { background: 'white', color: '#6c63ff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', border: '2px solid #6c63ff' },
  footer: { textAlign: 'center', padding: '1.5rem', background: '#1a1a2e', marginTop: '3rem' },
  footerText: { fontSize: '0.8rem', color: '#9ca3af' },
};

export default OrderSuccess;