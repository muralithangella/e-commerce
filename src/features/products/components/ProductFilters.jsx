import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = ['', 'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'home-decoration', 'furniture', 'tops', 'womens-dresses', 'womens-shoes', 'mens-shirts', 'mens-shoes', 'mens-watches', 'womens-watches', 'womens-bags', 'womens-jewellery', 'sunglasses', 'automotive', 'motorcycle', 'lighting'];

export default function ProductFilters() {
  const [params, setParams] = useSearchParams();
  const q   = params.get('q') ?? '';
  const cat = params.get('category') ?? '';
  // Mirror URL param into local state so the input is responsive.
  // useEffect keeps inputVal in sync when URL changes externally
  // (browser back/forward, programmatic navigation).
  const [inputVal, setInputVal] = useState(q);
  useEffect(() => { setInputVal(q); }, [q]);

  // Debounce search input — prevents a new query + full grid re-render on every keystroke (INP fix)
  const debounceRef = useRef(null);
  const set = (key, value, debounce = false) => {
    const apply = () =>
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value); else next.delete(key);
        return next;
      }, { replace: true });

    if (!debounce) { apply(); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(apply, 350);
  };

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
      <div style={{ position: 'relative', flex: '1 1 260px' }}>
        <label htmlFor="product-search" className="sr-only">Search products</label>
        <span aria-hidden="true" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)', pointerEvents: 'none' }}>🔍</span>
        <input
          id="product-search"
          className="input"
          style={{ paddingLeft: 34 }}
          placeholder="Search products…"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            set('q', e.target.value, true); // debounced URL update
          }}
        />
      </div>
      <label htmlFor="category-filter" className="sr-only">Filter by category</label>
      <select
        id="category-filter"
        className="input"
        style={{ flex: '0 1 200px' }}
        value={cat}
        onChange={(e) => set('category', e.target.value)}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c ? c.replace(/-/g, ' ') : 'All categories'}</option>
        ))}
      </select>
      {(q || cat) && (
        <button className="btn btn-ghost btn-sm" onClick={() => { setInputVal(''); setParams({}); }}>
          Clear filters
        </button>
      )}
    </div>
  );
}
