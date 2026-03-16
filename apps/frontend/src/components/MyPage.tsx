import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './MyPage.css';

const API_BASE = 'http://localhost:3001/api';

interface UserStats {
  displayName: string;
  totalSessions: number;
  totalCycles: number;
  totalWorkMinutes: number;
  lastActivityAt: string | null;
  createdAt: string;
  dailyStats: { date: string; sessions: string; cycles: string }[];
}

interface Props {
  onClose: () => void;
}

export function MyPage({ onClose }: Props) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/users/${user.id}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="mypage-overlay" onClick={onClose}>
      <div className="mypage-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mypage-close" onClick={onClose}>×</button>
        <h2 className="mypage-title">マイページ</h2>

        {loading ? (
          <p className="mypage-loading">読み込み中...</p>
        ) : stats ? (
          <>
            <p className="mypage-name">{stats.displayName}</p>

            <div className="mypage-stats">
              <div className="mypage-stat-card">
                <span className="mypage-stat-value">{stats.totalCycles}</span>
                <span className="mypage-stat-label">サイクル達成</span>
              </div>
              <div className="mypage-stat-card">
                <span className="mypage-stat-value">{stats.totalSessions}</span>
                <span className="mypage-stat-label">セッション</span>
              </div>
              <div className="mypage-stat-card">
                <span className="mypage-stat-value">
                  {Math.floor(stats.totalWorkMinutes / 60)}h {stats.totalWorkMinutes % 60}m
                </span>
                <span className="mypage-stat-label">合計作業時間</span>
              </div>
            </div>

            {stats.dailyStats.length > 0 && (
              <div className="mypage-history">
                <h3>直近7日間</h3>
                <table className="mypage-table">
                  <thead>
                    <tr>
                      <th>日付</th>
                      <th>セッション</th>
                      <th>サイクル</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.dailyStats.map((d) => (
                      <tr key={d.date}>
                        <td>{d.date}</td>
                        <td>{d.sessions}</td>
                        <td>{d.cycles}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p className="mypage-loading">データの取得に失敗しました</p>
        )}
      </div>
    </div>
  );
}
