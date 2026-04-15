import { describe, it, expect } from 'vitest';

// The select function from productsQueryOptions — extracted for unit testing.
// This is the non-trivial logic that replaced the dummyjson /search endpoint
// to ensure search only matches product titles, not descriptions or tags.
const titleFilter = (data, q) => {
  if (!q.trim()) return data;
  const term     = q.trim().toLowerCase();
  const filtered = data.products.filter((p) => p.title.toLowerCase().includes(term));
  return { ...data, products: filtered, total: filtered.length };
};

const PRODUCTS = [
  { id: 1, title: 'Red Lipstick',      description: 'A blue product',  category: 'beauty' },
  { id: 2, title: 'Blue Jeans',        description: 'Red stitching',   category: 'clothing' },
  { id: 3, title: 'iPhone 14',         description: 'Latest iPhone',   category: 'smartphones' },
  { id: 4, title: 'Red Running Shoes', description: 'Comfortable',     category: 'footwear' },
];

const DATA = { products: PRODUCTS, total: PRODUCTS.length };

describe('product title filter', () => {
  it('returns all products when query is empty', () => {
    expect(titleFilter(DATA, '').total).toBe(4);
  });

  it('returns all products when query is only whitespace', () => {
    expect(titleFilter(DATA, '   ').total).toBe(4);
  });

  it('matches only products whose TITLE contains the term', () => {
    // "red" appears in title of products 1 and 4, and in description of product 2
    // — product 2 must NOT be returned
    const result = titleFilter(DATA, 'red');
    expect(result.total).toBe(2);
    expect(result.products.map((p) => p.id)).toEqual([1, 4]);
  });

  it('is case-insensitive', () => {
    const result = titleFilter(DATA, 'RED');
    expect(result.total).toBe(2);
  });

  it('matches partial title strings', () => {
    const result = titleFilter(DATA, 'iphone');
    expect(result.total).toBe(1);
    expect(result.products[0].id).toBe(3);
  });

  it('returns empty when no titles match', () => {
    const result = titleFilter(DATA, 'zzznomatch');
    expect(result.total).toBe(0);
    expect(result.products).toHaveLength(0);
  });

  it('does not match against description or category', () => {
    // "blue" is in product 2 title AND product 1 description — only title match counts
    const result = titleFilter(DATA, 'blue');
    expect(result.total).toBe(1);
    expect(result.products[0].id).toBe(2);
  });

  it('preserves other data fields (total reflects filtered count)', () => {
    const result = titleFilter(DATA, 'red');
    expect(result.total).toBe(result.products.length);
  });
});
