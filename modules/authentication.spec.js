const sinon = require('sinon');
const { expect } = require('chai');

const userModule = require('./user.js');
const { verifyLocal } = require('./authentication.js');

describe('Authentication module', function () {
  describe.only('Authenticate regular user', function () {
    beforeEach('Prepare stubs', function () {
      this.setStub = this.setStub || function (stub) {
        this.stub = stub;
      };
    });

    it('Should successfully verify the user', async function () {
      const username = 'test@test.com';
      const password = 'password';
      const loggedUser = {
        firstname: 'test',
        email: username,
        lastname: 'test'
      };
      this.setStub(sinon.stub(userModule, 'authenticateUser')
        .returns(Promise.resolve(loggedUser)));
      const done = sinon.fake();
      await verifyLocal(username, password, done);
      expect(done.callCount).to.be.equal(1);
      expect(done.calledOnceWith(null, loggedUser)).to.be.equal(true);
    });

    afterEach('Restore stubs', function () {
      if (this.stub && this.stub.restore) {
        this.stub.restore();
      }
    });
  });
});
