import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg'],

      manifest: {
        name:             'ShopDash',
        short_name:       'ShopDash',
        description:      'Mini E-Commerce Dashboard',
        theme_color:      '#4f46e5',
        background_color: '#f8f9fb',
        display:          'standalone',
        start_url:        '/',
        scope:            '/',
        icons: [
          {
            src:     '/favicon.svg',
            sizes:   'any',
            type:    'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },

      workbox: {
        // ── App shell — precache ─────────────────────────────────────────────
        // All JS/CSS/HTML chunks are precached at install time.
        // Workbox serves them CacheFirst — the shell loads instantly offline.
        // This is the "shell-first" strategy: layout renders before any network
        // request is made.
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],

        // Remove caches from previous SW versions on activation — prevents
        // stale assets from old deploys being served indefinitely.
        cleanupOutdatedCaches: true,

        // After the user accepts the update, the new SW takes control of all
        // open tabs immediately without requiring a second reload.
        skipWaiting: true,
        clientsClaim: true,

        // ── SPA offline routing ──────────────────────────────────────────────
        // Without this, navigating to /product/1 offline returns a network error
        // because the browser requests that URL from the server.
        // navigateFallback serves index.html for all navigation requests,
        // letting React Router handle the route client-side.
        navigateFallback: '/index.html',

        // Only apply the fallback to app routes — not to API calls or assets.
        navigateFallbackDenylist: [/^\/api/, /\.[a-z]+$/i],

        runtimeCaching: [
          // ── Product API — NetworkFirst with long offline TTL ───────────────
          // Strategy: try network first (fresh data), fall back to cache if
          // offline. 24h TTL means products are browsable offline all day.
          // Separate cache name so product data can be busted independently.
          {
            urlPattern: /^https:\/\/dummyjson\.com\/products/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'products-api',
              networkTimeoutSeconds: 5,       // fall back to cache after 5s
              expiration: {
                maxEntries:    100,
                maxAgeSeconds: 60 * 60 * 24,  // 24 hours — browsable offline all day
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // ── Product images — StaleWhileRevalidate ─────────────────────────
          // Images are large and change rarely. Serve from cache instantly,
          // update in background. 7-day TTL keeps the cache from growing unbounded.
          {
            urlPattern: /^https:\/\/cdn\.dummyjson\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'product-images',
              expiration: {
                maxEntries:    80,
                maxAgeSeconds: 60 * 60 * 24 * 7,  // 7 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // ── Other dummyjson API calls (orders, carts) — NetworkOnly ───────
          // Cart and order data must always be fresh — never serve stale.
          // If offline, these fail gracefully (the UI shows an error message).
          {
            urlPattern: /^https:\/\/dummyjson\.com\//,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      // Granular aliases — imports read @features/cart, @shared, @api
      // not @/features/cart. Each top-level src directory gets its own alias.
      '@':          '/src',           // fallback for any @/x import
      '@features':  '/src/features',
      '@shared':    '/src/shared',
      '@api':       '/src/api',
      '@layouts':   '/src/layouts',
      '@routes':    '/src/routes',
      '@lib':       '/src/lib',
      '@utils':     '/src/utils',
      '@components':'/src/components',
    },
  },

  build: {
    chunkSizeWarningLimit: 600,
  },
});
