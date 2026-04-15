import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { cartQueryOptions } from '../api/queries';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';

export default function Cart() {
  const { data: items = [] } = useQuery(cartQueryOptions);

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 28 }}>Your Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 32, alignItems: 'start' }}>
        <div className="card" style={{ padding: '0 24px' }}>
          {items.map((item) => <CartItem key={item.id} item={item} />)}
        </div>
        <CartSummary items={items} />
      </div>
    </div>
  );
}
