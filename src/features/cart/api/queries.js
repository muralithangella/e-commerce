import { queryOptions } from '@tanstack/react-query';

// ── Storage security note ───────────────────────────────────────────────────────────────
// Cart data (product IDs, quantities, prices) is NOT sensitive — it contains
// no PII, no auth tokens, and no payment data. localStorage is acceptable here.
// Contrast with local_orders (PII) which uses sessionStorage, and auth tokens
// which use in-memory storage only (see src/utils/auth.js).
const CART_KEY = 'cart';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]'); }
  catch { return []; }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export const cartQueryOptions = queryOptions({
  queryKey: ['cart'],
  queryFn: loadCart,
  staleTime: 0,
  gcTime: Infinity,
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
});
