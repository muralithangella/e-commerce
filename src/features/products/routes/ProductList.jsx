import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { productsQueryOptions } from '../api/queries';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Spinner from '@/shared/components/Spinner';
import ErrorMessage from '@/shared/components/ErrorMessage';

function SkeletonGrid() {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card skeleton-card" aria-hidden="true">
          <div className="skeleton skeleton-card__img" />
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="skeleton" style={{ height: 12, width: '40%' }} />
            <div className="skeleton" style={{ height: 16, width: '80%' }} />
            <div className="skeleton" style={{ height: 12, width: '60%' }} />
            <div className="skeleton" style={{ height: 36, marginTop: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductList() {
  const [params] = useSearchParams();
  const q   = params.get('q') ?? '';
  const cat = params.get('category') ?? '';

  const queryParams = { q, category: cat };

  const { data, isLoading, error, isFetching } = useQuery(productsQueryOptions(queryParams));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--clr-text)', marginBottom: 4 }}>Products</h1>
        <p style={{ color: 'var(--clr-muted)', fontSize: 14 }} aria-live="polite">
          {data ? `${data.total} items found` : 'Browse our catalogue'}
        </p>
      </div>

      <ProductFilters />

      {isLoading && <SkeletonGrid />}
      {error && <ErrorMessage error={error} />}

      {data && (
        <>
          {isFetching && !isLoading && (
            <div role="status" aria-live="polite" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--clr-muted)', fontSize: 13 }}>
              <Spinner size="sm" /> <span>Refreshing…</span>
            </div>
          )}
          {data.products.length === 0 ? (
            <div className="empty-state" role="status">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <ul className="product-grid" aria-label="Product listing">
              {data.products.map((p, i) => (
                <li key={p.id} style={{ listStyle: 'none' }}>
                  {/* First 4 cards are likely above the fold — load eagerly for LCP */}
                  <ProductCard product={p} priority={i < 4} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
