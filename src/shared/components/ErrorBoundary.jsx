import { Component } from 'react';
import { logger } from '@/utils/logger';


export default class AppErrorBoundary extends Component {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('react_error', {
      message:    error.message,
      stack:      error.stack,
      componentStack: errorInfo.componentStack,
      error,      // full Error object — Sentry/Datadog providers use this
    });
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 32, textAlign: 'center', fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          Something went wrong
        </h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 24, maxWidth: 400 }}>
          An unexpected error occurred. The error has been logged and our team has been notified.
        </p>
        <button
          style={{
            padding: '10px 24px', borderRadius: 6, border: 'none',
            background: '#4f46e5', color: '#fff', fontSize: 14,
            fontWeight: 500, cursor: 'pointer',
          }}
          onClick={() => {
            this.setState({ error: null, errorInfo: null });
            window.location.href = '/';
          }}
        >
          Return to home
        </button>
        {!import.meta.env.PROD && (
          <details style={{ marginTop: 24, textAlign: 'left', maxWidth: 600 }}>
            <summary style={{ cursor: 'pointer', color: '#6b7280', fontSize: 13 }}>
              Error details (dev only)
            </summary>
            <pre style={{ fontSize: 11, marginTop: 8, color: '#ef4444', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.stack}
            </pre>
          </details>
        )}
      </div>
    );
  }
}
