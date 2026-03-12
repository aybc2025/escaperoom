import { useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { ACTIONS } from '../context/GameContext';
import { TOTAL_TIME_SECONDS } from '../constants';

export function useTimer() {
  const { state, dispatch } = useGame();
  const { timer } = state;

  // Tick every second
  useEffect(() => {
    if (!timer.running) return;
    const interval = setInterval(() => {
      dispatch({ type: ACTIONS.TICK_TIMER });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer.running, dispatch]);

  // Check for time up
  useEffect(() => {
    if (timer.running && timer.elapsed >= TOTAL_TIME_SECONDS) {
      dispatch({ type: ACTIONS.TIME_UP });
    }
  }, [timer.elapsed, timer.running, dispatch]);

  const start = useCallback(() => {
    dispatch({ type: ACTIONS.START_TIMER });
  }, [dispatch]);

  const stop = useCallback(() => {
    dispatch({ type: ACTIONS.STOP_TIMER });
  }, [dispatch]);

  const remaining = Math.max(0, TOTAL_TIME_SECONDS - timer.elapsed);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return {
    elapsed: timer.elapsed,
    remaining,
    minutes,
    seconds,
    running: timer.running,
    start,
    stop,
    formattedTime: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  };
}
