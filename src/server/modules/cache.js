/*
 * TODO: Remove this after its call is configure somewere else
 *
    const cacheClient = new Redis({
      port: parseInt(config.REDIS_PORT),
      host: config.REDIS_SERVER
    });
    */

const addToSet = ({ cacheClient }) => ({ setName, members }) => cacheClient.sadd(setName, members);

const isMemberOfSet = ({ cacheClient }) => ({ setName, member }) => cacheClient.sismember(setName, member);

const removeMembersFromSet = ({ cacheClient }) => ({ setName, members }) => cacheClient.srem(setName, members);

const getAllMembersOfSet = ({ cacheClient }) => setName => cacheClient.smembers(setName);

module.exports = ({ cacheClient }) => {
  return {
    addToSet: addToSet({ cacheClient }),
    isMemberOfSet: isMemberOfSet({ cacheClient }),
    removeMembersFromSet: removeMembersFromSet({ cacheClient }),
    getAllMembersOfSet: getAllMembersOfSet({ cacheClient })
  };
};
