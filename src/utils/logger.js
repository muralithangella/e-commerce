import { ConsoleProvider } from './providers/consoleProvider';

/**
 * Logger — provider-backed structured logging interface.
 *
 * Every log call emits a structured event object:
 *   { level, event, timestamp, ...payload }
 *
 * The underlying provider (console, Sentry, Datadog) is swapped via
 * logger.setProvider(provider) — call sites never change.
 *
 * Usage:
 *   logger.info('route_change', { from: '/', to: '/cart' });
 *   logger.error('api_error',   { message, status, url });
 *   logger.debug('cache_hit',   { queryKey: ['products'] });
 */

let _provider = ConsoleProvider;
const _isProd  = import.meta.env.PROD;

function emit(level, event, payload = {}) {
  // Suppress debug logs in production — they are for development only
  if (level === 'debug' && _isProd) return;

  _provider.log({
    level,
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

export const logger = {
  /** Swap the underlying provider without changing any call site. */
  setProvider(provider) { _provider = provider; },

  debug: (event, payload) => emit('debug', event, payload),
  info:  (event, payload) => emit('info',  event, payload),
  warn:  (event, payload) => emit('warn',  event, payload),
  error: (event, payload) => emit('error', event, payload),
};
