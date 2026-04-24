import axios from 'axios';
import { logger } from '@/utils/logger';
import { newCorrelationId } from '@/utils/session';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
});

// WeakMap stores { startTime, correlationId } keyed on the request config object.
// Avoids mutating Axios internals and is GC-friendly.
const requestMeta = new WeakMap();

// ── Request interceptor ────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // 1. Auth token
    try {
      const token = localStorage.getItem('auth_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      logger.warn('api_request_setup', { message: 'Could not read auth_token from localStorage' });
    }

    // 2. Correlation ID — one UUID per request.
    //    Sent as a request header so the backend can log the same ID,
    //    enabling end-to-end tracing across frontend and backend logs.
    const correlationId = newCorrelationId();
    config.headers['X-Correlation-ID'] = correlationId;

    // 3. Record start time alongside correlationId
    requestMeta.set(config, { startTime: Date.now(), correlationId });

    logger.debug('api_request', {
      method:        config.method?.toUpperCase(),
      url:           config.url,
      correlationId, // ties this log to its response/error log
    });

    return config;
  },
  (error) => Promise.reject(normaliseError(error)),
);

// ── Response interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    const meta = requestMeta.get(response.config);
    const ms   = meta ? Date.now() - meta.startTime : -1;

    logger.info('api_response', {
      method:        response.config.method?.toUpperCase(),
      url:           response.config.url,
      status:        response.status,
      duration:      ms,
      correlationId: meta?.correlationId, // same ID as the request log
    });

    return response;
  },
  (error) => {
    const meta      = error.config ? requestMeta.get(error.config) : null;
    const normalised = normaliseError(error);

    logger.error('api_error', {
      ...normalised,
      correlationId: meta?.correlationId, // ties error back to the original request
    });

    return Promise.reject(normalised);
  },
);

// ── Error normaliser ───────────────────────────────────────────────────────────
export function normaliseError(error) {
  if (error.response) {
    return {
      type:    'http',
      message: error.response.data?.message ?? httpMessage(error.response.status),
      status:  error.response.status,
      url:     error.config?.url,
      method:  error.config?.method?.toUpperCase(),
    };
  }

  if (error.request) {
    const isTimeout = error.code === 'ECONNABORTED';
    return {
      type:    'network',
      message: isTimeout
        ? 'The request timed out. Please check your connection and try again.'
        : 'Unable to reach the server. Please check your internet connection.',
      status:  null,
      url:     error.config?.url,
      method:  error.config?.method?.toUpperCase(),
    };
  }

  return {
    type:    'client',
    message: error.message ?? 'An unexpected error occurred.',
    status:  null,
    url:     null,
    method:  null,
  };
}

// ── HTTP status → human message ────────────────────────────────────────────────
function httpMessage(status) {
  const map = {
    400: 'Bad request. Please check your input.',
    401: 'You are not authorised. Please sign in.',
    403: 'You do not have permission to access this resource.',
    404: 'The requested resource was not found.',
    429: 'Too many requests. Please slow down.',
    500: 'A server error occurred. Please try again later.',
    502: 'Bad gateway. The server is temporarily unavailable.',
    503: 'Service unavailable. Please try again later.',
  };
  return map[status] ?? `Unexpected error (HTTP ${status}).`;
}
