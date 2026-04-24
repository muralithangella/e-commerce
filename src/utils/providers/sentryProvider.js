/**
 * SentryProvider — swap in by calling logger.setProvider(SentryProvider).
 * Install: npm install @sentry/react
 * Init:    Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN }) in main.jsx
 *
 * sessionId and correlationId are automatically set on the Sentry scope
 * so every captured error and breadcrumb carries full tracing context.
 */
export const SentryProvider = {
  log(event) {
    import('@sentry/react').then(({ captureException, captureMessage, addBreadcrumb, withScope }) => {
      const { level, event: eventName, error, sessionId, correlationId, ...context } = event;

      // Errors → captureException with session + correlation context on scope
      if (level === 'error' && error instanceof Error) {
        withScope((scope) => {
          scope.setTag('session_id',     sessionId);
          scope.setTag('correlation_id', correlationId ?? 'n/a');
          scope.setExtras(context);
          captureException(error);
        });
        return;
      }

      // All other events → breadcrumbs (visible in Sentry error timeline)
      addBreadcrumb({
        category:  eventName ?? 'log',
        message:   context.message ?? eventName,
        level,
        data: {
          ...context,
          sessionId,
          correlationId,
        },
      });

      // Explicit error messages without an Error object → captureMessage
      if (level === 'error') {
        withScope((scope) => {
          scope.setTag('session_id',     sessionId);
          scope.setTag('correlation_id', correlationId ?? 'n/a');
          captureMessage(context.message ?? eventName, 'error');
        });
      }
    });
  },
};
