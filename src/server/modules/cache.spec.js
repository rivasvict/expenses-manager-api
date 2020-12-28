const sinon = require('sinon');
const { expect } = require('chai');

const Cache = require('./cache');

describe('Cache CRD operations', function () {
  before('Prepare mock for Cache', function () {
    this.membersToSet = ['memner1'];
    this.itIsMemberCodeNumber = 1;
    this.removedMembersOfSetCodeNumber = 1;
    this.allMembersOfSet = ['3', '435', 54];

    this.saddStub = sinon.fake.returns(Promise.resolve(this.membersToSet.length));
    this.sismemberStub = sinon.fake.returns(Promise.resolve(this.itIsMemberCodeNumber));
    this.sremStub = sinon.fake.returns(Promise.resolve(this.removedMembersOfSetCodeNumber));
    this.smembersStub = sinon.fake.returns(Promise.resolve(this.allMembersOfSet));
    this.cache = Cache({
      cacheClient: {
        sadd: this.saddStub,
        sismember: this.sismemberStub,
        srem: this.sremStub,
        smembers: this.smembersStub
      }
    });
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
      const removeMembersOfSetOptions = {
        setName: 'testSet',
        members: ['Member remove from the set', 'second member to remove']
      };
      const removeMembersOfSetResult = await this.cache.removeMembersFromSet(removeMembersOfSetOptions);
      expect(removeMembersOfSetResult).to.be.equal(this.removedMembersOfSetCodeNumber);
      expect(this.sremStub.calledWith(removeMembersOfSetOptions.setName, removeMembersOfSetOptions.members))
        .to.be.equal(true);
    } catch (error) {
      throw error;
    }
  });

  it('Should return all members of set', async function () {
    try {
      const setName = 'myset';
      const removedNumberOfElements = await this.cache.getAllMembersOfSet(setName);
      expect(removedNumberOfElements.length).to.be.equal(this.allMembersOfSet.length);
      expect(removedNumberOfElements).to.be.equal(this.allMembersOfSet);
      expect(this.smembersStub.calledOnce).to.be.equal(true);
      expect(this.smembersStub.calledWith(setName)).to.be.equal(true);
    } catch (error) {
      throw error;
    }
  });

  afterEach('Restore Cache', function () {
    sinon.restore();
  });
});
