#!/bin/sh


if [ "$DATABASE" = "notification" ]; then
  echo "Waiting for notification..."

  while ! nc -z $SQL_HOST $SQL_PORT; do
    sleep 0.1
  done

  echo "PostgreSQL started"
fi

if [ "$MONGO_DATABASE" = "notification" ]; then
  echo "Waiting for notification..."

  while ! nc -z $MONGO_HOST $MONGO_PORT; do
    sleep 0.1
  done

  echo "MongoDB started"
fi

bash bin/init-pg.sh # need to do something about this!

pm2-runtime dist/index.js
