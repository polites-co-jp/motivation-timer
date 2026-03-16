/** アプリの状態 */
export type AppPhase =
  | 'idle'        // 待機中
  | 'countdown'   // 3,2,1 カウントダウン演出
  | 'motivated'   // やる気メッセージ表示
  | 'working'     // 作業タイマー稼働中
  | 'resting';    // 休憩タイマー稼働中

/** アプリ全体の状態 */
export interface AppState {
  phase: AppPhase;
  /** 残り時間（ミリ秒） */
  remainingMs: number;
  /** 現在のセッション番号（1始まり） */
  currentSession: number;
  /** 長い休憩を有効にするか */
  longBreakEnabled: boolean;
  /** 現在表示中のカウントダウン数字 (3, 2, 1) */
  countdownNumber: number | null;
  /** 現在表示中のやる気メッセージ */
  motivationText: string | null;
  /** タイマー目標終了時刻（ミリ秒） */
  targetEndTime: number | null;
}

/** Reducer アクション */
export type AppAction =
  | { type: 'START' }
  | { type: 'RESET' }
  | { type: 'TICK'; now: number }
  | { type: 'COUNTDOWN_TICK'; number: number }
  | { type: 'COUNTDOWN_END' }
  | { type: 'MOTIVATION_END' }
  | { type: 'PHASE_COMPLETE' }
  | { type: 'TOGGLE_LONG_BREAK' };
