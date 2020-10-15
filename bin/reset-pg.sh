#!/bin/bash

set -e

psql "$POSTGRES_URL" <<EOF
\c $POSTGRES_DATABASE;

TRUNCATE subscription;
EOF
