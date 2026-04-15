import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PwaUpdateBanner() {
  const {
    offlineReady:  [offlineReady,  setOfflineReady],
    needRefresh:   [needRefresh,   setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {

      if (registration) {
        setInterval(() => {
          if (!registration.installing && navigator.onLine) {
            registration.update();
          }
        }, 60_000);
      }
    },
  });


  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 4000);
    return () => clearTimeout(t);
  }, [offlineReady, setOfflineReady]);

  if (!offlineReady && !needRefresh) return null;

  if (offlineReady) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="pwa-update-banner"
        style={{ background: 'var(--clr-success)' }}
      >
        <span>✓ App ready to work offline.</span>
        <button
          className="btn btn-sm"
          style={{ color: '#fff', borderColor: 'rgba(255,255,255,.4)', border: '1px solid' }}
          aria-label="Dismiss offline ready notification"
          onClick={() => setOfflineReady(false)}
        >
          Dismiss
        </button>
      </div>
    );
  }


  return (
    <div role="alert" aria-live="assertive" className="pwa-update-banner">
      <span>🆕 A new version is available.</span>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => updateServiceWorker(true)}
      >
        Update now
      </button>
      <button
        className="btn btn-ghost btn-sm"
        style={{ color: 'var(--clr-surface)', borderColor: 'rgba(255,255,255,.3)' }}
        aria-label="Dismiss update notification"
        onClick={() => setNeedRefresh(false)}
      >
        Later
      </button>
    </div>
  );
}
