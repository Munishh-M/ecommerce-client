import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  return (
    <div style={s.page}>

      {/* NAVBAR */}
      <nav style={s.nav}>
        <Link to="/" style={s.navLogo}>🛍️ ShopMart</Link>
        <div style={s.navRight}>
          <Link to="/shop" style={s.shopLink}>← Continue Shopping</Link>
        </div>
      </nav>

      <div style={s.container}>
        <h1 style={s.title}>Shopping Cart</h1>

        {cart.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Your cart is empty</h2>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Looks like you haven't added anything yet!</p>
            <Link to="/shop" style={s.shopBtn}>Go Shopping →</Link>
          </div>
        ) : (
          <div style={s.layout}>

            {/* CART ITEMS */}
            <div style={s.itemsSection}>
              <div style={s.itemsHeader}>
                <span style={s.itemsCount}>{cart.length} item{cart.length > 1 ? 's' : ''}</span>
                <button onClick={clearCart} style={s.clearBtn}>Clear all</button>
              </div>

              {cart.map(item => (
                <div key={item._id} style={s.cartItem}>
                  <img src={item.imageUrl} alt={item.name} style={s.itemImg} />
                  <div style={s.itemInfo}>
                    <div style={s.itemCategory}>{item.category}</div>
                    <div style={s.itemName}>{item.name}</div>
                    <div style={s.itemPrice}>₹{Number(item.price).toLocaleString()} each</div>
                  </div>
                  <div style={s.itemActions}>
                    <div style={s.qtyControl}>
                      <button style={s.qtyBtn} onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                      <span style={s.qtyNum}>{item.qty}</span>
                      <button style={s.qtyBtn} onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                    </div>
                    <div style={s.itemTotal}>₹{(item.price * item.qty).toLocaleString()}</div>
                    <button onClick={() => removeFromCart(item._id)} style={s.removeBtn}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div style={s.summary}>
              <h3 style={s.summaryTitle}>Order Summary</h3>

              <div style={s.summaryRow}>
                <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div style={s.summaryRow}>
                <span>Delivery</span>
                <span style={{ color: '#16a34a' }}>{cartTotal >= 499 ? 'FREE' : '₹49'}</span>
              </div>
              <div style={s.summaryRow}>
                <span>Discount</span>
                <span style={{ color: '#16a34a' }}>- ₹0</span>
              </div>

              <div style={s.summaryDivider} />

              <div style={s.summaryTotal}>
                <span>Total</span>
                <span>₹{(cartTotal + (cartTotal >= 499 ? 0 : 49)).toLocaleString()}</span>
              </div>

              {cartTotal < 499 && (
                <p style={s.freeDeliveryHint}>
                  Add ₹{499 - cartTotal} more for FREE delivery!
                </p>
              )}

              {user ? (
                <Link to="/checkout" style={s.checkoutBtn}>
                  Proceed to Checkout →
                </Link>
              ) : (
                <div>
                  <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '10px', textAlign: 'center' }}>
                    Please login to checkout
                  </p>
                  <Link to="/login" style={s.checkoutBtn}>Login to Checkout</Link>
                </div>
              )}

              <div style={s.secureNote}>
                🔒 Secure checkout powered by Stripe
              </div>
            </div>

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
  navRight: {},
  shopLink: { textDecoration: 'none', color: '#6c63ff', fontSize: '0.9rem', fontWeight: '500' },

  container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  title: { fontSize: '1.8rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1.5rem' },

  empty: { textAlign: 'center', padding: '5rem 2rem' },
  shopBtn: { background: '#6c63ff', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600' },

  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' },

  itemsSection: { background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' },
  itemsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6' },
  itemsCount: { fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e' },
  clearBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500' },

  cartItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6' },
  itemImg: { width: '72px', height: '72px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e5e7eb', flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemCategory: { fontSize: '11px', color: '#6c63ff', fontWeight: '600', textTransform: 'uppercase', marginBottom: '2px' },
  itemName: { fontSize: '0.95rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '2px' },
  itemPrice: { fontSize: '0.82rem', color: '#9ca3af' },
  itemActions: { display: 'flex', alignItems: 'center', gap: '12px' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f3f4f6', borderRadius: '8px', padding: '4px 8px' },
  qtyBtn: { background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#1a1a2e', fontWeight: '700', width: '20px', textAlign: 'center' },
  qtyNum: { fontSize: '0.9rem', fontWeight: '700', color: '#1a1a2e', minWidth: '20px', textAlign: 'center' },
  itemTotal: { fontSize: '0.95rem', fontWeight: '700', color: '#1a1a2e', minWidth: '80px', textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' },

  summary: { background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '1.5rem', position: 'sticky', top: '80px' },
  summaryTitle: { fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1.25rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555', marginBottom: '10px' },
  summaryDivider: { borderTop: '1px solid #e5e7eb', margin: '1rem 0' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1.25rem' },
  freeDeliveryHint: { fontSize: '12px', color: '#f59e0b', background: '#fffbeb', padding: '8px 12px', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' },
  checkoutBtn: { display: 'block', textAlign: 'center', background: '#6c63ff', color: 'white', padding: '13px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem' },
  secureNote: { textAlign: 'center', fontSize: '12px', color: '#9ca3af' },

  footer: { textAlign: 'center', padding: '1.5rem', background: '#1a1a2e', marginTop: '3rem' },
  footerText: { fontSize: '0.8rem', color: '#9ca3af' },
};

export default Cart;