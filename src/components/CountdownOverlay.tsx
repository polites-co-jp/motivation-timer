import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import { COUNTDOWN_SECONDS } from '../constants';
import './CountdownOverlay.css';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [current, setCurrent] = useState(COUNTDOWN_SECONDS);
  const audio = useAudio();
  const completedRef = useRef(false);

  useEffect(() => {
    audio.playBeep();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (current <= 0) {
      if (!completedRef.current) {
        completedRef.current = true;
        audio.playLongBeep();
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      const next = current - 1;
      setCurrent(next);
      if (next > 0) {
        audio.playBeep();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [current, audio, onComplete]);

  if (current <= 0) return null;

  return (
    <div className="countdown-overlay">
      <span key={current} className="countdown-number">
        {current}
      </span>
    </div>
  );
}
