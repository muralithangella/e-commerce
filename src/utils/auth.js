/**
 * auth.js — secure in-memory token store.
 *
 * WHY NOT localStorage / sessionStorage?
 * ─────────────────────────────────────
 * Both are synchronously readable by ANY JavaScript running on the page.
 * A single XSS vulnerability (injected ad script, compromised npm package,
 * browser extension) can silently exfiltrate a token stored there.
 *
 * WHY IN-MEMORY?
 * ─────────────
 * A module-level variable is only accessible to code that explicitly imports
 * this module. XSS scripts running in the page context cannot access it.
 * Trade-off: the token is lost on page refresh — the user must re-authenticate.
 * For this demo app that is acceptable. For production, use the pattern below.
 *
 * PRODUCTION RECOMMENDATION — HttpOnly Cookie + Refresh Token
 * ────────────────────────────────────────────────────────────
 * 1. Backend sets the access token in an HttpOnly, Secure, SameSite=Strict
 *    cookie — JavaScript cannot read it at all, even with XSS.
 * 2. A short-lived access token (15 min) is sent automatically by the browser
 *    on every request (no JS involvement).
 * 3. A refresh token (HttpOnly cookie, longer TTL) is used by a /auth/refresh
 *    endpoint to issue new access tokens silently.
 * 4. The frontend only stores a boolean "isAuthenticated" flag in memory to
 *    drive UI state — never the token itself.
 *
 * Migration path from this implementation:
 *   - Replace setToken() calls with a POST /auth/login that sets the cookie.
 *   - Remove the Authorization header interceptor in api/client.js — the
 *     browser sends the cookie automatically with credentials: 'include'.
 *   - Add withCredentials: true to the Axios instance.
 */

// ── In-memory store ────────────────────────────────────────────────────────────
// Module-level variable — lives only in JS heap, never written to any
// Web Storage API. Garbage-collected on page unload.
let _token = null;

export const auth = {
  /** Read the current access token. Returns null if not authenticated. */
  getToken() { return _token; },

  /**
   * Store a new access token after a successful login.
   * In production this would be replaced by the server setting an HttpOnly cookie.
   */
  setToken(token) {
    if (typeof token !== 'string' || !token.trim()) {
      throw new Error('auth.setToken: token must be a non-empty string');
    }
    _token = token;
  },

  /** Clear the token on logout or 401 response. */
  clearToken() { _token = null; },

  /** Convenience — true if a token is currently held in memory. */
  isAuthenticated() { return _token !== null; },
};
