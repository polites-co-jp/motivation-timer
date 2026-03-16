import { Router } from "express";
import crypto from "node:crypto";
import pool from "../db.js";

const router = Router();

// ユーザ登録
router.post("/register", async (req, res) => {
  const { email, displayName, password } = req.body;

  if (!email || !displayName || !password) {
    res.status(400).json({ error: "email, displayName, password は必須です" });
    return;
  }

  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    const passwordHash = `${salt}:${hash}`;

    const result = await pool.query(
      `INSERT INTO users (email, display_name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, display_name, created_at`,
      [email, displayName, passwordHash]
    );

    const user = result.rows[0];
    res.status(201).json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      createdAt: user.created_at,
    });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      res.status(409).json({ error: "このメールアドレスは既に登録されています" });
      return;
    }
    console.error("Registration error:", err);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

// ログイン
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "email, password は必須です" });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, email, display_name, password_hash, created_at FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: "メールアドレスまたはパスワードが正しくありません" });
      return;
    }

    const user = result.rows[0];
    const [salt, storedHash] = user.password_hash.split(":");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");

    if (hash !== storedHash) {
      res.status(401).json({ error: "メールアドレスまたはパスワードが正しくありません" });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      createdAt: user.created_at,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

export default router;
