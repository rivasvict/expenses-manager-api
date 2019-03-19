const sinon = require('sinon');
const { expect } = require('chai');

const userModule = require('./user.js');
const { verifyLocal, getToken, verifyToken } = require('./authentication.js');

describe('Authentication module', function () {
  describe('Authenticate regular user', function () {
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

    it('Should call done with false when non authentic user');

    afterEach('Restore stubs', function () {
      if (this.stub && this.stub.restore) {
        this.stub.restore();
      }
    });
  });

  describe('Token usage', function () {
    it('Should getToken', function () {
      const loggedUser = {
        firstname: 'test',
        email: 'test@test.com',
        lastname: 'test'
      };
      const token = getToken({ payload: loggedUser, tokenGenerationOptions: { expiresIn: '1s' } });
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
        const token = getToken({ payload: this.loggedUser });
        const decodedToken = verifyToken(token);
        expect(decodedToken).to.have.property('firstname');
        expect(decodedToken).to.have.property('lastname');
        expect(decodedToken).to.have.property('email');
      });

      it('Should throw error when token is invalid', function () {
        const token = `${getToken({ payload: this.loggedUser })}123`;
        try {
          verifyToken(token);
        } catch (error) {
          expect(error.message).to.be.equal('invalid signature');
        }
      });

      it('Should should verify token under expiration time', function () {
        this.timeout(5000);
        const token = getToken({
          payload: this.loggedUser,
          tokenGenerationOptions: {
            expiresIn: '4s'
          }
        });
        setTimeout(function () {
          const decodedToken = verifyToken(token);
          expect(decodedToken).to.have.property('firstname');
          expect(decodedToken).to.have.property('lastname');
          expect(decodedToken).to.have.property('email');
        }, 3000);
      });

      it('Should should throw an error when verify token is out of expiration time', function () {
        this.timeout(5000);
        const token = getToken({
          payload: this.loggedUser,
          tokenGenerationOptions: {
            expiresIn: '1s'
          }
        });
        setTimeout(function () {
          try {
            verifyToken(token);
          } catch (error) {
            expect(error.name).to.be.equal('TokenExpiredError');
          }
        }, 3000);
      });
    });
  });
});
