import { Router } from "express";
import pool from "../db.js";

const router = Router();

// セッション記録を保存
router.post("/", async (req, res) => {
  const { userId, sessionsCompleted, isCycleComplete, totalWorkMinutes } =
    req.body;

  if (!userId || sessionsCompleted == null) {
    res.status(400).json({ error: "userId, sessionsCompleted は必須です" });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO session_logs (user_id, sessions_completed, is_cycle_complete, total_work_minutes)
       VALUES ($1, $2, $3, $4)
       RETURNING id, completed_at`,
      [userId, sessionsCompleted, isCycleComplete ?? false, totalWorkMinutes ?? 0]
    );

    // stats を更新
    await pool.query(
      `UPDATE users
       SET total_sessions = total_sessions + $1,
           total_cycles = total_cycles + $2,
           last_activity_at = NOW()
       WHERE id = $3`,
      [
        sessionsCompleted,
        isCycleComplete ? 1 : 0,
        userId,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Session log error:", err);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

// ユーザのセッション履歴を取得
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const limit = Number(req.query.limit) || 20;
  const offset = Number(req.query.offset) || 0;

  try {
    const result = await pool.query(
      `SELECT id, sessions_completed, is_cycle_complete, total_work_minutes, completed_at
       FROM session_logs
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Session fetch error:", err);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

export default router;
