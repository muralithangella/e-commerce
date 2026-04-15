import { useQuery } from '@tanstack/react-query';
import { cartQueryOptions } from '@/features/cart/api/queries';

export function useCartCount() {
  const { data } = useQuery(cartQueryOptions);
  return data?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}
