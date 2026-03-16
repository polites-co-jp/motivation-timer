-- ユーザテーブル
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    total_sessions INTEGER NOT NULL DEFAULT 0,
    total_cycles INTEGER NOT NULL DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);

-- セッション記録テーブル
CREATE TABLE session_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sessions_completed INTEGER NOT NULL,
    is_cycle_complete BOOLEAN NOT NULL DEFAULT FALSE,
    total_work_minutes INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_session_logs_user_id ON session_logs (user_id);
CREATE INDEX idx_session_logs_completed_at ON session_logs (completed_at);
