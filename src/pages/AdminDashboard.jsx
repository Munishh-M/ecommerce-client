import API_URL from '../config';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', imageUrl: '', category: '', stock: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const config = { headers: { Authorization: `Bearer ${user.token}` } };
  const categories = ['Electronics', 'Fashion', 'Home & Living', 'Kitchen', 'Beauty', 'Books'];

  const fetchProducts = async () => {
    try {
      const { data } = axios.get(`${API_URL}/api/products`)

      setProducts(data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      axios.post(`${API_URL}/api/products`, form, config)
      setMessage({ text: '✅ Product added successfully!', type: 'success' });
      setForm({ name: '', description: '', price: '', imageUrl: '', category: '', stock: '' });
      fetchProducts();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: '❌ Error adding product', type: 'error' });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      axios.delete(`${API_URL}/api/products/${id}`, config)
      fetchProducts();
    } catch (err) { console.log(err); }
  };

  if (user?.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to view this page.</p>
        <Link to="/">Go Home</Link>
      </div>
    );
  }

  return (
    <div style={s.page}>

      {/* NAVBAR */}
      <nav style={s.nav}>
        <Link to="/" style={s.navLogo}>🛍️ ShopMart</Link>
        <div style={s.navCenter}>
          <span style={s.adminBadge}>⚙️ Admin Panel</span>
        </div>
        <div style={s.navRight}>
          <span style={s.userName}>👤 {user.name}</span>
          <Link to="/shop" style={s.viewStoreBtn}>View Store →</Link>
        </div>
      </nav>

      <div style={s.container}>

        {/* STATS */}
        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <div style={s.statIcon}>📦</div>
            <div style={s.statNum}>{products.length}</div>
            <div style={s.statLbl}>Total Products</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statIcon}>✅</div>
            <div style={s.statNum}>{products.filter(p => p.stock > 0).length}</div>
            <div style={s.statLbl}>In Stock</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statIcon}>⚠️</div>
            <div style={s.statNum}>{products.filter(p => p.stock === 0).length}</div>
            <div style={s.statLbl}>Out of Stock</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statIcon}>🏷️</div>
            <div style={s.statNum}>{[...new Set(products.map(p => p.category))].length}</div>
            <div style={s.statLbl}>Categories</div>
          </div>
        </div>

        {/* TABS */}
        <div style={s.tabs}>
          <button style={{...s.tab, ...(activeTab === 'products' ? s.tabActive : {})}} onClick={() => setActiveTab('products')}>
            📦 Products ({products.length})
          </button>
          <button style={{...s.tab, ...(activeTab === 'add' ? s.tabActive : {})}} onClick={() => setActiveTab('add')}>
            ➕ Add Product
          </button>
        </div>

        {/* ADD PRODUCT FORM */}
        {activeTab === 'add' && (
          <div style={s.card}>
            <h3 style={s.cardTitle}>Add New Product</h3>
            {message.text && (
              <div style={{
                ...s.msgBox,
                background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: message.type === 'success' ? '#16a34a' : '#dc2626',
                border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
              }}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Product Name *</label>
                <input style={s.input} placeholder="e.g. Samsung Galaxy S24"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Category *</label>
                <select style={s.input} value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Price (₹) *</label>
                <input style={s.input} type="number" placeholder="e.g. 29999"
                  value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Stock Quantity *</label>
                <input style={s.input} type="number" placeholder="e.g. 50"
                  value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
              </div>
              <div style={{...s.field, gridColumn: '1 / -1'}}>
                <label style={s.label}>Image URL *</label>
                <input style={s.input} placeholder="https://placehold.co/300x300"
                  value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} required />
              </div>
              <div style={{...s.field, gridColumn: '1 / -1'}}>
                <label style={s.label}>Description *</label>
                <textarea style={{...s.input, resize: 'vertical'}} rows={3}
                  placeholder="Describe the product..."
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
              </div>
              <div style={{gridColumn: '1 / -1'}}>
                <button type="submit" disabled={loading} style={s.submitBtn}>
                  {loading ? 'Adding product...' : '+ Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PRODUCTS LIST */}
        {activeTab === 'products' && (
          <div style={s.card}>
            <h3 style={s.cardTitle}>All Products</h3>
            {products.length === 0 ? (
              <div style={s.empty}>
                <p>No products yet. Add your first product!</p>
                <button onClick={() => setActiveTab('add')} style={s.submitBtn}>+ Add Product</button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr style={s.thead}>
                      <th style={s.th}>Product</th>
                      <th style={s.th}>Category</th>
                      <th style={s.th}>Price</th>
                      <th style={s.th}>Stock</th>
                      <th style={s.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id} style={s.tr}>
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={p.imageUrl} alt={p.name} style={s.productImg} />
                            <div>
                              <div style={s.productName}>{p.name}</div>
                              <div style={s.productDesc}>{p.description?.slice(0, 40)}...</div>
                            </div>
                          </div>
                        </td>
                        <td style={s.td}>
                          <span style={s.categoryBadge}>{p.category}</span>
                        </td>
                        <td style={s.td}>
                          <span style={s.priceText}>₹{Number(p.price).toLocaleString()}</span>
                        </td>
                        <td style={s.td}>
                          <span style={{
                            ...s.stockBadge,
                            background: p.stock === 0 ? '#fee2e2' : p.stock < 5 ? '#fff8e1' : '#d1fae5',
                            color: p.stock === 0 ? '#dc2626' : p.stock < 5 ? '#b45309' : '#16a34a'
                          }}>
                            {p.stock === 0 ? 'Out of Stock' : `${p.stock} in stock`}
                          </span>
                        </td>
                        <td style={s.td}>
                          <button onClick={() => handleDelete(p._id)} style={s.deleteBtn}>
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <footer style={s.footer}>
        <p style={s.footerText}>© 2026 ShopMart Admin Panel</p>
      </footer>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f8f9fc', minHeight: '100vh' },

  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  navLogo: { fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', textDecoration: 'none' },
  navCenter: {},
  adminBadge: { background: '#ede9fe', color: '#6c63ff', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '600' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  userName: { fontSize: '0.88rem', color: '#555', fontWeight: '500' },
  viewStoreBtn: { background: '#6c63ff', color: 'white', padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' },

  container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '1.5rem' },
  statCard: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' },
  statIcon: { fontSize: '1.8rem', marginBottom: '8px' },
  statNum: { fontSize: '2rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '4px' },
  statLbl: { fontSize: '0.8rem', color: '#9ca3af' },

  tabs: { display: 'flex', gap: '8px', marginBottom: '1.25rem' },
  tab: { padding: '8px 20px', border: '1.5px solid #e5e7eb', borderRadius: '8px', background: 'white', color: '#555', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '500' },
  tabActive: { background: '#6c63ff', color: 'white', borderColor: '#6c63ff' },

  card: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.5rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.25rem' },
  msgBox: { padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', marginBottom: '1rem' },

  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: '500', color: '#555' },
  input: { padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' },
  submitBtn: { width: '100%', padding: '12px', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' },

  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f9fafb' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#9ca3af', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px 14px', fontSize: '13px', color: '#1a1a2e' },
  productImg: { width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb', flexShrink: 0 },
  productName: { fontSize: '0.88rem', fontWeight: '600', color: '#1a1a2e' },
  productDesc: { fontSize: '0.78rem', color: '#9ca3af', marginTop: '2px' },
  categoryBadge: { background: '#ede9fe', color: '#6c63ff', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  priceText: { fontWeight: '700', color: '#1a1a2e' },
  stockBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  deleteBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' },

  empty: { textAlign: 'center', padding: '3rem', color: '#9ca3af' },
  footer: { textAlign: 'center', padding: '1.5rem', background: '#1a1a2e', marginTop: '3rem' },
  footerText: { fontSize: '0.8rem', color: '#9ca3af' },
};

export default AdminDashboard;
