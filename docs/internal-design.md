# やる気タイマー — 内部設計書

## 1. 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React 19 |
| ビルドツール | Vite |
| 言語 | TypeScript |
| スタイリング | CSS Modules または CSS-in-JS なし（CSS ファイル） |
| 音声 | Web Audio API |
| 状態管理 | React hooks（useReducer） |

## 2. ディレクトリ構成

```
src/
├── App.tsx                  # ルートコンポーネント、状態管理
├── App.css                  # グローバルスタイル
├── main.tsx                 # エントリポイント
├── components/
│   ├── CircularProgress.tsx # 円形プログレスバー
│   ├── CircularProgress.css
│   ├── CountdownOverlay.tsx # 3,2,1 カウントダウン演出
│   ├── CountdownOverlay.css
│   ├── MotivationMessage.tsx # やる気メッセージ表示
│   ├── MotivationMessage.css
│   ├── Controls.tsx         # スタート・リセットボタン
│   ├── Controls.css
│   ├── SessionIndicator.tsx # セッション数ドット表示
│   ├── SessionIndicator.css
│   ├── AnimatedBackground.tsx # うねうねグラデーション背景
│   └── AnimatedBackground.css
├── hooks/
│   ├── useTimer.ts          # タイマーロジック（カウントダウン制御）
│   └── useAudio.ts          # Web Audio API ラッパー
├── constants.ts             # 定数定義（時間、メッセージ一覧）
└── types.ts                 # 型定義
```

## 3. 型定義 (`types.ts`)

```typescript
/** アプリの状態 */
type AppPhase =
  | 'idle'        // 待機中
  | 'countdown'   // 3,2,1 カウントダウン演出
  | 'motivated'   // やる気メッセージ表示
  | 'working'     // 作業タイマー稼働中
  | 'resting';    // 休憩タイマー稼働中

/** アプリ全体の状態 */
interface AppState {
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
}

/** Reducer アクション */
type AppAction =
  | { type: 'START' }
  | { type: 'RESET' }
  | { type: 'TICK'; now: number }
  | { type: 'COUNTDOWN_TICK'; number: number }
  | { type: 'COUNTDOWN_END' }
  | { type: 'MOTIVATION_END' }
  | { type: 'PHASE_COMPLETE' }
  | { type: 'TOGGLE_LONG_BREAK' };
```

## 4. 状態管理 (`App.tsx` — useReducer)

### 4.1 状態遷移表

| 現在の phase | アクション | 次の phase | 処理内容 |
|---|---|---|---|
| idle | START | countdown | カウントダウン演出開始 |
| countdown | COUNTDOWN_END | motivated | やる気メッセージを設定 |
| motivated | MOTIVATION_END | working | remainingMs を 25分 に設定、タイマー開始 |
| working | PHASE_COMPLETE | resting | remainingMs を 5分 (or 25分) に設定 |
| resting | PHASE_COMPLETE | countdown | currentSession++、次のカウントダウン開始 |
| 任意 | RESET | idle | 全状態を初期値に戻す |

### 4.2 Reducer 実装方針

- `useReducer` で状態を一元管理する
- 副作用（音声再生、タイマー制御）は `useEffect` で phase の変化に反応して実行
- タイマーの TICK は `requestAnimationFrame` + 経過時間ベースで精度を担保

## 5. コンポーネント詳細

### 5.1 App (`App.tsx`)

**責務**: 状態管理の中心。useReducer でアプリ全体の状態を持ち、子コンポーネントに props で渡す。

```
App
├── AnimatedBackground (phase に応じた色)
├── CountdownOverlay (countdown phase 時)
├── MotivationMessage (motivated phase 時)
├── CircularProgress (working / resting phase 時)
├── SessionIndicator (working / resting phase 時)
└── Controls (全 phase)
```

### 5.2 CircularProgress (`components/CircularProgress.tsx`)

**責務**: SVG で円形プログレスバーを描画する。

**Props**:
```typescript
interface CircularProgressProps {
  /** 残り時間（ミリ秒） */
  remainingMs: number;
  /** 合計時間（ミリ秒） */
  totalMs: number;
  /** 作業中 or 休憩中 */
  phase: 'working' | 'resting';
}
```

