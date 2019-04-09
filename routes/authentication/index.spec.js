const expect = require('chai').expect;
const rewire = require('rewire');
const sinon = require('sinon');

const loginRouter = rewire('./index.js');
const loginRouteHandler = loginRouter.__get__('loginRouteHandler');
const authenticationModule = require('../../modules/authentication.js');

describe('Authentication routes', function () {
  beforeEach('Initialize spies for authentication', function () {
    this.initializeSpiesForAuthentication = (user) => {
      this.rec = {
        body: user
      };
      this.res = {
        status: () => this.res,
        json: sinon.spy()
      };
      sinon.spy(this.res, 'status');
    };
  });

  describe('loginRouteHandler tests', function () {
    beforeEach('Prepare user to authenticate', function () {
      this.userToAuthenticate = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'victor@gmail.com',
        password: 'password'
      };
      
      this.initializeSpiesForAuthentication(this.userToAuthenticate);
    });

    it('loginRouteHandler: Should successfully respond to client when correct credentials passed on body', async function () {
      const userToken = authenticationModule.getToken({ payload: this.userToAuthenticate });
      const verifyUserStub = sinon.stub(authenticationModule, 'verifyAuthenticUser').returns(Promise.resolve(userToken));
      await loginRouteHandler(this.rec, this.res);
      expect(this.res.status.calledWith(200)).to.be.equal(true);
      expect(this.res.json.calledWith({ userToken })).to.be.equal(true);
      expect(this.res.status.callCount).to.be.equal(1);
      expect(this.res.json.callCount).to.be.equal(1);

      verifyUserStub.restore();
    });

    it('loginRouteHandler: Should respond with error to client when correct credentials passed on body', async function () {
      const verifyUserStub = sinon.stub(authenticationModule, 'verifyAuthenticUser').returns(Promise.resolve(null));
      await loginRouteHandler(this.rec, this.res);
      expect(this.res.status.calledWith(403)).to.be.equal(true);
      expect(this.res.json.calledWith({ message: 'Invalid credentials' })).to.be.equal(true);
      expect(this.res.status.callCount).to.be.equal(1);
      expect(this.res.json.callCount).to.be.equal(1);

      verifyUserStub.restore();
    });

  });

  afterEach('Restore spies', function () {
    sinon.restore();
  });
});
