#!/bin/bash
set -e

mongo -u $MONGO_USER -p $MONGO_PWD $MONGO_USER_DB  <<EOF
db.dropDatabase();
EOF
