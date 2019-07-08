const Redis = require('ioredis');

const config = require('./../../../config.js');

const cacheClient = new Redis({
  port: parseInt(config.REDIS_PORT),
  host: config.REDIS_SERVER
});

const addToSet = ({ setName, members }) => cacheClient.sadd(setName, members);

const isMemberOfSet = ({ setName, member }) => cacheClient.sismember(setName, member);

const removeMemberFromSet = ({ setName, member }) => cacheClient.srem(setName, member);

module.exports = {addToSet, isMemberOfSet, removeMemberFromSet};
