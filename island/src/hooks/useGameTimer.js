import { useEffect } from 'react';

/**
 * Dispatches a TICK action every second while the timer is running.
 */
export function useGameTimer(running, dispatch) {
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [running, dispatch]);
}
