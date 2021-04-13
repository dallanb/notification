CREATE TABLE IF NOT EXISTS subscription (
  id SERIAL PRIMARY KEY,
  ctime BIGINT,
  mtime BIGINT,
  uuid UUID NOT NULL,
  user_uuid UUID NOT NULL
);
