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

while ! nc -z $ZOOKEEPER_HOST $ZOOKEEPER_PORT; do
  sleep 0.1
done
echo "Kafka started"

bash bin/init-pg.sh

npm run devStart
