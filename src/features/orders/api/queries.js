import { queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export const PAGE_SIZE  = 5;
const ORDERS_KEY = 'local_orders';

// ── PII notice ─────────────────────────────────────────────────────────────────
// local_orders contains shipping data (name, email, address) — PII.
// Stored in sessionStorage, not localStorage:
//   - Cleared automatically when the tab closes (limits PII exposure window)
//   - Not accessible across tabs (reduces attack surface)
//   - Still survives page refresh within the same session
export function loadLocalOrders() {
  try { return JSON.parse(sessionStorage.getItem(ORDERS_KEY) ?? '[]'); }
  catch { return []; }
}

export function saveOrder(order) {
  const existing = loadLocalOrders();
  sessionStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...existing]));
}

// ── Local orders (placed via checkout) — no caching ───────────────────────────
// Always re-read from localStorage so a newly placed order appears immediately.
export const localOrdersQueryOptions = queryOptions({
  queryKey: ['orders', 'local'],
  queryFn: loadLocalOrders,
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: 'always',
});

// ── Mock/historical orders — cached per page ──────────────────────────────────
// Strategy: each page is a separate cache entry keyed by ['orders', 'mock', page].
// - staleTime: 2 min — order history doesn't change frequently
// - gcTime: 10 min   — keep all visited pages in memory so pagination is instant
// - refetchOnWindowFocus: false — slightly stale order history is acceptable
// - placeholderData: prev — show previous page while next page loads (no blank flash)
//
// Invalidation: useCheckout calls invalidateQueries({ queryKey: ['orders'] })
// which matches ALL keys starting with ['orders'] — both local and mock pages —
// so the list refreshes after a new order is placed.
export const ordersQueryOptions = (page = 1) =>
  queryOptions({
    queryKey: ['orders', 'mock', page],
    queryFn: () =>
      apiClient
        .get(`/carts?limit=${PAGE_SIZE}&skip=${(page - 1) * PAGE_SIZE}`)
        .then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    gcTime:    1000 * 60 * 10,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });
