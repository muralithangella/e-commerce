import { lazy, Suspense, Component } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { queryClient } from '@/utils/queryClient';
import { productsQueryOptions, productDetailQueryOptions } from '@/features/products/api/queries';
import { cartQueryOptions } from '@/features/cart/api/queries';
import { ordersQueryOptions, localOrdersQueryOptions } from '@/features/orders/api/queries';
import Spinner from '@/shared/components/Spinner';
import { logger } from '@/utils/logger';


const ProductList = lazy(() => import('@/features/products/routes/ProductList'));
const ProductDetail = lazy(() => import('@/features/products/routes/ProductDetail'));
const Cart = lazy(() => import('@/features/cart/routes/Cart'));
const OrderHistory = lazy(() => import('@/features/orders/routes/OrderHistory'));

function PageFallback() {
  return <Spinner center />;
}

class RouteErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    logger.error('route_render_error', {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
      error,
    });
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--clr-muted)' }}>
          <p style={{ fontSize: 16, marginBottom: 12 }}>Something went wrong loading this page.</p>
          <button className="btn btn-ghost btn-sm" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


function LazyRoute({ children }) {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        {children}
      </Suspense>
    </RouteErrorBoundary>
  );
}


const router = createBrowserRouter([
  {
    path: '/',

    element: <MainLayout />,
    children: [
      {

        index: true,
        loader: () => queryClient.ensureQueryData(productsQueryOptions()),
        element: (
          <LazyRoute>
            <ProductList />
          </LazyRoute>
        ),
      },
      {

        path: 'product/:id',
        loader: ({ params }) =>
          queryClient.ensureQueryData(productDetailQueryOptions(params.id)),
        element: (
          <LazyRoute>
            <ProductDetail />
          </LazyRoute>
        ),
      },
      {


        path: 'cart',
        loader: () => queryClient.ensureQueryData(cartQueryOptions),
        element: (
          <LazyRoute>
            <Cart />
          </LazyRoute>
        ),
      },
      {
  
        path: 'orders',
        loader: () =>
          Promise.all([
            queryClient.ensureQueryData(localOrdersQueryOptions),
            queryClient.ensureQueryData(ordersQueryOptions(1)),
          ]),
        element: (
          <LazyRoute>
            <OrderHistory />
          </LazyRoute>
        ),
      },
    ],
  },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
