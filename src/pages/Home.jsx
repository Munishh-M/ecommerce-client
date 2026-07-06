import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Home() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={s.page}>

      {/* NAVBAR */}
      <nav style={s.nav}>
        <div style={s.navLogo}>🛍️ ShopMart</div>
        <div style={s.navLinks}>
          <Link to="/shop" style={s.navLink}>Shop</Link>
          {user && <Link to="/orders" style={s.navLink}>My Orders</Link>}
          {user?.role === 'admin' && <Link to="/admin" style={s.navLink}>Admin</Link>}
        </div>
        <div style={s.navRight}>
          <Link to="/cart" style={s.cartBtn}>
            🛒 {cartCount > 0 && <span style={s.cartBadge}>{cartCount}</span>}
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={s.userName}>Hi, {user.name}!</span>
              <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" style={s.loginBtn}>Login</Link>
              <Link to="/signup" style={s.signupBtn}>Sign Up</Link>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroBadge}>⚡ New Arrivals Every Week</div>
          <h1 style={s.heroTitle}>
            Discover Amazing<br />
            <span style={s.heroAccent}>Products</span> at Great Prices
          </h1>
          <p style={s.heroDesc}>
            Shop the latest products with fast delivery, easy returns and secure payments powered by Stripe.
          </p>
          <div style={s.heroBtns}>
            <Link to="/shop" style={s.heroPrimaryBtn}>Shop Now →</Link>
            {!user && <Link to="/signup" style={s.heroSecondaryBtn}>Create Account</Link>}
          </div>
          <div style={s.heroStats}>
            <div style={s.heroStat}>
              <div style={s.heroStatNum}>500+</div>
              <div style={s.heroStatLbl}>Products</div>
            </div>
            <div style={s.heroStat}>
              <div style={s.heroStatNum}>10K+</div>
              <div style={s.heroStatLbl}>Happy Customers</div>
            </div>
            <div style={s.heroStat}>
              <div style={s.heroStatNum}>100%</div>
              <div style={s.heroStatLbl}>Secure Payment</div>
            </div>
          </div>
        </div>
        <div style={s.heroImage}>🛍️</div>
      </div>

      {/* CATEGORIES */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Shop by Category</h2>
        <div style={s.categoryGrid}>
          {[
            { icon: '📱', name: 'Electronics' },
            { icon: '👗', name: 'Fashion' },
            { icon: '🏠', name: 'Home & Living' },
            { icon: '🍳', name: 'Kitchen' },
            { icon: '💄', name: 'Beauty' },
            { icon: '📚', name: 'Books' },
          ].map(cat => (
            <Link to="/shop" key={cat.name} style={s.categoryCard}>
              <div style={s.categoryIcon}>{cat.icon}</div>
              <div style={s.categoryName}>{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* FEATURES BAR */}
      <div style={s.featuresBar}>
        {[
          { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
          { icon: '🔒', title: 'Secure Payment', desc: 'Powered by Stripe' },
          { icon: '↩️', title: 'Easy Returns', desc: '7 day return policy' },
          { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
        ].map(f => (
          <div key={f.title} style={s.featureItem}>
            <div style={s.featureIcon}>{f.icon}</div>
            <div>
              <div style={s.featureTitle}>{f.title}</div>
              <div style={s.featureDesc}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA SECTION */}
      {!user && (
        <div style={s.cta}>
          <h2 style={s.ctaTitle}>Ready to start shopping?</h2>
          <p style={s.ctaDesc}>Create a free account and get access to exclusive deals!</p>
          <Link to="/signup" style={s.ctaBtn}>Get Started — It's Free</Link>
        </div>
      )}

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerLogo}>🛍️ ShopMart</div>
        <p style={s.footerText}>© 2026 ShopMart. Built with MERN Stack + Stripe.</p>
      </footer>

    </div>
  );
}

const s = {
  page: { fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f8f9fc', minHeight: '100vh' },

  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  navLogo: { fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e' },
  navLinks: { display: 'flex', gap: '1.5rem' },
  navLink: { textDecoration: 'none', color: '#555', fontSize: '0.9rem', fontWeight: '500' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  cartBtn: { textDecoration: 'none', fontSize: '1.3rem', position: 'relative', display: 'inline-block' },
  cartBadge: { position: 'absolute', top: '-6px', right: '-8px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: '0.9rem', color: '#555', fontWeight: '500' },
  logoutBtn: { padding: '6px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '0.85rem', color: '#555' },
  loginBtn: { padding: '6px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', color: '#555' },
  signupBtn: { padding: '6px 14px', background: '#6c63ff', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' },

  hero: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto', gap: '2rem' },
  heroContent: { flex: 1 },
  heroBadge: { display: 'inline-block', background: '#ede9fe', color: '#6c63ff', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '1.25rem' },
  heroTitle: { fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#1a1a2e', lineHeight: '1.2', marginBottom: '1rem' },
  heroAccent: { color: '#6c63ff' },
  heroDesc: { color: '#6b7280', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '480px' },
  heroBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2.5rem' },
  heroPrimaryBtn: { background: '#6c63ff', color: 'white', padding: '13px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' },
  heroSecondaryBtn: { background: 'white', color: '#6c63ff', padding: '13px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', border: '2px solid #6c63ff' },
  heroStats: { display: 'flex', gap: '2.5rem' },
  heroStat: {},
  heroStatNum: { fontSize: '1.6rem', fontWeight: '800', color: '#1a1a2e' },
  heroStatLbl: { fontSize: '0.8rem', color: '#9ca3af' },
  heroImage: { fontSize: '10rem', opacity: 0.15 },

  section: { padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' },
  sectionTitle: { fontSize: '1.6rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.5rem', textAlign: 'center' },

  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' },
  categoryCard: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.5rem', textAlign: 'center', textDecoration: 'none', display: 'block' },
  categoryIcon: { fontSize: '2rem', marginBottom: '8px' },
  categoryName: { fontSize: '0.88rem', fontWeight: '600', color: '#1a1a2e' },

  featuresBar: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', padding: '2rem', background: 'white', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  featureIcon: { fontSize: '1.8rem' },
  featureTitle: { fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e' },
  featureDesc: { fontSize: '0.8rem', color: '#9ca3af' },

  cta: { textAlign: 'center', padding: '5rem 2rem', background: 'linear-gradient(135deg, #6c63ff, #a78bfa)' },
  ctaTitle: { fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.75rem' },
  ctaDesc: { color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', fontSize: '1rem' },
  ctaBtn: { background: 'white', color: '#6c63ff', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem' },

  footer: { textAlign: 'center', padding: '2rem', background: '#1a1a2e' },
  footerLogo: { fontSize: '1.2rem', fontWeight: '700', color: 'white', marginBottom: '6px' },
  footerText: { fontSize: '0.8rem', color: '#9ca3af' },
};

export default Home;