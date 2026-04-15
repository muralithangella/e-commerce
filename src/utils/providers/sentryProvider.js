/**
 * SentryProvider — swap in by calling logger.setProvider(SentryProvider).
 * Install: npm install @sentry/react
 * Init:    Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN }) in main.jsx
 *
 * No call site changes needed — logger.info(), logger.error() etc. stay identical.
 */
export const SentryProvider = {
  log(event) {
    // Lazy import so Sentry is never bundled unless this provider is active
    import('@sentry/react').then(({ captureException, captureMessage, addBreadcrumb }) => {
      const { level, event: eventName, error, ...context } = event;

      // Errors → Sentry.captureException with full context
      if (level === 'error' && error instanceof Error) {
        captureException(error, { extra: context });
        return;
      }

      // Warnings and info → breadcrumbs (visible in Sentry error context)
      addBreadcrumb({
        category: eventName ?? 'log',
        message:  context.message ?? eventName,
        level,
        data: context,
      });

      // Explicit error messages without an Error object → captureMessage
      if (level === 'error') {
        captureMessage(context.message ?? eventName, 'error');
      }
    });
  },
};
