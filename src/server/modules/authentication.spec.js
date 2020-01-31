const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const { expect } = require('chai');
const _ = require('lodash');

const config = require('../../../config.js');

const authenticationModule = require('./authentication.js');

describe('Authentication module', function () {
  describe('Authenticate regular user', function () {
    beforeEach('Prepare stubs', function () {
      this.username = 'test@test.com';
      this.password = 'password';
      this.userToAuthenticate = {
        firstname: 'test',
        email: this.username,
        lastname: 'test',
        toJSON: () => _.omit(this.userToAuthenticate, ['toJSON'])
      };
      this.getAuthenticationModule = ({ userModuleMock }) => authenticationModule({
        config,
        _,
        jwt,
        userModule: userModuleMock
      });
    });

    describe('Valid user cases', function () {
      beforeEach('Prepare valid user authentication simulation', async function () {
        const userModuleMock = {
          authenticateUser: sinon.fake.returns(Promise.resolve(this.userToAuthenticate))
        };
        this.authentication = this.getAuthenticationModule({ userModuleMock });
        this.authenticatedUserData = await this.authentication
          .verifyAuthenticUser(this.username, this.password);
      })

      it('Should return user valid user token when correct credentials', async function () {
        const decodedUserToken = this.authentication.verifyToken(this.authenticatedUserData.token);
        expect(decodedUserToken).to.have.property('firstname');
        expect(decodedUserToken).to.have.property('lastname');
        expect(decodedUserToken).to.have.property('email');
        expect(decodedUserToken).to.have.property('exp');
        expect(decodedUserToken).to.have.property('iat');
        const expirationTimeLength = decodedUserToken.exp - decodedUserToken.iat;
        expect(expirationTimeLength).to.be.equal(7200);
      });

      it('Should return user related data', function () {
        const { user } = this.authenticatedUserData;
        expect(user).to.be.deep.equal(this.userToAuthenticate);
      })
    })

    it('Should return null when non authentic user', async function () {
      const userModuleMock = {
        authenticateUser: sinon.fake.returns(Promise.resolve(null))
      };
      const authentication = this.getAuthenticationModule({ userModuleMock });
      const verifiedUserToken = await authentication
        .verifyAuthenticUser(this.username, this.password);
      expect(verifiedUserToken).to.deep.equal(null);
    });

    afterEach('Restore stubs', function () {
      sinon.restore();
    });
  });

  describe('Token usage', function () {
    beforeEach('Get authentication module ready for test', function () {
      this.authentication = authenticationModule({
        config,
        jwt
      });
    });

    it('Should authentication.getToken', function () {
      const loggedUser = {
        firstname: 'test',
        email: 'test@test.com',
        lastname: 'test'
      };
      const token = this.authentication.getToken({ payload: loggedUser, tokenGenerationOptions: { expiresIn: '1s' } });
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

      afterEach('Restore spy', function () {
        sinon.restore();
      });

      it('Should verify correct token with no expiration time', function () {
        const token = this.authentication.getToken({ payload: this.loggedUser });
        const decodedToken = this.authentication.verifyToken(token);
        expect(decodedToken).to.have.property('firstname');
        expect(decodedToken).to.have.property('lastname');
        expect(decodedToken).to.have.property('email');
      });

      it('Should throw error when token is invalid', function () {
        const invalidToken = `${this.authentication.getToken({ payload: this.loggedUser })}123`;
        try {
          this.authentication.verifyToken(invalidToken);
        } catch (error) {
          expect(error.message).to.be.equal('invalid signature');
        }
      });

      it('Should should verify token under expiration time', function () {
        const token = this.authentication.getToken({
          payload: this.loggedUser,
          tokenGenerationOptions: {
            expiresIn: '4s'
          }
        });
        const decodedToken = this.authentication.verifyToken(token);
        expect(decodedToken).to.have.property('firstname');
        expect(decodedToken).to.have.property('lastname');
        expect(decodedToken).to.have.property('email');
      });

      it('Should should throw an error when verify token is out of expiration time', function () {
        const expiredToken = this.authentication.getToken({
          payload: this.loggedUser,
          tokenGenerationOptions: {
            expiresIn: '-1s'
          }
        });

        const decodedToken = this.authentication.verifyToken(expiredToken);
        expect(decodedToken).to.be.equal(null);
      });
    });
  });

  describe('passportVerify: Verify user for passportJs strategy', function () {
    beforeEach('Prepare stubs', function () {
      this.username = 'test@test.com';
      this.password = 'password';
      this.userToAuthenticate = {
        firstname: 'test',
        email: this.username,
        lastname: 'test'
      };
      this.authentication = authenticationModule({});
    });

    it('Should successfully verify the user', async function () {
      const done = sinon.fake();
      const jwtPayload = {
        username: this.username,
        password: this.password
      };
      await this.authentication.passportVerify(jwtPayload, done);
      expect(done.callCount).to.be.equal(1);
      expect(done.calledOnceWith(null, jwtPayload)).to.be.equal(true);
    });

    it('Should call done with false when non authentic user', async function () {
      const done = sinon.fake();
      await this.authentication.passportVerify(null, done);
      expect(done.callCount).to.be.equal(1);
      expect(done.calledOnceWith(null, false)).to.be.equal(true);
    });

    afterEach('Restore stubs', function () {
      sinon.restore();
    });
  });

  describe('isTokenInvalidated: Token invalidation check through blacklist', function () {
    beforeEach('Preconfigure tests', function () {
      this.invalidToken = 'Bearer invalidToken';
      this.rawToken = 'invalidToken';
      this.getAuthenticationModule = ({ cacheModule }) => authenticationModule({
        cacheModule,
        config,
        jwt
      });
    });

    after('Stop mock', function () {
      sinon.restore();
    });

    it('Should return true when token is blacklisted', async function () {
      const isMemberOfSetFake = sinon.fake.returns(Promise.resolve(1));
      const authentication = this.getAuthenticationModule({
        cacheModule: {
          isMemberOfSet: isMemberOfSetFake
        }
      });
      const isTokenInvalidated = await authentication
        .isTokenInvalidated(this.invalidToken);
      expect(isTokenInvalidated).to.be.equal(true);
      expect(isMemberOfSetFake.calledOnce).to.be.equal(true);
      expect(isMemberOfSetFake.calledWith({
        setName: config.sets.INVALID_USER_TOKEN_SET, member: this.rawToken
      })).to.be.equal(true);
    });

    it('Should return false when token is NOT blacklisted', async function () {
      const isMemberOfSetFake = sinon.fake.returns(Promise.resolve(0));
      const authentication = this.getAuthenticationModule({
        cacheModule: {
          isMemberOfSet: isMemberOfSetFake
        }
      });
      const isTokenInvalidated = await authentication
        .isTokenInvalidated('Bearer invalidToken');
      expect(isTokenInvalidated).to.be.equal(false);
      expect(isMemberOfSetFake.calledOnce).to.be.equal(true);
      expect(isMemberOfSetFake.calledWith({
        setName: config.sets.INVALID_USER_TOKEN_SET, member: this.rawToken
      })).to.be.equal(true);
    });

    it('Should remove all invalid tokens from black list', async function () {
      const removeMembersFromSetFake = sinon.fake.returns(Promise.resolve(2));
      const authenticationModuleDependencies = {
        cacheModule: {
          removeMembersFromSet: removeMembersFromSetFake,
          getAllMembersOfSet: () => {}
        }
      };
      const authentication = this.getAuthenticationModule(authenticationModuleDependencies);
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
        const getAllMembersOfSetFake = sinon.stub(authenticationModuleDependencies.cacheModule, 'getAllMembersOfSet')
          .returns(Promise.resolve(blacklistedTokens));
        await authentication
          .removeInvalidTokensFromBlackList();
        expect(removeMembersFromSetFake.calledOnce).to.be.equal(true);
        expect(removeMembersFromSetFake.calledWith(expiredTokens)).to.be.equal(true);
        getAllMembersOfSetFake.restore();
      } catch (error) {
        throw error;
      }
    });

    it('invalidateToken should call add to set on cache with token to invalidate', async function () {
      const addToSetFake = sinon.fake.returns(Promise.resolve(1));
      const authentication = this.getAuthenticationModule({
        cacheModule: {
          addToSet: addToSetFake
        }
      });
      const tokenToInvalidate = 'thisIsAnInvalidToken';
      const bearer = `Bearer ${tokenToInvalidate}`;
      await authentication
        .invalidateToken(bearer);
      expect(addToSetFake.calledOnce).to.be.equal(true);
      expect(addToSetFake.calledWith({
        setName: config.sets.INVALID_USER_TOKEN_SET, members: [tokenToInvalidate]
      })).to.be.equal(true);
    });
  });
});
