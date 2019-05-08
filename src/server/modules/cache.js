class Cache {
  constructor({ cacheClient }) {
    this.cacheClient = cacheClient;
  }

  addToSet({ setName, members }) {
    return this.cacheClient.addToSet(setName, members);
  }

  isMemberOfSet({ setName, member }) {
    return this.cacheClient.isMemberOfSet(setName, member);
  }
}

module.exports = Cache;
