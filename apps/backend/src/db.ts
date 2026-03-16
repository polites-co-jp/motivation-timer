import pg from "pg";

const pool = new pg.Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "motivation_timer",
  user: process.env.DB_USER || "mt_user",
  password: process.env.DB_PASSWORD || "mt_password",
});

export default pool;
