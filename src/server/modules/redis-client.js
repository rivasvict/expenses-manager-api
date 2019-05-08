const Redis = require('ioredis');

const config = require('./../../../config.js');

class RedisClient {
  constructor() {
    this.redis = new Redis({
      port: parseInt(config.REDIS_PORT),
      host: config.REDIS_SERVER
    });
  }

  addToSet(setName, members) {
    return this.redis.sadd(setName, members);
  }

  isMemberOfSet(setName, member) {
    return this.redis.sismember(setName, member);
  }
}

module.exports = new RedisClient();
