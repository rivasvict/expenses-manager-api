const sinon = require('sinon');
const { expect } = require('chai');
const _ = require('lodash');
const mock = require('mock-require');

const config = require('../../../config.js');
const ioredisMock = function () {};
ioredisMock.prototype.sismember = () => {};
ioredisMock.prototype.sadd = () => {};
ioredisMock.prototype.srem = () => {};
mock('ioredis', ioredisMock);

const cacheMock = {};
mock('./cache.js', cacheMock);

mock.reRequire('./cache.js');

const userModule = require('./user.js');
const authentication = require('./authentication.js');

describe('Authentication module', function () {
  describe('Authenticate regular user', function () {
    beforeEach('Prepare stubs', function () {
      this.setStub = this.setStub || function (stub) {
        this.stub = stub;
      };
      this.username = 'test@test.com';
      this.password = 'password';
      this.userToAuthenticate = {
        firstname: 'test',
        email: this.username,
        lastname: 'test',
        toJSON: () => _.omit(this.userToAuthenticate, ['toJSON'])
      };
    });

    it('Should return user valid user token when correct credentials', async function () {
      this.setStub(sinon.stub(userModule, 'authenticateUser')
        .returns(Promise.resolve(this.userToAuthenticate)));
      const verifiedUserToken = await authentication
        .verifyAuthenticUser(this.username, this.password);
      const decodedUserToken = authentication.verifyToken(verifiedUserToken);
      expect(decodedUserToken).to.have.property('firstname');
      expect(decodedUserToken).to.have.property('lastname');
      expect(decodedUserToken).to.have.property('email');
      expect(decodedUserToken).to.have.property('exp');
      expect(decodedUserToken).to.have.property('iat');
      const expirationTimeLength = decodedUserToken.exp - decodedUserToken.iat;
      expect(expirationTimeLength).to.be.equal(7200);
    });

    it('Should return null when non authentic user', async function () {
      this.setStub(sinon.stub(userModule, 'authenticateUser')
        .returns(Promise.resolve(null)));
      const verifiedUserToken = await authentication
        .verifyAuthenticUser(this.username, this.password);
      expect(verifiedUserToken).to.deep.equal(null);
    });

    afterEach('Restore stubs', function () {
      if (this.stub && this.stub.restore) {
        this.stub.restore();
      }
    });
  });

  describe('Token usage', function () {
    it('Should authentication.getToken', function () {
      const loggedUser = {
        firstname: 'test',
        email: 'test@test.com',
        lastname: 'test'
      };
      const token = authentication.getToken({ payload: loggedUser, tokenGenerationOptions: { expiresIn: '1s' } });
      expect(token).to.not.equal(undefined);
    });

    describe('Verify token', function () {
      beforeEach('Prepate loggedUser', function () {
        this.loggedUser = {
          firstname: 'test',
          email: 'test@test.com',
          lastname: 'test'
        };
      });

      it('Should verify correct token with no expiration time', function () {
        const token = authentication.getToken({ payload: this.loggedUser });
        const decodedToken = authentication.verifyToken(token);
        expect(decodedToken).to.have.property('firstname');
        expect(decodedToken).to.have.property('lastname');
        expect(decodedToken).to.have.property('email');
      });

      it('Should throw error when token is invalid', function () {
        const token = `${authentication.getToken({ payload: this.loggedUser })}123`;
        try {
          authentication.verifyToken(token);
        } catch (error) {
          expect(error.message).to.be.equal('invalid signature');
        }
      });

      it('Should should verify token under expiration time', function () {
        this.timeout(5000);
        const token = authentication.getToken({
          payload: this.loggedUser,
          tokenGenerationOptions: {
            expiresIn: '4s'
          }
        });
        setTimeout(function () {
          const decodedToken = authentication.verifyToken(token);
          expect(decodedToken).to.have.property('firstname');
          expect(decodedToken).to.have.property('lastname');
          expect(decodedToken).to.have.property('email');
        }, 3000);
      });

      it('Should should throw an error when verify token is out of expiration time', function () {
        this.timeout(5000);
        const token = authentication.getToken({
          payload: this.loggedUser,
          tokenGenerationOptions: {
            expiresIn: '1s'
          }
        });
        setTimeout(function () {
          try {
            authentication.verifyToken(token);
          } catch (error) {
            expect(error.name).to.be.equal('TokenExpiredError');
          }
        }, 3000);
      });
    });
  });

  describe('passportVerify: Verify user for passportJs strategy', function () {
    beforeEach('Prepare stubs', function () {
      this.setStub = this.setStub || function (stub) {
        this.stub = stub;
      };
      this.username = 'test@test.com';
      this.password = 'password';
      this.userToAuthenticate = {
        firstname: 'test',
        email: this.username,
        lastname: 'test'
      };
    });

    it('Should successfully verify the user', async function () {
      const done = sinon.fake();
      const jwtPayload = {
        username: this.username,
        password: this.password
      };
      await authentication.passportVerify(jwtPayload, done);
      expect(done.callCount).to.be.equal(1);
      expect(done.calledOnceWith(null, jwtPayload)).to.be.equal(true);
    });

    it('Should call done with false when non authentic user', async function () {
      const done = sinon.fake();
      await authentication.passportVerify(null, done);
      expect(done.callCount).to.be.equal(1);
      expect(done.calledOnceWith(null, false)).to.be.equal(true);
    });

    afterEach('Restore stubs', function () {
      if (this.stub && this.stub.restore) {
        this.stub.restore();
      }
    });
  });

  describe('isTokenInvalidated: Token invalidation check through blacklist', function () {
    beforeEach('Preconfigure tests', function () {
      this.invalidToken = 'Bearer invalidToken';
      this.rawToken = 'invalidToken';
    });

    it('Should return true when token is blacklisted', async function () {
      const isMemberOfSetStub = sinon.fake.returns(Promise.resolve(1));
      cacheMock.isMemberOfSet = isMemberOfSetStub;
      const isTokenInvalidated = await authentication
        .isTokenInvalidated(this.invalidToken);
      expect(isTokenInvalidated).to.be.equal(true);
      expect(isMemberOfSetStub.calledOnce).to.be.equal(true);
      expect(isMemberOfSetStub.calledWith({
        setName: config.sets.INVALID_USER_TOKEN_SET, member: this.rawToken
      })).to.be.equal(true);
    });

    it('Should return false when token is NOT blacklisted', async function () {
      const isMemberOfSetStub = sinon.fake.returns(Promise.resolve(0));
      cacheMock.isMemberOfSet = isMemberOfSetStub;
      const isTokenInvalidated = await authentication
        .isTokenInvalidated('Bearer invalidToken');
      expect(isTokenInvalidated).to.be.equal(false);
      expect(isMemberOfSetStub.calledOnce).to.be.equal(true);
      expect(isMemberOfSetStub.calledWith({
        setName: config.sets.INVALID_USER_TOKEN_SET, member: this.rawToken
      })).to.be.equal(true);
    });

    it('Should remove all invalid tokens from black list', async function () {
      const expiredTokens = [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwibGFzdG5hbWUiOiJ0ZXN0IiwiaWF0IjoxNTYyODA5OTgyLCJleHAiOjE1NjI4MDk5ODN9.zC0eXfTg9ucM69qZM92kDZOIZPgZqQOlYw8gnCwFC2M',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWxpZCI6InllcyIsImlhdCI6MTU2MjgxMDIwMiwiZXhwIjoxNTYyODEwMjAzfQ.qQGKW_CTlOR3KJa4X7-2169tnd5BBh3AdfYrk61AJrg'
      ];
      const validTokens = [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWxpZCI6InllcyIsImlhdCI6MTU2MjgxMDIzNX0.298Bilrm42xwU03x8gPyg3MGrnPPP0w-OrnP_9LRqtM',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWxpZCI6ImJsO2Fhc2RuIiwiaWF0IjoxNTYyODEwMjcwfQ.Bo6V9_Cgg8_OWZ-TAD3bEthQUFXgEQrunw_4t0cec2s'
      ];
      const blacklistedTokens = [...expiredTokens, ...validTokens];
      const removeMembersFromSetFake = sinon.fake.returns(Promise.resolve(2));
      const getAllMembersOfSetFake = sinon.fake.returns(Promise.resolve(blacklistedTokens));
      cacheMock.removeMembersFromSet = removeMembersFromSetFake;
      cacheMock.getAllMembersOfSet = getAllMembersOfSetFake;
      await authentication
        .removeInvalidTokensFromBlackList(blacklistedTokens);
      expect(removeMembersFromSetFake.calledOnce).to.be.equal(true);
      expect(removeMembersFromSetFake.calledWith(expiredTokens)).to.be.equal(true);
    });
  });
});