**実装方針**:
- SVG の `<circle>` を2つ重ねる（背景リング + プログレスリング）
- `stroke-dasharray` と `stroke-dashoffset` で進捗を表現
- 中央に残り時間を `MM:SS` 形式で表示
- phase によってストロークの色を変える（working: 青, resting: 緑）

### 5.3 CountdownOverlay (`components/CountdownOverlay.tsx`)

**責務**: 「3, 2, 1」カウントダウンをオーバーレイ表示する。

**Props**:
```typescript
interface CountdownOverlayProps {
  number: number | null;
  onComplete: () => void;
}
```

**実装方針**:
- 1秒ごとに表示する数字を 3 → 2 → 1 と切り替え
- 各数字表示時に `useAudio` のビープ音を再生
- 数字は拡大→フェードのアニメーション（CSS `@keyframes`）
- 最後にロングビープを再生し、`onComplete` を呼ぶ

### 5.4 MotivationMessage (`components/MotivationMessage.tsx`)

**責務**: やる気メッセージを画面中央にフェードイン/アウト表示する。

**Props**:
```typescript
interface MotivationMessageProps {
  message: string;
  onComplete: () => void;
}
```

**実装方針**:
- CSS アニメーションでフェードイン（0.3s）→ 表示（1.4s）→ フェードアウト（0.3s）、合計約2秒
- アニメーション終了時に `onAnimationEnd` で `onComplete` を呼ぶ

### 5.5 Controls (`components/Controls.tsx`)

**責務**: スタート・リセットボタンの表示と操作。

**Props**:
```typescript
interface ControlsProps {
  phase: AppPhase;
  longBreakEnabled: boolean;
  onStart: () => void;
  onReset: () => void;
  onToggleLongBreak: () => void;
}
```

**表示ルール**:
- `idle`: スタートボタン + 長い休憩チェックボックス
- その他: リセットボタン

### 5.6 SessionIndicator (`components/SessionIndicator.tsx`)

**責務**: 現在のセッション進行状況をドットで表示する。

**Props**:
```typescript
interface SessionIndicatorProps {
  currentSession: number;
  totalSessions: number; // 4固定（長い休憩までの回数）
}
```

**実装方針**:
- 4つのドットを横並びに表示
- 完了したセッションは塗りつぶし（●）、未完了は空（○）

### 5.7 AnimatedBackground (`components/AnimatedBackground.tsx`)

**責務**: 画面全体にうねうね動くグラデーション背景を描画する。

**Props**:
```typescript
interface AnimatedBackgroundProps {
  phase: AppPhase;
}
```

**実装方針**:
- CSS `@keyframes` で `background-position` または `background-size` をアニメーション
- 複数の `radial-gradient` を重ね合わせ、それぞれ異なる速度で動かすことでうねうね感を演出
- phase に応じた色パレット:
  - `idle`: グレー〜薄紫系のニュートラル
  - `working`: 濃い青〜水色
  - `resting`: 緑〜エメラルド
  - `countdown`, `motivated`: 直前の phase の色を引き継ぐ（初回は idle の色）
- 色の切り替えは CSS `transition` で滑らかに行う（約1秒）

## 6. Hooks 詳細

### 6.1 useTimer (`hooks/useTimer.ts`)

**責務**: カウントダウンタイマーのロジックを管理する。

```typescript
function useTimer(
  isRunning: boolean,
  onTick: (now: number) => void
): void
```

**実装方針**:
- `requestAnimationFrame` ループで毎フレーム呼び出し
- 開始時刻を `performance.now()` で記録し、経過時間ベースで計算
  - `setInterval` は タブ非アクティブ時にスロットルされるため不採用
- `isRunning` が false の間はループを停止
- 毎フレーム `onTick(now)` を呼び出し、App 側で remainingMs を更新

### 6.2 useAudio (`hooks/useAudio.ts`)

**責務**: Web Audio API を使ってビープ音・チャイム音を生成・再生する。

```typescript
interface AudioPlayer {
  playBeep: (frequency?: number, duration?: number) => void;
  playLongBeep: (frequency?: number, duration?: number) => void;
  playChime: () => void;
}

function useAudio(): AudioPlayer
```

