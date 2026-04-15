import { useState } from 'react';
import { Link } from 'react-router-dom';
import CheckoutModal from './CheckoutModal';

export default function CartSummary({ items }) {
  const [open, setOpen]  = useState(false);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping  = subtotal > 50 ? 0 : 4.99;
  const total     = subtotal + shipping;

  return (
    <>
      <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Order Summary</h2>
        <div className="divider" />
        {[['Subtotal', `$${subtotal.toFixed(2)}`], ['Shipping', shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`]].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--clr-muted)' }}>
            <span>{k}</span><span style={{ color: 'var(--clr-text)' }}>{v}</span>
          </div>
        ))}
        <div className="divider" />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
        {shipping === 0 && (
          <p style={{ fontSize: 12, color: 'var(--clr-success)', textAlign: 'center' }}>🎉 You qualify for free shipping!</p>
        )}
        <button
          className="btn btn-primary"
          style={{ justifyContent: 'center', padding: '13px' }}
          onClick={() => setOpen(true)}
        >
          Checkout
        </button>
        <Link to="/" className="btn btn-ghost" style={{ justifyContent: 'center', fontSize: 13 }}>
          Continue Shopping
        </Link>
      </div>

      {open && (
        <CheckoutModal
          items={items}
          total={total}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
