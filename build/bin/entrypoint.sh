#!/bin/sh

if [ "$DATABASE" = "notification" ]; then
  echo "Waiting for notification..."

  while ! nc -z $SQL_HOST $SQL_PORT; do
    sleep 0.1
  done

  echo "PostgreSQL started"
fi

bash bin/init-pg.sh

npm run devStart
