import { Router } from "express";
import pool from "../db.js";

const router = Router();

// マイページ: ユーザ統計情報を取得
router.get("/:userId/stats", async (req, res) => {
  const { userId } = req.params;

  try {
    const userResult = await pool.query(
      `SELECT id, email, display_name, total_sessions, total_cycles, last_activity_at, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: "ユーザが見つかりません" });
      return;
    }

    const user = userResult.rows[0];

    // 直近7日間の日別セッション数
    const dailyResult = await pool.query(
      `SELECT DATE(completed_at) AS date,
              SUM(sessions_completed) AS sessions,
              COUNT(*) FILTER (WHERE is_cycle_complete) AS cycles
       FROM session_logs
       WHERE user_id = $1
         AND completed_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(completed_at)
       ORDER BY date DESC`,
      [userId]
    );

    res.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      totalSessions: user.total_sessions,
      totalCycles: user.total_cycles,
      totalWorkMinutes: user.total_sessions * 25,
      lastActivityAt: user.last_activity_at,
      createdAt: user.created_at,
      dailyStats: dailyResult.rows,
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

export default router;
