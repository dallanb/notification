#!/bin/bash
set -e

mongo <<EOF
use $MONGO_ADMIN_USER_DB
db.createUser({
    user: '$MONGO_ADMIN_USER',
    pwd: '$MONGO_ADMIN_PWD',
    roles: [
        {
            role: '$MONGO_ADMIN_USER_ROLE',
            db: '$MONGO_ADMIN_USER_DB'
        }
    ]
})
use $MONGO_USER_DB
db.createUser({
    user: '$MONGO_USER',
    pwd: '$MONGO_PWD',
    roles: [
        {
            role: '$MONGO_USER_ROLE',
            db: '$MONGO_USER_DB'
        }
    ]
})
EOF
