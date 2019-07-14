const mock = require('mock-require');
const sinon = require('sinon');
const { expect } = require('chai');

mock('./cache.js', {});
const authenticationModule = require('./authentication.js');
const passportHandlers = require('./passportHandlers.js');
const config = require('../../../config.js');

describe('Authorization function', function () {
  beforeEach('Prepare global variables for test', function () {
    this.passportAuthenticateMock = sinon.fake(() => {});
    this.passportAuthenticateStub = sinon.stub(passportHandlers.passport, 'authenticate')
      .returns(this.passportAuthenticateMock);
    this.token = 'tokenTest';
    this.bearer = `bearer ${this.token}`;
    this.httpRequest = {
      req: {
        headers: {
          authorization: this.bearer
        }
      },
      res: {},
      next: () => {}
    };
  });

  afterEach('Restore tested involved function', function () {
    this.passportAuthenticateStub.restore();
    this.isTokenInBlackListStub.restore();
    sinon.restore();
  });

  it('isAuthorized: Should call passport.authenicate when no token is found on blacklist', async function () {
    this.isTokenInBlackListStub = sinon.stub(authenticationModule, 'isTokenInvalidated').returns(false);
    await passportHandlers
      .isAuthorized(this.httpRequest.req, this.httpRequest.res, this.httpRequest.next);
    expect(this.passportAuthenticateStub.calledWith('jwt', {
      session: false
    })).to.be.equal(true);
    expect(this.passportAuthenticateMock
      .calledWith(this.httpRequest.req, this.httpRequest.res, this.httpRequest.next)).to.be.equal(true);
  });

  it('isAuthorized:', async function () {
    this.isTokenInBlackListStub = sinon.stub(authenticationModule, 'isTokenInvalidated').returns(true);
    this.jsonFake = sinon.fake.returns(null);
    this.httpRequest.res = {
      status: sinon.fake.returns({
        json: this.jsonFake
      })
    };
    const authenticationMiddlewareWrapper = await passportHandlers
      .isAuthorized(this.httpRequest.req, this.httpRequest.res);
    expect(this.httpRequest.res.status.calledWith(403)).to.be.equal(true);
    expect(this.jsonFake.calledWith({ message: 'Session expired' })).to.be.equal(true);
    expect(this.httpRequest.res.status.calledOnce).to.be.equal(true);
    expect(this.jsonFake.calledOnce).to.be.equal(true);
  });
});
