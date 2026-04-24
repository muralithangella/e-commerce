import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveCart } from './queries';
import { saveOrder } from '@/features/orders/api/queries';
import { logger } from '@/utils/logger';

function useCartMutation(updater) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {

      const next = qc.getQueryData(['cart']) ?? [];
      saveCart(next);
      return next;
    },
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['cart'] });
      const prev = qc.getQueryData(['cart']) ?? [];
      qc.setQueryData(['cart'], updater(prev, payload));
      return { prev };
    },
    onError: (_err, _payload, ctx) => {
      qc.setQueryData(['cart'], ctx?.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useAddToCart() {
  return useCartMutation((cart, product) => {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) return cart.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    return [...cart, { ...product, quantity: 1 }];
  });
}

export function useRemoveFromCart() {
  return useCartMutation((cart, id) => cart.filter((i) => i.id !== id));
}

export function useUpdateQuantity() {
  return useCartMutation((cart, { id, quantity }) =>
    quantity < 1
      ? cart.filter((i) => i.id !== id)
      : cart.map((i) => i.id === id ? { ...i, quantity } : i),
  );
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ items, shipping }) => {
      const order = {
        id: `ORD-${Date.now()}`,
        placedAt: new Date().toISOString(),
        shipping,
        products: items.map((i) => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity, thumbnail: i.thumbnail })),
        total: items.reduce((s, i) => s + i.price * i.quantity, 0),
        status: 'Processing',
      };
      saveOrder(order);
      saveCart([]);
      return order;
    },
    onSuccess: (order) => {
      logger.info('checkout_success', {
        orderId:    order.id,
        itemCount:  order.products.length,
        totalValue: order.total,
      });
      qc.setQueryData(['cart'], []);
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      logger.error('checkout_failure', {
        message: error?.message ?? 'Unknown error',
        status:  error?.status,
      });
    },
  });
}
