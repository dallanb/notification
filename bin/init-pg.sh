#!/bin/bash
set -e

psql "$POSTGRES_URL" << EOF
\c $POSTGRES_DATABASE;

CREATE TABLE IF NOT EXISTS subscription (
  id SERIAL PRIMARY KEY,
  ctime BIGINT,
  mtime BIGINT,
  uuid UUID NOT NULL,
  user_uuid UUID NOT NULL
);
EOF
