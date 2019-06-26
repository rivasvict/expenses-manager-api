const sinon = require('sinon');
const rewire = require('rewire');

const cacheModule = rewire('./cache.js');
const Cache = cacheModule.__get__('Cache');
const Redis = cacheModule.__get__('Redis');

describe('Save set element', function () {
  beforeEach('Prepare cacheCLient for testing', async function () {
    class CacheClient {
      sadd() {
        sinon.stub().returns(Promise.resolve('Success'));
      }

      sismember() {
        sinon.stub().returns(Promise.resolve('Success'));
      }
    }

    this.restoreCacheClient = cacheModule.__set__('Redis', CacheClient);
    this.cache = new Cache();
  });

  it.only('Should return success when there is no existing element in the set of the same value', function () {
    try {
      this.cache.addToSet({setName: 'testSet', members: ['memner1']});
    } catch (error) {
      throw error;
    }
  });

  it.skip('Should return an error and do not persist if element of a set already exists');

  afterEach('Restore Cache', function () {
    this.restoreCacheClient();
  });
});
