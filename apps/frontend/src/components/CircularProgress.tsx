import './CircularProgress.css';

interface CircularProgressProps {
  remainingMs: number;
  totalMs: number;
  phase: 'working' | 'resting';
}

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function CircularProgress({ remainingMs, totalMs, phase }: CircularProgressProps) {
  const size = 240;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, remainingMs / totalMs));
  const offset = circumference * (1 - progress);

  const strokeColor = phase === 'working' ? '#4da6ff' : '#2ecc71';
  const label = phase === 'working' ? '' : '休憩中';

  return (
    <div className="circular-progress">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="progress-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="progress-content">
        <span className="progress-time">{formatTime(remainingMs)}</span>
        {label && <span className="progress-label">{label}</span>}
      </div>
    </div>
  );
}
