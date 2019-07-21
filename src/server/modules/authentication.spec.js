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

const cacheMock = {
  isMemberOfSet: () => {},
  addToSet: () => {},
  removeMembersFromSet: () => {},
  getAllMembersOfSet: () => {}
};
mock('./cache.js', cacheMock);
mock.reRequire('./cache.js');
mock.reRequire('./authentication.js');

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
        sinon.spy(authentication, 'verifyToken');
      });

      afterEach('Restore spy', function () {
        sinon.restore();
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
        const token = authentication.getToken({
          payload: this.loggedUser,
          tokenGenerationOptions: {
            expiresIn: '4s'
          }
        });
        const decodedToken = authentication.verifyToken(token);
        expect(decodedToken).to.have.property('firstname');
        expect(decodedToken).to.have.property('lastname');
        expect(decodedToken).to.have.property('email');
      });

      it('Should should throw an error when verify token is out of expiration time', function () {
        const token = authentication.getToken({
          payload: this.loggedUser,
          tokenGenerationOptions: {
            expiresIn: '-1s'
          }
        });

        const decodedToken = authentication.verifyToken(token);
        expect(decodedToken).to.be.equal(null);
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

    after('Stop mock', function () {
      mock.stopAll();
    });

    it('Should return true when token is blacklisted', async function () {
      const isMemberOfSetStub = sinon.stub(cacheMock, 'isMemberOfSet').returns(Promise.resolve(1));
      const isTokenInvalidated = await authentication
        .isTokenInvalidated(this.invalidToken);
      expect(isTokenInvalidated).to.be.equal(true);
      expect(isMemberOfSetStub.calledOnce).to.be.equal(true);
      expect(isMemberOfSetStub.calledWith({
        setName: config.sets.INVALID_USER_TOKEN_SET, member: this.rawToken
      })).to.be.equal(true);
      isMemberOfSetStub.restore();
    });

    it('Should return false when token is NOT blacklisted', async function () {
      const isMemberOfSetStub = sinon.stub(cacheMock, 'isMemberOfSet').returns(Promise.resolve(0));
      const isTokenInvalidated = await authentication
        .isTokenInvalidated('Bearer invalidToken');
      expect(isTokenInvalidated).to.be.equal(false);
      expect(isMemberOfSetStub.calledOnce).to.be.equal(true);
      expect(isMemberOfSetStub.calledWith({
        setName: config.sets.INVALID_USER_TOKEN_SET, member: this.rawToken
      })).to.be.equal(true);
      isMemberOfSetStub.restore();
    });

    it('Should remove all invalid tokens from black list', async function () {
      const expiredTokens = [
        authentication.getToken({
          payload: { user: 'test1' },
          tokenGenerationOptions: {
            expiresIn: '-120s'
          }
        }),
        authentication.getToken({
          payload: { user: 'test2' },
          tokenGenerationOptions: {
            expiresIn: '-120s'
          }
        })
      ];
      const validTokens = [
        authentication.getToken({ payload: { user: 'test3' } }),
        authentication.getToken({ payload: { user: 'test4' } })
      ];

      try {
        const blacklistedTokens = [...expiredTokens, ...validTokens];
        const removeMembersFromSetStub = sinon.stub(cacheMock, 'removeMembersFromSet')
          .returns(Promise.resolve(2));
        const getAllMembersOfSetStub = sinon.stub(cacheMock, 'getAllMembersOfSet')
          .returns(Promise.resolve(blacklistedTokens));
        await authentication
          .removeInvalidTokensFromBlackList();
        expect(removeMembersFromSetStub.calledOnce).to.be.equal(true);
        expect(removeMembersFromSetStub.calledWith(expiredTokens)).to.be.equal(true);
        removeMembersFromSetStub.restore();
        getAllMembersOfSetStub.restore();
      } catch (error) {
        throw error;
      }
    });

    it('invalidateToken should call add to set on cache with token to invalidate', async function () {
      const addToSetStub = sinon.stub(cacheMock, 'addToSet').returns(Promise.resolve(1));
      const tokenToInvalidate = 'thisIsAnInvalidToken';
      const bearer = `Bearer ${tokenToInvalidate}`;
      await authentication
        .invalidateToken(bearer);
      expect(addToSetStub.calledOnce).to.be.equal(true);
      expect(addToSetStub.calledWith({
        setName: config.sets.INVALID_USER_TOKEN_SET, members: [tokenToInvalidate]
      })).to.be.equal(true);
      addToSetStub.restore();
    });
  });
});
