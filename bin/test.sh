#!/bin/sh
# For use by jenkins test step
echo "Waiting for server..."

while [[ ! "$(docker ps -aq -f status=running -f health=healthy -f name=app)" ]]; do sleep 1; done

echo "Server ready"

docker exec app npm test
