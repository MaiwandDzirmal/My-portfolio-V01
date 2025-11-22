import { useEffect, useRef } from 'react';

interface UseGameLoopProps {
  callback: () => void;
  delay: number | null;
  enabled: boolean;
}

/**
 * Custom hook to manage a game loop using setInterval.
 * @param callback The function to execute on each tick.
 * @param delay The delay in milliseconds between ticks. If null, the loop pauses.
 * @param enabled Whether the game loop is currently active.
 */
export function useGameLoop({ callback, delay, enabled }: UseGameLoopProps) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null && enabled) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, enabled]);
}

