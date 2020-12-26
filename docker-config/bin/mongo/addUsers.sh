MONGO_CONTAINER_ID=$(docker-compose ps -q mongo)
docker exec -id ${MONGO_CONTAINER_ID} bash /config/dbs/configDbs.sh
