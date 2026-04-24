/**
 * session.js — correlation and session identity utilities.
 *
 * sessionId   : one UUID per browser session (survives page refresh,
 *               cleared when the tab is closed). Ties all logs from
 *               one user visit together in a log aggregator.
 *
 * newCorrelationId : one UUID per outbound API request. Ties the
 *               api_request → api_response / api_error pair together
 *               so you can trace a single call end-to-end across
 *               frontend and backend logs.
 */

function uuid() {
  // crypto.randomUUID is available in all modern browsers and Node 14.17+
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ── Session ID ─────────────────────────────────────────────────────────────────
// Stored in sessionStorage so it:
//   - Persists across page refreshes within the same tab
//   - Is unique per tab (two tabs = two sessions)
//   - Is cleared automatically when the tab closes
const SESSION_KEY = 'shopdash_session_id';

function initSessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = uuid();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    // sessionStorage blocked (private mode, iframe sandbox) — use in-memory fallback
    return uuid();
  }
}

export const sessionId = initSessionId();

// ── Correlation ID ─────────────────────────────────────────────────────────────
// Called once per API request — never reused.
export const newCorrelationId = () => uuid();
