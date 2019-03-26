const sinon = require('sinon');
const { expect } = require('chai');

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
        lastname: 'test'
      };
    });

    it('Should return user valid user token when correct credentials', async function () {
      this.setStub(sinon.stub(userModule, 'authenticateUser')
        .returns(Promise.resolve(this.userToAuthenticate)));
      const verifiedUserToken = await authentication.verifyAuthenticUser(this.username, this.password);
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
      const verifiedUserToken = await authentication.verifyAuthenticUser(this.username, this.password);
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
});
