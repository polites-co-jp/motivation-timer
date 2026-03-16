import { useRef, useCallback } from 'react';

export interface AudioPlayer {
  playBeep: (frequency?: number, duration?: number) => void;
  playLongBeep: (frequency?: number, duration?: number) => void;
  playChime: () => void;
  resume: () => void;
}

export function useAudio(): AudioPlayer {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const resume = useCallback(() => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }, [getCtx]);

  const playTone = useCallback(
    (frequency: number, duration: number) => {
      const ctx = getCtx();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [getCtx]
  );

  const playBeep = useCallback(
    (frequency = 880, duration = 0.15) => {
      playTone(frequency, duration);
    },
    [playTone]
  );

  const playLongBeep = useCallback(
    (frequency = 880, duration = 0.5) => {
      playTone(frequency, duration);
    },
    [playTone]
  );

  const playChime = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now);

      const startTime = now + i * 0.15;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.8);
    });
  }, [getCtx]);

  return { playBeep, playLongBeep, playChime, resume };
}
