import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time — individual query options override this per resource.
      staleTime: 1000 * 60 * 5,           // 5 min

      // gcTime must always be > staleTime so stale data stays in cache for
      // stale-while-revalidate to work. If gcTime <= staleTime the entry is
      // garbage-collected before it can ever be served as stale.
      gcTime: 1000 * 60 * 10,             // 10 min

      // Opt out globally — each resource declares its own refetch behaviour
      // explicitly so the strategy is visible at the query definition, not hidden
      // in a global default.
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,            // always re-sync after going offline

      retry: 1,
    },
  },
});
