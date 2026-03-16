import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

interface Props {
  onClose: () => void;
}

export function AuthModal({ onClose }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, displayName, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
        <h2 className="auth-title">
          {mode === 'login' ? 'ログイン' : 'ユーザ登録'}
        </h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className="auth-field">
              <span>表示名</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="ニックネーム"
              />
            </label>
          )}
          <label className="auth-field">
            <span>メールアドレス</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@mail.com"
            />
          </label>
          <label className="auth-field">
            <span>パスワード</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="6文字以上"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? '処理中...'
              : mode === 'login'
                ? 'ログイン'
                : '登録する'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>
              アカウントをお持ちでない方は
              <button onClick={() => { setMode('register'); setError(''); }}>
                新規登録
              </button>
            </>
          ) : (
            <>
              既にアカウントをお持ちの方は
              <button onClick={() => { setMode('login'); setError(''); }}>
                ログイン
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
