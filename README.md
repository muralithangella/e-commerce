# ShopDash — Mini E-Commerce Dashboard

A React single-page application for browsing products, managing a cart, and viewing order history. Built as a frontend architecture showcase with a focus on scalability, maintainability, and production-readiness.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, React Router 7 |
| Server State | TanStack Query v5 |
| HTTP Client | Axios (centralised instance) |
| Styling | CSS custom properties (design tokens) |
| PWA | Vite Plugin PWA + Workbox |
| Testing | Vitest + Testing Library |
| Linting | ESLint 9 (flat config) |
| Build | Vite 8 |
| CI | GitHub Actions |
| Data | [dummyjson.com](https://dummyjson.com) |

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher — [download](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **Git** — [download](https://git-scm.com)

Check your versions:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/muralithangella/e-commerce.git
cd e-commerce
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required because `vite-plugin-pwa@1.2.0` has a peer dependency conflict with Vite 8. The app works correctly despite this warning.

### 3. Set up environment variables

Copy the local environment template:

```bash
cp .env .env.local
```

Open `.env.local` and set the API base URL (already set by default):

```env
VITE_API_BASE_URL=https://dummyjson.com
VITE_SENTRY_DSN=
```

> `.env.local` is gitignored — never commit real secrets.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server with HMR |
| `npm run build` | Build for production |
| `npm run build:staging` | Build for staging environment |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm run test` | Run unit tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

---

## Project Structure

```
src/
├── api/                        # Centralised Axios client
│   └── client.js               # Auth interceptor + error normalisation
├── features/                   # Feature-based modules
│   ├── products/
│   │   ├── api/                # TanStack Query options
│   │   ├── components/         # ProductCard, ProductFilters
│   │   └── routes/             # ProductList, ProductDetail pages
│   ├── cart/
│   │   ├── api/                # Cart queries + optimistic mutations
│   │   ├── components/         # CartItem, CartSummary, CheckoutModal
│   │   └── routes/             # Cart page
│   └── orders/
│       ├── api/                # Orders queries (paginated)
│       ├── components/         # OrderRow
│       └── routes/             # OrderHistory page
├── shared/                     # Cross-feature shared code
│   ├── components/             # Spinner, ErrorMessage, ErrorBoundary,
│   │   │                       # NavigationGuard, PwaUpdateBanner
│   └── hooks/                  # useCartCount, useInvalidateCache
├── layouts/
│   └── MainLayout.jsx          # App shell (header, nav, footer)
├── routes/
│   └── index.jsx               # Router config with lazy loading + loaders
├── lib/
│   └── queryClient.js          # TanStack Query client config
├── utils/
│   ├── logger.js               # Structured logger interface
│   └── providers/              # ConsoleProvider, SentryProvider
└── main.jsx                    # Entry point + global error handlers
```

---

## Environment Files

| File | Purpose | Committed |
|---|---|---|
| `.env` | Base defaults (non-secret) | ✅ Yes |
| `.env.local` | Local dev overrides | ❌ No (gitignored) |
| `.env.staging` | Staging template | ✅ Yes |
| `.env.production` | Production template | ✅ Yes |

All `VITE_` prefixed variables are exposed to the browser. Never put secrets in `VITE_` variables.

---

## Key Architecture Decisions

- **Feature-based structure** — each feature owns its API, components, and routes
- **Server state via TanStack Query** — no Redux/Zustand for API responses
- **Optimistic cart updates** — UI updates instantly, rolls back on error
- **Stale-while-revalidate** — products served from cache instantly, refreshed in background
- **Route-level code splitting** — each page is a separate JS chunk loaded on demand
- **Route loaders for prefetching** — data is fetched before the component renders
- **Swappable logger** — swap console → Sentry/Datadog with one line, zero call site changes
- **PWA offline support** — app shell + product data cached for offline browsing

---

## Running Tests

```bash
# Run all tests
npm run test

# Watch mode (re-runs on file change)
npm run test:watch

# With coverage report
npm run test:coverage
```

Tests are located in `src/features/**/__tests__/` directories.

---

## CI Pipeline

Every pull request to `main` automatically runs:

1. **Lint** — ESLint across all source files
2. **Test** — Unit tests with coverage report
3. **Build** — Production build verification

See `.github/workflows/ci.yml` for the full configuration.

---

## Pages

| Route | Description |
|---|---|
| `/` | Product listing with search (title-only) and category filter |
| `/product/:id` | Product detail with image gallery |
| `/cart` | Cart with quantity controls and checkout |
| `/orders` | Order history with pagination |

---

## Offline Support

The app works offline after the first visit:

- App shell (header, nav) loads instantly from cache
- Product listing is browsable offline (24h cache)
- A banner prompts the user when a new version is available
