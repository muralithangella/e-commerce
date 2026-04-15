import { queryOptions } from '@tanstack/react-query';

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