**実装方針**:
- `AudioContext` を1つ作成し、コンポーネントのライフサイクルに合わせて管理
- `OscillatorNode` + `GainNode` で音を合成
  - ビープ: 880Hz, 0.15秒
  - ロングビープ: 880Hz, 0.5秒
  - チャイム: 周波数を変えた複数のビープを短い間隔で重ねて和音的に再生
- ユーザー操作（スタートボタン押下）をトリガーに `AudioContext.resume()` を呼び、ブラウザの自動再生ポリシーに対応

## 7. 定数定義 (`constants.ts`)

```typescript
/** 作業時間（ミリ秒） */
export const WORK_DURATION_MS = 25 * 60 * 1000;

/** 短い休憩時間（ミリ秒） */
export const SHORT_BREAK_DURATION_MS = 5 * 60 * 1000;

/** 長い休憩時間（ミリ秒） */
export const LONG_BREAK_DURATION_MS = 25 * 60 * 1000;

/** 長い休憩までのセッション数 */
export const SESSIONS_BEFORE_LONG_BREAK = 4;

/** カウントダウン秒数 */
export const COUNTDOWN_SECONDS = 3;

/** やる気メッセージ表示時間（ミリ秒） */
export const MOTIVATION_DISPLAY_MS = 2000;

/** やる気メッセージ一覧 */
export const MOTIVATION_MESSAGES: string[] = [
  '集中して最高の25分にしよう！',
  '小さな一歩が大きな成果になる',
  '今この瞬間に全力を注ごう',
  'やると決めたあなたはもう半分成功している',
  '深呼吸して、さあ始めよう',
  'この25分が未来を変える',
  '一歩ずつ、確実に前へ',
  '集中力は最強の武器だ',
  'さあ、フロー状態に入ろう',
  '今日の努力は明日の自信になる',
];
```

## 8. タイマー精度の設計

### 課題

ブラウザはバックグラウンドタブで `setInterval` / `setTimeout` をスロットルする（最小1秒間隔に制限）。これにより、タイマーが不正確になる可能性がある。

### 解決策

- タイマー開始時に `Date.now()` で**目標終了時刻**を記録する
- 毎 tick で `残り時間 = 目標終了時刻 - Date.now()` として計算する
- 表示更新は `requestAnimationFrame` で行うが、タブがバックグラウンドの場合 rAF は停止する
- タブが再度フォーカスされた時に正しい残り時間が即座に表示される
- `remainingMs <= 0` になった時点で phase 遷移をトリガーする

## 9. 音声再生のブラウザ制約対応

### 課題

モダンブラウザは、ユーザー操作なしでの `AudioContext` 自動再生をブロックする。

### 解決策

1. `AudioContext` はモジュールスコープで遅延初期化する
2. スタートボタンの `onClick` ハンドラ内で `audioContext.resume()` を呼ぶ
3. 以降のビープ音・チャイム音はすべてこの AudioContext 上で再生する

## 10. CSS アニメーション設計

### 10.1 うねうねグラデーション

```css
.background {
  background:
    radial-gradient(ellipse at 20% 50%, var(--color-1), transparent 50%),
    radial-gradient(ellipse at 80% 20%, var(--color-2), transparent 50%),
    radial-gradient(ellipse at 50% 80%, var(--color-3), transparent 50%);
  animation: sway 8s ease-in-out infinite;
}

@keyframes sway {
  0%, 100% { background-position: 0% 0%, 100% 0%, 50% 100%; }
  33%      { background-position: 10% 20%, 90% 10%, 40% 90%; }
  66%      { background-position: -5% 10%, 105% -5%, 55% 105%; }
}
```

- CSS カスタムプロパティ (`--color-1`, `--color-2`, `--color-3`) を phase ごとに切り替え
- `transition: --color-* 1s ease` で滑らかな色遷移

### 10.2 カウントダウン数字アニメーション

```css
@keyframes countPop {
  0%   { transform: scale(0.5); opacity: 0; }
  30%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}
```

### 10.3 やる気メッセージアニメーション

```css
@keyframes fadeInOut {
  0%   { opacity: 0; transform: translateY(20px); }
  15%  { opacity: 1; transform: translateY(0); }
  85%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}
```
