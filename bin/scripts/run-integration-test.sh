#!/bin/bash

docker-compose up -d;
MONGO_CONTAINER_ID=''
while [[ $MONGO_CONTAINER_ID == '' ]]; do
  MONGO_CONTAINER_ID=`docker-compose ps -q mongo`
  echo "Waiting for container id"
done
until docker exec -itd $MONGO_CONTAINER_ID grep -q 'waiting for connections on port' /var/log/mongodb.log; do
  echo "Waiting for container to be up"
  sleep 0.1
done
INTEGRATION_TEST=true DEBUG=true node_modules/mocha/bin/mocha "$1" "$2" ./test/integration/**/*.spec.js ./test/integration/**/**/*.spec.js
docker-compose down;
