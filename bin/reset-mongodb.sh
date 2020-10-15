#!/bin/bash
set -e

mongo <<EOF
use $MONGO_USER_DB
db.dropDatabase();
EOF
