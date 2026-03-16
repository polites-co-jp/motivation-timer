import type { AppPhase } from '../types';
import './Controls.css';

interface ControlsProps {
  phase: AppPhase;
  longBreakEnabled: boolean;
  onStart: () => void;
  onReset: () => void;
  onToggleLongBreak: () => void;
}

export function Controls({
  phase,
  longBreakEnabled,
  onStart,
  onReset,
  onToggleLongBreak,
}: ControlsProps) {
  if (phase === 'idle') {
    return (
      <div className="controls">
        <label className="long-break-label">
          <input
            type="checkbox"
            checked={longBreakEnabled}
            onChange={onToggleLongBreak}
          />
          4セッション後に長い休憩
        </label>
        <button className="btn btn-start" onClick={onStart}>
          スタート
        </button>
      </div>
    );
  }

  return (
    <div className="controls">
      <button className="btn btn-reset" onClick={onReset}>
        リセット
      </button>
    </div>
  );
}
