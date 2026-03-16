import { useReducer, useCallback, useEffect } from 'react';
import type { AppState, AppAction } from './types';
import {
  WORK_DURATION_MS,
  SHORT_BREAK_DURATION_MS,
  LONG_BREAK_DURATION_MS,
  SESSIONS_BEFORE_LONG_BREAK,
  MOTIVATION_MESSAGES,
} from './constants';
import { useTimer } from './hooks/useTimer';
import { useAudio } from './hooks/useAudio';
import { AnimatedBackground } from './components/AnimatedBackground';
import { CountdownOverlay } from './components/CountdownOverlay';
import { MotivationMessage } from './components/MotivationMessage';
import { CircularProgress } from './components/CircularProgress';
import { SessionIndicator } from './components/SessionIndicator';
import { Controls } from './components/Controls';
import './App.css';

const initialState: AppState = {
  phase: 'idle',
  remainingMs: 0,
  currentSession: 1,
  longBreakEnabled: false,
  countdownNumber: null,
  motivationText: null,
  targetEndTime: null,
};

function pickRandomMessage(): string {
  return MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];
}

function getBreakDuration(state: AppState): number {
  if (
    state.longBreakEnabled &&
    state.currentSession % SESSIONS_BEFORE_LONG_BREAK === 0
  ) {
    return LONG_BREAK_DURATION_MS;
  }
  return SHORT_BREAK_DURATION_MS;
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START':
      return { ...state, phase: 'countdown', countdownNumber: 3 };

    case 'COUNTDOWN_END':
      return {
        ...state,
        phase: 'motivated',
        countdownNumber: null,
        motivationText: pickRandomMessage(),
      };

    case 'MOTIVATION_END': {
      const now = Date.now();
      return {
        ...state,
        phase: 'working',
        motivationText: null,
        remainingMs: WORK_DURATION_MS,
        targetEndTime: now + WORK_DURATION_MS,
      };
    }

    case 'TICK': {
      if (!state.targetEndTime) return state;
      const remaining = state.targetEndTime - action.now;
      if (remaining <= 0) {
        return { ...state, remainingMs: 0 };
      }
      return { ...state, remainingMs: remaining };
    }

    case 'PHASE_COMPLETE': {
      if (state.phase === 'working') {
        const breakMs = getBreakDuration(state);
        const now = Date.now();
        return {
          ...state,
          phase: 'resting',
          remainingMs: breakMs,
          targetEndTime: now + breakMs,
        };
      }
      if (state.phase === 'resting') {
        return {
          ...state,
          phase: 'countdown',
          remainingMs: 0,
          targetEndTime: null,
          currentSession: state.currentSession + 1,
          countdownNumber: 3,
        };
      }
      return state;
    }

    case 'TOGGLE_LONG_BREAK':
      return { ...state, longBreakEnabled: !state.longBreakEnabled };

    case 'RESET':
      return { ...initialState, longBreakEnabled: state.longBreakEnabled };

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audio = useAudio();

  const isTimerRunning = state.phase === 'working' || state.phase === 'resting';

  const onTick = useCallback(
    (now: number) => {
      dispatch({ type: 'TICK', now });
    },
    []
  );

  useTimer(isTimerRunning, onTick);

  // タイマー完了検知
  useEffect(() => {
    if (isTimerRunning && state.remainingMs <= 0 && state.targetEndTime) {
      audio.playChime();
      dispatch({ type: 'PHASE_COMPLETE' });
    }
  }, [isTimerRunning, state.remainingMs, state.targetEndTime, audio]);

  const handleStart = useCallback(() => {
    audio.resume();
    dispatch({ type: 'START' });
  }, [audio]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const handleToggleLongBreak = useCallback(() => {
    dispatch({ type: 'TOGGLE_LONG_BREAK' });
  }, []);

  const handleCountdownComplete = useCallback(() => {
    dispatch({ type: 'COUNTDOWN_END' });
  }, []);

  const handleMotivationComplete = useCallback(() => {
    dispatch({ type: 'MOTIVATION_END' });
  }, []);

  const totalMs =
    state.phase === 'working'
      ? WORK_DURATION_MS
      : getBreakDuration(state);

  return (
    <div className="app">
      <AnimatedBackground phase={state.phase} />

      {state.phase === 'idle' && <h1 className="app-title">やる気タイマー</h1>}

      {state.phase === 'countdown' && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}

      {state.phase === 'motivated' && state.motivationText && (
        <MotivationMessage
          message={state.motivationText}
          onComplete={handleMotivationComplete}
        />
      )}

      {(state.phase === 'working' || state.phase === 'resting') && (
        <div className="timer-section">
          <CircularProgress
            remainingMs={state.remainingMs}
            totalMs={totalMs}
            phase={state.phase}
          />
          <SessionIndicator
            currentSession={state.currentSession}
            totalSessions={SESSIONS_BEFORE_LONG_BREAK}
          />
        </div>
      )}

      <Controls
        phase={state.phase}
        longBreakEnabled={state.longBreakEnabled}
        onStart={handleStart}
        onReset={handleReset}
        onToggleLongBreak={handleToggleLongBreak}
      />
    </div>
  );
}
