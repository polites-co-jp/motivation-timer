import express from "express";
import cors from "cors";
import pool from "./db.js";
import authRouter from "./routes/auth.js";
import sessionsRouter from "./routes/sessions.js";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch {
    res.status(503).json({ status: "error", db: "disconnected" });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
