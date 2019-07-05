const sinon = require('sinon');
const rewire = require('rewire');

const cacheModule = rewire('./cache.js');
const Cache = cacheModule.__get__('Cache');

describe('Save set element', function () {
  beforeEach('Prepare cacheCLient for testing', async function () {
    class CacheClient {
      constructor() {
        this.saddStub = () => {
          const numberOfMembersCreated = 3;
          sinon.stub().returns(Promise.resolve(numberOfMembersCreated));
        };
        this.sismemberStub = () => {
          const memberDoesExist = 1;
          sinon.stub().returns(Promise.resolve(memberDoesExist));
        };
      }

      sadd() {
        this.saddStub();
      }

      sismember() {
        this.sismemberStub();
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
