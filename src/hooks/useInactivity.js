import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Tracks user inactivity and triggers after specified delay.
 * Resets on any click/touch/keypress.
 */
export function useInactivity(delayMs = 90000) {
  const [inactive, setInactive] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    setInactive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setInactive(true);
    }, delayMs);
  }, [delayMs]);

  useEffect(() => {
    resetTimer();

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [resetTimer]);

  return inactive;
}
