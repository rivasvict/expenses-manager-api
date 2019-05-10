const sinon = require('sinon');
const Redis = require('ioredis');
const Cache = require('./cache.js');

describe('Save set element', function () {
  beforeEach('Prepare cacheCLient for testing', async function () {
    const testSet = new Set();
    testSet.add('one');
    testSet.add('three');
    const sadd = async (setName, members) => {
      const initialSizeOfSet = testSet.size;
      members.forEach((member) => {
        testSet.add(member);
      });

      if (testSet.size !== (initialSizeOfSet + members.length)) {
        throw new Error();
      } else if (testSet.size === (initialSizeOfSet + members.length)) {
        return 'Success';
      }
    };
    this.cacheClientConstructorStub = await sinon.createStubInstance(Redis, {
      //TODO: Make sure to makke these two functions work as
      //they would do in Redis with the testSet previously created
      sadd: sinon.stub().returns(Promise.resolve('Success')),
      sismember: sinon.stub().returns(Promise.resolve('Success'))
    });
    this.cache = sinon.createStubInstance(Cache);
    this.cache.cacheClient = this.cacheClientConstructorStub;
  });

  it.only('Should return success when there is no existing element in the set of the same value', function () {
    try {
    } catch (error) {
      throw error;
    }
  });

  it.skip('Should return an error and do not persist if element of a set already exists');
});
