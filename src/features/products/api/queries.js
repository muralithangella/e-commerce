import { queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

const fetchByCategory = (category) => {
  const url = category
    ? `/products/category/${encodeURIComponent(category)}?limit=100`
    : `/products?limit=100`;
  return apiClient.get(url).then((r) => r.data);
};

// ── Product listing — stale-while-revalidate ───────────────────────────────────
// Strategy: serve cached data immediately (speed), revalidate in the background.
// staleTime < gcTime ensures the entry stays in cache after going stale so the
// next mount gets instant data while a background fetch runs silently.
export const productsQueryOptions = ({ q = '', category = '' } = {}) =>
  queryOptions({
    queryKey: ['products', category],
    queryFn: () => fetchByCategory(category),

    staleTime: 1000 * 60 * 5,   // data is fresh for 5 min — no background fetch
    gcTime:    1000 * 60 * 30,  // keep in cache 30 min — stale data served instantly
                                 // while revalidation runs in background

    // Revalidate when user returns to the tab — stale data is shown immediately,
    // fresh data replaces it silently once the fetch completes.
    refetchOnWindowFocus: true,

    // Show previous category results while new category loads (no blank flash)
    placeholderData: (prev) => prev,

    // Title-only client-side filter — never hits the network for search changes
    select: (data) => {
      if (!q.trim()) return data;
      const term = q.trim().toLowerCase();
      const filtered = data.products.filter((p) =>
        p.title.toLowerCase().includes(term),
      );
      return { ...data, products: filtered, total: filtered.length };
    },
  });

// ── Product detail — longer cache, no background revalidation ─────────────────
// Product details change rarely — 10 min fresh, 60 min in cache.
export const productDetailQueryOptions = (id) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: () => apiClient.get(`/products/${id}`).then((r) => r.data),
    staleTime: 1000 * 60 * 10,
    gcTime:    1000 * 60 * 60,
    enabled: !!id,
  });
