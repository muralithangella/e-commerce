import axios from 'axios';
import { logger } from '@/utils/logger';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
});

const requestTimings = new WeakMap();


apiClient.interceptors.request.use(
  (config) => {
 
    try {
      const token = localStorage.getItem('auth_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {

      logger.warn('api_request_setup', { message: 'Could not read auth_token from localStorage' });
    }

 
    requestTimings.set(config, Date.now());

    logger.debug('api_request', { method: config.method?.toUpperCase(), url: config.url });
    return config;
  },
  
  (error) => Promise.reject(normaliseError(error)),
);


apiClient.interceptors.response.use(
  (response) => {
    const start = requestTimings.get(response.config);
    const ms    = start ? Date.now() - start : -1;
    logger.info('api_response', {
      method:   response.config.method?.toUpperCase(),
      url:      response.config.url,
      status:   response.status,
      duration: ms,   // milliseconds — structured field, not a string
    });
    return response;
  },
  (error) => {
    const normalised = normaliseError(error);
    logger.error('api_error', normalised);
    return Promise.reject(normalised);
  },
);

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
