-- Minimal SQLite schema for MySchools (authentication + roles)
-- Use this in your SQLite editor. This matches your requirements: role only in profiles,
-- profiles.user_id is FK to users.id, and profiles.user_id is PRIMARY KEY (one-to-one).

-- USERS TABLE (authentication & identity)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PROFILES TABLE (authorization & roles)
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Example INSERT for admin (replace <BCRYPT_HASH_HERE> with the bcrypt hash you generate):
INSERT INTO users (id, email, password_hash, full_name)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  'admin@example.com',
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8rKz9rG1vQ6e7YqKq7B9pZ2P9qz7lK',
  'Admin User'
);

INSERT INTO profiles (user_id, role)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  'admin'
);

-- Notes:
-- 1) Do NOT add a `role` column to `users`.
-- 2) Always insert into `users` then `profiles` (or wrap in a transaction) to avoid orphans.
-- 3) To generate a bcrypt hash you can use `bcryptjs`:
--    npm install bcryptjs
--    node -e "console.log(require('bcryptjs').hashSync('MySecretPassword', 10))"
--    Then paste the printed hash in place of <BCRYPT_HASH_HERE> above.

-- Optional: Example transaction (if your SQLite client supports it):
-- BEGIN TRANSACTION;
-- (INSERT INTO users ...)
-- (INSERT INTO profiles ...)
-- COMMIT;
