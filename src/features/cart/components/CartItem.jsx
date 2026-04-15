import { useRemoveFromCart, useUpdateQuantity } from '../api/mutations';

export default function CartItem({ item }) {
  const remove    = useRemoveFromCart();
  const updateQty = useUpdateQuantity();

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--clr-border)' }}>
      <img
        src={item.thumbnail}
        alt={item.title}
        width="72"
        height="72"
        loading="lazy"
        style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 'var(--radius-sm)', background: '#f3f4f6', flexShrink: 0 }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.title}
        </p>
        <p style={{ color: 'var(--clr-muted)', fontSize: 13 }}>${item.price} each</p>
      </div>

      <div role="group" aria-label={`Quantity for ${item.title}`} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ padding: '4px 10px', fontSize: 16 }}
          aria-label="Decrease quantity"
          onClick={() => updateQty.mutate({ id: item.id, quantity: item.quantity - 1 })}
        >−</button>
        <span aria-live="polite" style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
        <button
          className="btn btn-ghost btn-sm"
          style={{ padding: '4px 10px', fontSize: 16 }}
          aria-label="Increase quantity"
          onClick={() => updateQty.mutate({ id: item.id, quantity: item.quantity + 1 })}
        >+</button>
      </div>

      <div style={{ minWidth: 64, textAlign: 'right', fontWeight: 700, fontSize: 16 }}>
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <button
        className="btn btn-ghost btn-sm"
        style={{ color: 'var(--clr-danger)', padding: '6px 8px' }}
        aria-label={`Remove ${item.title} from cart`}
        onClick={() => remove.mutate(item.id)}
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
