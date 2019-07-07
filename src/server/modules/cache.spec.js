const sinon = require('sinon');
const rewire = require('rewire');

const cacheModule = rewire('./cache.js');
const Cache = cacheModule.__get__('Cache');
const { expect } = require('chai');
// const CacheClient = cacheModule.__get__('Redis');

describe('Save set element', function () {
  beforeEach('Prepare cacheCLient for testing', async function () {
    this.membersToSet = ['memner1'];
    this.itIsMemberCodeNumber = 1;
    this.removedMemberOfSetCodeNumber = 1;
    function CacheClientStubClass() {}
    CacheClientStubClass.prototype.sadd = () => Promise.resolve(this.membersToSet.length);
    CacheClientStubClass.prototype.sismember = () => Promise.resolve(this.itIsMemberCodeNumber);
    CacheClientStubClass.prototype.srem = () => Promise.resolve(this.removedMemberOfSetCodeNumber);

    this.saddStub = sinon.spy(CacheClientStubClass.prototype, 'sadd');
    this.sismemberStub = sinon.spy(CacheClientStubClass.prototype, 'sismember');
    this.sremStub = sinon.spy(CacheClientStubClass.prototype, 'srem');

    this.restoreCacheClient = cacheModule.__set__('Redis', CacheClientStubClass);
    this.cache = new Cache();
  });

  it('It should persist into set successfully', async function () {
    try {
      const addToSetOptions = {
        setName: 'testSet',
        members: this.membersToSet
      };
      const addToSetResult = await this.cache.addToSet(addToSetOptions);
      expect(addToSetResult).to.be.equal(this.membersToSet.length);
      expect(this.saddStub.calledWith(addToSetOptions.setName, addToSetOptions.members)).to.be
        .equal(true);
    } catch (error) {
      throw error;
    }
  });

  it('Should return true when a member of a set exist', async function () {
    try {
      const isMemberOfSetOptions = {
        setName: 'testSet',
        member: 'is this member part of the set?'
      };
      const isMemberOfSetResult = await this.cache.isMemberOfSet(isMemberOfSetOptions);
      expect(isMemberOfSetResult).to.be.equal(this.itIsMemberCodeNumber);
      expect(this.sismemberStub.calledWith(isMemberOfSetOptions.setName, isMemberOfSetOptions.member))
        .to.be.equal(true);
    } catch (error) {
      throw error;
    }
  });

  it('Should remove a set member', async function () {
    try {
      const removeMemberOfSetOptions = {
        setName: 'testSet',
        member: 'Member remove from the set'
      };
      const removeMemberOfSetResult = await this.cache.removeMemberFromSet(removeMemberOfSetOptions);
      expect(removeMemberOfSetResult).to.be.equal(this.removedMemberOfSetCodeNumber);
      expect(this.sremStub.calledWith(removeMemberOfSetOptions.setName, removeMemberOfSetOptions.member))
        .to.be.equal(true);
    } catch (error) {
      throw error;
    }
  });

  afterEach('Restore Cache', function () {
    this.restoreCacheClient();
  });
});
