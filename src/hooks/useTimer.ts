import { useEffect, useRef } from 'react';

/**
 * requestAnimationFrame ベースのタイマーフック。
 * isRunning が true の間、毎フレーム onTick(Date.now()) を呼び出す。
 */
export function useTimer(
  isRunning: boolean,
  onTick: (now: number) => void
): void {
  const callbackRef = useRef(onTick);
  callbackRef.current = onTick;

  useEffect(() => {
    if (!isRunning) return;

    let rafId: number;

    const tick = () => {
      callbackRef.current(Date.now());
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [isRunning]);
}
