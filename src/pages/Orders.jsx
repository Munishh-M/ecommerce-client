import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/my-orders', config)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status) => {
    const colors = {
      pending: { bg: '#fff8e1', color: '#b45309' },
      shipped: { bg: '#e0f2fe', color: '#0369a1' },
      delivered: { bg: '#d1fae5', color: '#16a34a' },
      cancelled: { bg: '#fee2e2', color: '#dc2626' }
    };
    return colors[status] || colors.pending;
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link to="/" style={s.navLogo}>🛍️ ShopMart</Link>
        <Link to="/shop" style={s.shopLink}>🛍️ Continue Shopping</Link>
      </nav>

      <div style={s.container}>
        <h1 style={s.title}>My Orders</h1>

        {loading ? (
          <div style={s.loading}>Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>No orders yet</h2>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Looks like you haven't placed any orders yet!</p>
            <Link to="/shop" style={s.shopBtn}>Start Shopping →</Link>
          </div>
        ) : (
          <div>
            <p style={s.orderCount}>{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>
            {orders.map(order => (
              <div key={order._id} style={s.orderCard}>

                {/* ORDER HEADER */}
                <div style={s.orderHeader}>
                  <div>
                    <div style={s.orderId}>Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div style={s.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      ...s.statusBadge,
                      background: statusColor(order.status).bg,
                      color: statusColor(order.status).color
                    }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span style={{
                      ...s.statusBadge,
                      background: order.paymentStatus === 'paid' ? '#d1fae5' : '#fee2e2',
                      color: order.paymentStatus === 'paid' ? '#16a34a' : '#dc2626'
                    }}>
                      {order.paymentStatus === 'paid' ? '✅ Paid' : '❌ Unpaid'}
                    </span>
                  </div>
                </div>

                {/* ORDER ITEMS */}
                <div style={s.orderItems}>
                  {order.items.map((item, i) => (
                    <div key={i} style={s.orderItem}>
                      {item.product?.imageUrl && (
                        <img src={item.product.imageUrl} alt="" style={s.itemImg} />
                      )}
                      <div style={s.itemInfo}>
                        <div style={s.itemName}>{item.product?.name || 'Product'}</div>
                        <div style={s.itemQty}>Qty: {item.quantity}</div>
                      </div>
                      <div style={s.itemPrice}>₹{(item.priceAtPurchase * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                {/* ORDER FOOTER */}
                <div style={s.orderFooter}>
                  <div style={s.deliveryAddr}>
                    📍 {order.address}
                  </div>
                  <div style={s.orderTotal}>
                    Total: <strong>₹{order.totalAmount.toLocaleString()}</strong>
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
  shopLink: { textDecoration: 'none', color: '#6c63ff', fontSize: '0.9rem', fontWeight: '500' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '1.8rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '0.5rem' },
  orderCount: { fontSize: '0.9rem', color: '#9ca3af', marginBottom: '1.5rem' },
  loading: { textAlign: 'center', padding: '3rem', color: '#9ca3af' },
  empty: { textAlign: 'center', padding: '4rem' },
  shopBtn: { background: '#6c63ff', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' },

  orderCard: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', marginBottom: '1.25rem', overflow: 'hidden' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.25rem', borderBottom: '1px solid #f3f4f6' },
  orderId: { fontSize: '0.95rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '3px' },
  orderDate: { fontSize: '0.8rem', color: '#9ca3af' },
  statusBadge: { fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' },

  orderItems: { padding: '1rem 1.25rem' },
  orderItem: { display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid #f9fafb' },
  itemImg: { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb', flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: '0.88rem', fontWeight: '600', color: '#1a1a2e' },
  itemQty: { fontSize: '0.78rem', color: '#9ca3af' },
  itemPrice: { fontSize: '0.9rem', fontWeight: '700', color: '#1a1a2e' },

  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: '#f9fafb', borderTop: '1px solid #f3f4f6' },
  deliveryAddr: { fontSize: '0.82rem', color: '#6b7280', maxWidth: '400px' },
  orderTotal: { fontSize: '0.95rem', color: '#1a1a2e' },

  footer: { textAlign: 'center', padding: '1.5rem', background: '#1a1a2e', marginTop: '3rem' },
  footerText: { fontSize: '0.8rem', color: '#9ca3af' },
};

export default Orders;