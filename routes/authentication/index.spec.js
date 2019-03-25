const expect = require('chai').expect;
const rewire = require('rewire');
const sinon = require('sinon');

const loginRouter = rewire('./index.js');
const loginRouteHandler = loginRouter.__get__('loginRouteHandler');
const authenticationModule = require('../../modules/authentication.js');

describe('Authentication routes', function () {
  beforeEach('Prepare user to authenticate', function () {
    this.userToAuthenticate = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'victor@gmail.com',
      password: 'password'
    };

    this.rec = {
      body: this.userToAuthenticate
    };
    this.res = {
      sendStatus: function () {
        return this;
      },
      json: sinon.spy()
    };
    sinon.spy(this.res, 'sendStatus');
  });

  it('loginRouteHandler: Should successfully respond to client when correct credentials passed on body', async function () {
    const userToken = authenticationModule.getToken({ payload: this.userToAuthenticate });
    /*
      * TODO: verifyAuthenticUser needs to be properly stubbed (it is not working right now)
      */
    const verifyUserStub = sinon.stub(authenticationModule, 'verifyAuthenticUser').returns(Promise.resolve(userToken));
    await loginRouteHandler(this.rec, this.res);
    expect(this.res.sendStatus.calledWith(200)).to.be.equal.true;

    verifyUserStub.restore();
  });

  it('loginRouteHandler: Should respond with error to client when correct credentials passed on body');
});
