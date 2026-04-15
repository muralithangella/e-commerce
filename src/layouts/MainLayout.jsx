import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useCartCount } from '@/shared/hooks/useCartCount';
import { logger } from '@/utils/logger';

const ROUTE_TITLES = {
  '/':        'Products — ShopDash',
  '/cart':    'Cart — ShopDash',
  '/orders':  'Order History — ShopDash',
};

function usePageTitle() {
  const { pathname } = useLocation();
  const prevPathRef  = useRef(null);

  useEffect(() => {
    // Update document title
    const base = ROUTE_TITLES[pathname];
    if (base) document.title = base;

    // Log route change as a structured event
    logger.info('route_change', {
      from: prevPathRef.current ?? null,
      to:   pathname,
    });
    prevPathRef.current = pathname;
  }, [pathname]);
}

export default function MainLayout() {
  const cartCount = useCartCount();
  usePageTitle();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>

      {/* Skip-to-content — first focusable element, invisible until focused */}
      <a
        href="#main-content"
        style={{
          position: 'absolute', top: -40, left: 16, zIndex: 999,
          background: 'var(--clr-primary)', color: '#fff',
          padding: '8px 16px', borderRadius: 'var(--radius-sm)',
          fontSize: 14, fontWeight: 600,
          transition: 'top .15s',
        }}
        onFocus={(e) => { e.currentTarget.style.top = '8px'; }}
        onBlur={(e)  => { e.currentTarget.style.top = '-40px'; }}
      >
        Skip to content
      </a>

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link to="/" aria-label="ShopDash home" style={{ fontWeight: 700, fontSize: 20, color: 'var(--clr-primary)', letterSpacing: '-0.5px' }}>
            🛍 ShopDash
          </Link>

          <nav aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[['/', 'Products'], ['/orders', 'Order History']].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
                padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 500,
                color: isActive ? 'var(--clr-primary)' : 'var(--clr-muted)',
                background: isActive ? '#ede9fe' : 'transparent',
                transition: 'all var(--transition)',
              })}>
                {label}
              </NavLink>
            ))}

            <NavLink to="/cart" aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount !== 1 ? 's' : ''}` : ''}`}
              style={({ isActive }) => ({
                position: 'relative', padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                fontSize: 14, fontWeight: 500,
                color: isActive ? 'var(--clr-primary)' : 'var(--clr-muted)',
                background: isActive ? '#ede9fe' : 'transparent',
                transition: 'all var(--transition)',
              })}>
              Cart
              {cartCount > 0 && (
                <span aria-hidden="true" style={{
                  position: 'absolute', top: 2, right: 2,
                  background: 'var(--clr-primary)', color: '#fff',
                  borderRadius: '999px', fontSize: 10, fontWeight: 700,
                  minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {cartCount}
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main-content" style={{ flex: 1, padding: '32px 0' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer style={{
        borderTop: '1px solid var(--clr-border)', padding: '20px 0',
        textAlign: 'center', fontSize: 13, color: 'var(--clr-muted)',
      }}>
        <div className="container">ShopDash &copy; {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}
