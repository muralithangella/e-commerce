import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AppErrorBoundary from '@/shared/components/ErrorBoundary';
import { logger } from '@/utils/logger';
import { sessionId } from '@/utils/session';

// ── Session start log ──────────────────────────────────────────────────────────
// First log event of every session — confirms the session ID and app version.
logger.info('session_start', {
  sessionId,
  userAgent: navigator.userAgent,
  url:       window.location.href,
});

// ── Global error handlers ──────────────────────────────────────────────────────
// These catch errors that happen OUTSIDE the React tree:
// async callbacks, event listeners, promise rejections in non-React code.
// React's ErrorBoundary only catches errors during render/lifecycle.

window.onerror = (message, source, lineno, colno, error) => {
  logger.error('unhandled_error', {
    message: typeof message === 'string' ? message : String(message),
    source,
    lineno,
    colno,
    sessionId, // explicit here — logger also injects it, but being explicit aids debugging
    error: error ?? undefined,
  });
  return false;
};

window.onunhandledrejection = (event) => {
  const reason = event.reason;
  logger.error('unhandled_rejection', {
    message:   reason?.message ?? String(reason),
    stack:     reason?.stack,
    sessionId,
    error:     reason instanceof Error ? reason : undefined,
  });
};

// ── Render ─────────────────────────────────────────────────────────────────────
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AppErrorBoundary is the outermost safety net — catches any render error
        that escapes the route-level boundaries and logs it via the logger. */}
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
