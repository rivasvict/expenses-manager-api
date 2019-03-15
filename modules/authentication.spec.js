const sinon = require('sinon');
const { expect } = require('chai');

const { verifyLocal } = require('./authentication.js');
const userModule = require('./user.js');

describe('Authentication module', function () {
  describe.only('Authenticate regular user', function () {
    beforeEach('Prepare stubs', function () {
      this.validateCredentialsStub = sinon.stub(userModule, 'validateCredentials')
        .returns(Promise.resolve(true));
    });

    it('Should successfully verify the user', async function () {
      const username = 'test@test.com';
      const password = 'password';
      const done = sinon.fake();
      const loggedUser = {
        firstname: 'test',
        email: username,
        lastname: 'test'
      };
      await verifyLocal(username, password, done);
      expect(done.callCount).to.be.equal(1);
      expect(done.calledOnceWith(null, loggedUser)).to.be.equal(true);
    });

    afterEach('Restore stubs', function () {
      this.validateCredentialsStub.restore();
    });
  });
});
