const STYLES = {
  debug: 'color:#6b7280;font-weight:500',
  info:  'color:#3b82f6;font-weight:500',
  warn:  'color:#f59e0b;font-weight:600',
  error: 'color:#ef4444;font-weight:700',
};

const CONSOLE = {
  debug: console.debug,
  info:  console.info,
  warn:  console.warn,
  error: console.error,
};

/**
 * ConsoleProvider — implements the LogProvider interface.
 * Emits structured JSON-serialisable events to the browser console.
 * Replace this with SentryProvider or DatadogProvider without touching call sites.
 */
export const ConsoleProvider = {
  log(event) {
    const { level, ...rest } = event;
    const fn = CONSOLE[level] ?? console.log;
    fn(`%c[${level.toUpperCase()}]`, STYLES[level] ?? '', rest);
  },
};
