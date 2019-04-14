const { expect } = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const loginRouter = rewire('./index.js');
const userModule = rewire('../../modules/user.js');
const loginRouteHandler = loginRouter.__get__('loginRouteHandler');
const signUpRouteHandler = loginRouter.__get__('signUpRouteHandler');
const authenticationModule = require('../../modules/authentication.js');

const User = userModule.__get__('User');

describe('Authentication routes', function () {
  beforeEach('Initialize spies for authentication', function () {
    this.res = {
      status: () => this.res,
      json: sinon.spy()
    };
    sinon.spy(this.res, 'status');
  });

  describe('loginRouteHandler tests', function () {
    beforeEach('Prepare user to authenticate', function () {
      this.userToAuthenticate = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'victor@gmail.com',
        password: 'password'
      };
      this.rec = {
        body: {
          user: this.userToAuthenticate
        }
      };
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

  describe('signUpRouteHandler tests', function () {
    beforeEach('signUpRouteHandler', function () {
      this.userToSignUp = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'victor@gmail.com',
        password: 'password'
      };
      this.rec = {
        body: {
          user: this.userToSignUp
        }
      };
      this.setStub = (stub) => {
        this.stub = stub;
      };
    });

    it('signUpRouteHandler: Should successfully respond to client with 200 status when successfully created user', async function () {
      this.setStub(sinon.stub(User.prototype, 'create')
        .returns(Promise.resolve(this.userToSignUp)));
      await signUpRouteHandler(this.rec, this.res);
      expect(this.res.status.calledWith(200)).to.be.equal(true);
      expect(this.res.json.calledWith(this.userToSignUp)).to.be.equal(true);
      expect(this.res.status.callCount).to.be.equal(1);
      expect(this.res.json.callCount).to.be.equal(1);
    });

    it('signUpRouteHandler: Should return validation error when bad data error is thrown from create function', async function () {
      const validationError = {
        message: 'Validation failed: firstName: Path `firstName` is required.',
        name: 'ValidationError'
      };
      this.setStub(sinon.stub(User.prototype, 'create')
        .throws(validationError));
      try {
        await signUpRouteHandler(this.rec, this.res);
      } catch (error) {
        expect(this.res.status.calledWith(400)).to.be.equal(true);
        expect(this.res.json.calledWith(validationError)).to.be.equal(true);
        expect(this.res.status.callCount).to.be.equal(1);
        expect(this.res.json.callCount).to.be.equal(1);
      }
    });

    it('signUpRouteHandler: Should return duplication error when duplication error is returned from creation function', async function () {
      const duplicationError = {
        message: 'Duplicated user'
      };
      this.setStub(sinon.stub(User.prototype, 'create')
        .throws(duplicationError));
      try {
        await signUpRouteHandler(this.rec, this.res);
      } catch (error) {
        expect(this.res.status.calledWith(409)).to.be.equal(true);
        expect(this.res.json.calledWith(duplicationError)).to.be.equal(true);
        expect(this.res.status.callCount).to.be.equal(1);
        expect(this.res.json.callCount).to.be.equal(1);
      }
    });

    it('signUpRouteHandler: Generic error with generic message should be thrown if not success, duplicate or malformed result on user creation', async function () {
      const genericError = {
        message: 'Internal server error'
      };
      this.setStub(sinon.stub(User.prototype, 'create')
        .throws(genericError));
      try {
        await signUpRouteHandler(this.rec, this.res);
      } catch (error) {
        expect(this.res.status.calledWith(500)).to.be.equal(true);
        expect(this.res.json.calledWith(genericError)).to.be.equal(true);
        expect(this.res.status.callCount).to.be.equal(1);
        expect(this.res.json.callCount).to.be.equal(1);
      }
    });

    afterEach('Restore stubs for signUpRouteHandler', function () {
      this.stub.restore();
    });
  });

  afterEach('Restore spies', function () {
    sinon.restore();
  });
});
