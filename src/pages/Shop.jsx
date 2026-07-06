import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { addToCart, cartCount } = useCart();
  const { user, logout } = useAuth();

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Kitchen', 'Beauty', 'Books'];

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div style={s.page}>

      {/* NAVBAR */}
      <nav style={s.nav}>
        <Link to="/" style={s.navLogo}>🛍️ ShopMart</Link>
        <div style={s.navLinks}>
          <Link to="/" style={s.navLink}>Home</Link>
          {user && <Link to="/orders" style={s.navLink}>My Orders</Link>}
          {user?.role === 'admin' && <Link to="/admin" style={s.navLink}>Admin</Link>}
        </div>
        <div style={s.navRight}>
          <Link to="/cart" style={s.cartBtn}>
            🛒 Cart {cartCount > 0 && <span style={s.cartBadge}>{cartCount}</span>}
          </Link>
          {user ? (
            <button onClick={logout} style={s.logoutBtn}>Logout</button>
          ) : (
            <Link to="/login" style={s.loginBtn}>Login</Link>
          )}
        </div>
      </nav>

      <div style={s.container}>

        {/* HEADER */}
        <div style={s.header}>
          <h1 style={s.title}>All Products</h1>
          <p style={s.subtitle}>{filtered.length} products found</p>
        </div>

        {/* SEARCH & FILTER */}
        <div style={s.searchRow}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
        </div>

        <div style={s.categoryRow}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...s.catBtn,
                ...(category === cat ? s.catBtnActive : {})
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>No products found. Try a different search!</p>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map(p => (
              <div key={p._id} style={s.card}>
                <div style={s.imgWrap}>
                  <img src={p.imageUrl} alt={p.name} style={s.img} />
                  {p.stock < 5 && p.stock > 0 && (
                    <span style={s.lowStockBadge}>Only {p.stock} left!</span>
                  )}
                  {p.stock === 0 && (
                    <span style={{...s.lowStockBadge, background: '#ef4444'}}>Out of Stock</span>
                  )}
                </div>
                <div style={s.cardBody}>
                  <div style={s.cardCategory}>{p.category}</div>
                  <div style={s.cardName}>{p.name}</div>
                  <div style={s.cardDesc}>{p.description?.slice(0, 60)}...</div>
                  <div style={s.cardFooter}>
                    <div style={s.cardPrice}>₹{Number(p.price).toLocaleString()}</div>
                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stock === 0}
                      style={{
                        ...s.addBtn,
                        ...(p.stock === 0 ? s.addBtnDisabled : {})
                      }}
                    >
                      {p.stock === 0 ? 'Out of Stock' : '+ Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer style={s.footer}>
        <p style={s.footerText}>© 2026 ShopMart. Built with MERN Stack.</p>
      </footer>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f8f9fc', minHeight: '100vh' },

  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  navLogo: { fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', textDecoration: 'none' },
  navLinks: { display: 'flex', gap: '1.5rem' },
  navLink: { textDecoration: 'none', color: '#555', fontSize: '0.9rem', fontWeight: '500' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  cartBtn: { textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', background: '#f3f4f6', padding: '7px 14px', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' },
  cartBadge: { background: '#6c63ff', color: 'white', borderRadius: '20px', padding: '1px 7px', fontSize: '11px', fontWeight: '700' },
  logoutBtn: { padding: '6px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '0.85rem', color: '#555' },
  loginBtn: { padding: '6px 14px', background: '#6c63ff', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' },

  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  header: { marginBottom: '1.5rem' },
  title: { fontSize: '1.8rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '4px' },
  subtitle: { fontSize: '0.9rem', color: '#9ca3af' },

  searchRow: { marginBottom: '1rem' },
  searchInput: { width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', background: 'white' },

  categoryRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' },
  catBtn: { padding: '6px 16px', border: '1.5px solid #e5e7eb', borderRadius: '20px', background: 'white', color: '#555', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500' },
  catBtnActive: { background: '#6c63ff', color: 'white', borderColor: '#6c63ff' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.25rem' },
  card: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', overflow: 'hidden', transition: 'all 0.2s' },
  imgWrap: { position: 'relative' },
  img: { width: '100%', height: '180px', objectFit: 'cover' },
  lowStockBadge: { position: 'absolute', top: '8px', left: '8px', background: '#f59e0b', color: 'white', fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' },
  cardBody: { padding: '1rem' },
  cardCategory: { fontSize: '11px', color: '#6c63ff', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' },
  cardName: { fontSize: '0.95rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' },
  cardDesc: { fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px', lineHeight: '1.4' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: '1.1rem', fontWeight: '800', color: '#1a1a2e' },
  addBtn: { background: '#6c63ff', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
  addBtnDisabled: { background: '#e5e7eb', color: '#9ca3af', cursor: 'not-allowed' },

  empty: { textAlign: 'center', padding: '4rem', color: '#9ca3af' },
  footer: { textAlign: 'center', padding: '1.5rem', background: '#1a1a2e', marginTop: '3rem' },
  footerText: { fontSize: '0.8rem', color: '#9ca3af' },
};

export default Shop;