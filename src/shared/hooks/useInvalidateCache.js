import { useQueryClient } from '@tanstack/react-query';

export function useInvalidateCache() {
  const qc = useQueryClient();

  return {

    invalidateProducts: () =>
      qc.invalidateQueries({ queryKey: ['products'] }),


    invalidateProduct: (id) =>
      qc.invalidateQueries({ queryKey: ['product', id] }),


    invalidateOrders: () =>
      qc.invalidateQueries({ queryKey: ['orders'] }),

  
    invalidateCart: () =>
      qc.invalidateQueries({ queryKey: ['cart'] }),

    invalidateAll: () => qc.invalidateQueries(),


    removeProducts: () =>
      qc.removeQueries({ queryKey: ['products'] }),

    removeOrders: () =>
      qc.removeQueries({ queryKey: ['orders'] }),
  };
}
