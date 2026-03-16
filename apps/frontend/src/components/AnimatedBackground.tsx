import type { AppPhase } from '../types';
import './AnimatedBackground.css';

interface AnimatedBackgroundProps {
  phase: AppPhase;
}

export function AnimatedBackground({ phase }: AnimatedBackgroundProps) {
  const colorClass =
    phase === 'working' ? 'bg-working' :
    phase === 'resting' ? 'bg-resting' :
    'bg-idle';

  return <div className={`animated-background ${colorClass}`} />;
}
