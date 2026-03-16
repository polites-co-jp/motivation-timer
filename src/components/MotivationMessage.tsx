import './MotivationMessage.css';

interface MotivationMessageProps {
  message: string;
  onComplete: () => void;
}

export function MotivationMessage({ message, onComplete }: MotivationMessageProps) {
  return (
    <div className="motivation-overlay">
      <p className="motivation-text" onAnimationEnd={onComplete}>
        {message}
      </p>
    </div>
  );
}
