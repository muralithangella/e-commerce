import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productDetailQueryOptions } from '../api/queries';
import { useAddToCart } from '@/features/cart/api/mutations';
import Spinner from '@/shared/components/Spinner';
import ErrorMessage from '@/shared/components/ErrorMessage';

export default function ProductDetail() {
  const { id } = useParams();
  const { data: p, isLoading, error } = useQuery(productDetailQueryOptions(id));
  const addToCart = useAddToCart();
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded]         = useState(false);

  // Per-product page title for SEO
  useEffect(() => {
    if (p?.title) document.title = `${p.title} — ShopDash`;
    return () => { document.title = 'ShopDash — Mini E-Commerce Dashboard'; };
  }, [p?.title]);

  if (isLoading) return <Spinner center />;
  if (error)     return <ErrorMessage error={error} />;
  if (!p)        return null;

  const handleAdd = () => {
    addToCart.mutate(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const images = p.images?.length ? p.images : [p.thumbnail];

  return (
    <div>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--clr-muted)', fontSize: 14, marginBottom: 24 }}>
        ← Back to products
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>

        {/* Gallery */}
        <div>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#f3f4f6', aspectRatio: '1', marginBottom: 12 }}>
            <img
              src={images[activeImg]}
              alt={p.title}
              width="600"
              height="600"
              fetchpriority="high"
              decoding="sync"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          {images.length > 1 && (
            <div role="group" aria-label="Product image thumbnails" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1} of ${images.length}`}
                  aria-pressed={i === activeImg}
                  style={{
                    width: 60, height: 60, borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                    border: `2px solid ${i === activeImg ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                    padding: 0, background: '#f3f4f6', cursor: 'pointer',
                  }}
                >
                  <img src={src} alt="" width="60" height="60" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            {p.category}
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3 }}>{p.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span aria-label={`Rating: ${p.rating} out of 5`} style={{ color: 'var(--clr-warning)', fontSize: 16 }}>
              {'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}
            </span>
            <span style={{ color: 'var(--clr-muted)', fontSize: 14 }}>{p.rating} · {p.stock} in stock</span>
          </div>
          <p style={{ color: 'var(--clr-muted)', lineHeight: 1.7, fontSize: 15 }}>{p.description}</p>

          <div className="divider" />

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 800 }} aria-label={`Price: $${p.price}`}>${p.price}</span>
            {p.discountPercentage > 5 && (
              <>
                <span style={{ fontSize: 18, color: 'var(--clr-muted)', textDecoration: 'line-through' }} aria-label={`Original price: $${(p.price / (1 - p.discountPercentage / 100)).toFixed(2)}`}>
                  ${(p.price / (1 - p.discountPercentage / 100)).toFixed(2)}
                </span>
                <span className="badge badge-danger" aria-label={`${Math.round(p.discountPercentage)}% off`}>
                  -{Math.round(p.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
            {[['Brand', p.brand], ['SKU', p.sku], ['Warranty', p.warrantyInformation], ['Shipping', p.shippingInformation]].map(([k, v]) => v && (
              <div key={k} style={{ background: 'var(--clr-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                <dt style={{ color: 'var(--clr-muted)', marginBottom: 2 }}>{k}</dt>
                <dd style={{ fontWeight: 500 }}>{v}</dd>
              </div>
            ))}
          </dl>

          <button
            className="btn btn-primary"
            style={{ justifyContent: 'center', padding: '14px', fontSize: 16 }}
            onClick={handleAdd}
            disabled={addToCart.isPending}
            aria-live="polite"
          >
            {added ? '✓ Added to cart!' : '+ Add to Cart'}
          </button>
          <Link to="/cart" className="btn btn-ghost" style={{ justifyContent: 'center' }}>View Cart</Link>
        </div>
      </div>
    </div>
  );
}
