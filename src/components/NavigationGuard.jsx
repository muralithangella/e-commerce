import { useCallback, useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

export function NavigationGuard({ isDirty }) {

  const shouldBlock = useCallback(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
    [isDirty],
  );

  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    const proceed = window.confirm(
      'You have unsaved changes. Are you sure you want to leave?',
    );
    if (proceed) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  return null;
}
