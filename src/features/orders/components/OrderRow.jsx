const STATUS_BADGE = {
  Processing: 'badge-warning',
  Shipped:    'badge-primary',
  Delivered:  'badge-success',
  Cancelled:  'badge-danger',
};

const MOCK_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderRow({ order, mockIndex }) {
  const isLocal  = !!order.placedAt;
  const status   = isLocal ? order.status : MOCK_STATUSES[mockIndex % 4];
  const badgeCls = STATUS_BADGE[status] ?? 'badge-warning';
  const total    = order.total ?? order.discountedTotal ?? 0;
  const date     = isLocal
    ? new Date(order.placedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : new Date(Date.now() - mockIndex * 86_400_000 * 3).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{ fontWeight: 700, fontSize: 15 }}>Order #{order.id}</p>
            {isLocal && <span className="badge badge-success" style={{ fontSize: 10 }}>New</span>}
          </div>
          <p style={{ color: 'var(--clr-muted)', fontSize: 13, marginTop: 2 }}>{date}</p>
          {isLocal && order.shipping && (
            <p style={{ color: 'var(--clr-muted)', fontSize: 12, marginTop: 2 }}>
              📦 {order.shipping.address}, {order.shipping.city}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className={`badge ${badgeCls}`}>{status}</span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>${Number(total).toFixed(2)}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {order.products?.slice(0, 4).map((p) => (
          <div key={p.id} style={{ fontSize: 12, background: 'var(--clr-bg)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', color: 'var(--clr-muted)' }}>
            {p.title} × {p.quantity}
          </div>
        ))}
        {order.products?.length > 4 && (
          <div style={{ fontSize: 12, background: 'var(--clr-bg)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', color: 'var(--clr-muted)' }}>
            +{order.products.length - 4} more
          </div>
        )}
      </div>
    </div>
  );
}
