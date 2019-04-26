const config = require('./../../../config.js');
const Redis = require('ioredis');

const redisClient = new Redis({
  port: parseInt(config.REDIS_PORT),
  host: config.REDIS_SERVER
});
