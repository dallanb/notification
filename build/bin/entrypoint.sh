#!/bin/sh

echo "Waiting for MongoDB..."

while ! nc -z $MONGO_HOST $MONGO_PORT; do
  sleep 0.1
done

echo "MongoDB started"

npm run devStart
