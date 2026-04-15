import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ordersQueryOptions, localOrdersQueryOptions, PAGE_SIZE } from '../api/queries';
import OrderRow from '../components/OrderRow';
import Spinner from '@/shared/components/Spinner';
import ErrorMessage from '@/shared/components/ErrorMessage';

export default function OrderHistory() {
  // page lives in the URL — survives refresh, back/forward, and is shareable.
  // useState(1) would reset to page 1 on every re-mount; URL state persists.
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const setPage = (n) => setParams({ page: String(n) }, { replace: true });

  const { data: localOrders = [] }             = useQuery(localOrdersQueryOptions);
  const { data, isLoading, error, isFetching } = useQuery(ordersQueryOptions(page));

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Order History</h1>
        <p style={{ color: 'var(--clr-muted)', fontSize: 14 }}>
          {localOrders.length + (data?.total ?? 0)} orders total
        </p>
      </div>

      {localOrders.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>
            Recently Placed
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {localOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
          <div className="divider" style={{ marginTop: 28 }} />
        </div>
      )}

      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>
        Past Orders
      </p>

      {isLoading && <Spinner center />}
      {error && <ErrorMessage error={error} />}

      {data && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, opacity: isFetching ? .6 : 1, transition: 'opacity .2s' }}>
            {data.carts.map((order, i) => (
              <OrderRow key={order.id} order={order} mockIndex={(page - 1) * PAGE_SIZE + i} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 32 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(page - 1)} disabled={page === 1 || isFetching}>
                ← Prev
              </button>
              <span style={{ fontSize: 14, color: 'var(--clr-muted)' }}>Page {page} of {totalPages}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(page + 1)} disabled={page === totalPages || isFetching}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
