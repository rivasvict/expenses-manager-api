#!/bin/bash

nvm use

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
npm run integration-test;
docker-compose down;
