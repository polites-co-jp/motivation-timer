import './SessionIndicator.css';

interface SessionIndicatorProps {
  currentSession: number;
  totalSessions: number;
}

export function SessionIndicator({ currentSession, totalSessions }: SessionIndicatorProps) {
  return (
    <div className="session-indicator">
      {Array.from({ length: totalSessions }, (_, i) => (
        <span
          key={i}
          className={`session-dot ${i < currentSession ? 'completed' : ''}`}
        >
          {i < currentSession ? '●' : '○'}
        </span>
      ))}
    </div>
  );
}
