const Redis = require('ioredis');

const config = require('./../../../config.js');

class Cache {
  constructor() {
    this.cacheClient = new Redis({
      port: parseInt(config.REDIS_PORT),
      host: config.REDIS_SERVER
    });
    debugger;
  }

  addToSet({ setName, members }) {
    return this.cacheClient.sadd(setName, members);
  }

  isMemberOfSet({ setName, member }) {
    return this.cacheClient.sismember(setName, member);
  }
}

module.exports = Cache;
