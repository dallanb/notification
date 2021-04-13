#!/bin/sh

if [ "$DATABASE" = "app" ]; then
  echo "Waiting for app..."

  while ! nc -z $SQL_HOST $SQL_PORT; do
    sleep 0.1
  done

  echo "PostgreSQL started"
fi

if [ "$MONGO_DATABASE" = "app" ]; then
  echo "Waiting for app..."

  while ! nc -z $MONGO_HOST $MONGO_PORT; do
    sleep 0.1
  done

  echo "MongoDB started"
fi

while ! nc -z $ZOOKEEPER_HOST $ZOOKEEPER_PORT; do
  sleep 0.1
done
echo "Kafka started"

while ! nc -z $RABBITMQ_HOST $RABBITMQ_PORT; do
  sleep 0.1
done
echo "RabbitMQ started"

db-migrate up -e pg

pm2-runtime dist/index.js

