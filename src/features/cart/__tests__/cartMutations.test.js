import { describe, it, expect } from 'vitest';

// Pure updater functions extracted from useCartMutation — test the logic
// independently of React and TanStack Query.

const addUpdater = (cart, product) => {
  const existing = cart.find((i) => i.id === product.id);
  if (existing) return cart.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
  return [...cart, { ...product, quantity: 1 }];
};

const removeUpdater = (cart, id) => cart.filter((i) => i.id !== id);

const quantityUpdater = (cart, { id, quantity }) =>
  quantity < 1
    ? cart.filter((i) => i.id !== id)
    : cart.map((i) => i.id === id ? { ...i, quantity } : i);

const PRODUCT = { id: 1, title: 'Test Product', price: 9.99 };

describe('cart mutation logic', () => {
  it('adds a new product with quantity 1', () => {
    const result = addUpdater([], PRODUCT);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 1, quantity: 1 });
  });

  it('increments quantity when the same product is added again', () => {
    const cart   = [{ ...PRODUCT, quantity: 1 }];
    const result = addUpdater(cart, PRODUCT);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(2);
  });

  it('does not mutate other items when incrementing', () => {
    const other  = { id: 2, title: 'Other', price: 5, quantity: 3 };
    const cart   = [other, { ...PRODUCT, quantity: 1 }];
    const result = addUpdater(cart, PRODUCT);
    expect(result.find((i) => i.id === 2).quantity).toBe(3);
  });

  it('removes an item by id', () => {
    const cart   = [{ ...PRODUCT, quantity: 2 }, { id: 2, title: 'B', price: 1, quantity: 1 }];
    const result = removeUpdater(cart, 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('updates quantity of an existing item', () => {
    const cart   = [{ ...PRODUCT, quantity: 1 }];
    const result = quantityUpdater(cart, { id: 1, quantity: 5 });
    expect(result[0].quantity).toBe(5);
  });

  it('removes item when quantity is set to 0', () => {
    const cart   = [{ ...PRODUCT, quantity: 1 }];
    const result = quantityUpdater(cart, { id: 1, quantity: 0 });
    expect(result).toHaveLength(0);
  });

  it('removes item when quantity is set to negative', () => {
    const cart   = [{ ...PRODUCT, quantity: 1 }];
    const result = quantityUpdater(cart, { id: 1, quantity: -1 });
    expect(result).toHaveLength(0);
  });
});
