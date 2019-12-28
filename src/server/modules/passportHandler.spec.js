const sinon = require('sinon');
const { expect } = require('chai');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const PassportHandlers = require('./passportHandlers.js');
const config = require('../../../config.js');
const constants = require('./../constants');

describe('Authorization function', function () {
  beforeEach('Prepare global variables for test', function () {
    this.setPassportHandlerDependencies = ({ isTokenInvalidatedMockedResult }) => {
      const authenticationModule = {
        passportVerify: () => {},
        isTokenInvalidated: sinon.fake.returns(isTokenInvalidatedMockedResult)
      };
      this.passportAuthenticateCallbackStub = sinon.fake(() => {});
      this.passportStub = {
        authenticate: sinon.fake.returns(this.passportAuthenticateCallbackStub),
        use: sinon.fake(() => {})
      };
      this.passportHandlers = PassportHandlers({
        ExtractJwt, config, JwtStrategy, authenticationModule, constants, passport: this.passportStub
      });
    };
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
    sinon.restore();
  });

  it('isAuthorized: Should call passport.authenicate when no token is found on blacklist', async function () {
    this.setPassportHandlerDependencies({ isTokenInvalidatedMockedResult: false });
    await this.passportHandlers
      .isAuthorized(this.httpRequest.req, this.httpRequest.res, this.httpRequest.next);
    expect(this.passportStub.authenticate.calledWith('jwt', {
      session: false
    })).to.be.equal(true);
    expect(this.passportAuthenticateCallbackStub
      .calledWith(this.httpRequest.req, this.httpRequest.res, this.httpRequest.next)).to.be.equal(true);
  });

  it('isAuthorized:', async function () {
    this.setPassportHandlerDependencies({ isTokenInvalidatedMockedResult: true });
    this.jsonFake = sinon.fake.returns(null);
    this.httpRequest.res = {
      status: sinon.fake.returns({
        json: this.jsonFake
      })
    };
    const authenticationMiddlewareWrapper = await this.passportHandlers
      .isAuthorized(this.httpRequest.req, this.httpRequest.res);
    expect(this.httpRequest.res.status.calledWith(403)).to.be.equal(true);
    expect(this.jsonFake.calledWith({ message: 'Session expired' })).to.be.equal(true);
    expect(this.httpRequest.res.status.calledOnce).to.be.equal(true);
    expect(this.jsonFake.calledOnce).to.be.equal(true);
  });
});
