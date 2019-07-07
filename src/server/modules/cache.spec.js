const sinon = require('sinon');
const rewire = require('rewire');

const cacheModule = rewire('./cache.js');
const Cache = cacheModule.__get__('Cache');
// const CacheClient = cacheModule.__get__('Redis');

describe('Save set element', function () {
  beforeEach('Prepare cacheCLient for testing', async function () {
    function CacheClientStubClass() {}
    CacheClientStubClass.prototype.sadd = () => Promise.resolve(3);
    CacheClientStubClass.prototype.sismember = () => Promise.resolve(1);

    this.saddStub = sinon.spy(CacheClientStubClass.prototype, 'sadd');
    this.sismemberStub = sinon.spy(CacheClientStubClass.prototype, 'sismember');

    this.restoreCacheClient = cacheModule.__set__('Redis', CacheClientStubClass);
    this.cache = new Cache();
  });

  it.only('Should return success when there is no existing element in the set of the same value', async function () {
    try {
      await this.cache.addToSet({ setName: 'testSet', members: ['memner1'] });
    } catch (error) {
      throw error;
    }
  });

  it.skip('Should return an error and do not persist if element of a set already exists');

  afterEach('Restore Cache', function () {
    this.restoreCacheClient();
  });
});
