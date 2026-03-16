import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { MyPage } from './MyPage';
import './Header.css';

export function Header() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);

  return (
    <>
      <header className="header">
        {user ? (
          <div className="header-user">
            <button
              className="header-mypage-btn"
              onClick={() => setShowMyPage(true)}
            >
              {user.displayName}
            </button>
            <button className="header-logout-btn" onClick={logout}>
              ログアウト
            </button>
          </div>
        ) : (
          <button
            className="header-login-btn"
            onClick={() => setShowAuth(true)}
          >
            ログイン
          </button>
        )}
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showMyPage && <MyPage onClose={() => setShowMyPage(false)} />}
    </>
  );
}
