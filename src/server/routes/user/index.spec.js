const { expect } = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
const _ = require('lodash');

const loginRouter = rewire('./index.js');
const rawLoginRouteHandler = loginRouter.__get__('loginRouteHandler');
const getLoginRouterHandler = authentication => rawLoginRouteHandler(authentication);

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
      this.req = {
        body: {
          user: this.userToAuthenticate
        }
      };
      this.getAuthenticationModule = ({ token, user }) => {
        if (user) {
          const response = {
            user: _.omit(user, 'password'),
            token
          };
          return {
            verifyAuthenticUser: sinon.fake.returns(Promise.resolve(response))
          }
        }

        return {
           verifyAuthenticUser: sinon.fake.returns(Promise.resolve(null))
        }
      }
    });

    it('loginRouteHandler: Should successfully respond to client when correct credentials passed on body', async function () {
      const userToken = 'the user token test';
      const authenticationModule = this.getAuthenticationModule({ token: userToken, user: this.userToAuthenticate });
      const loginRouteHandler = getLoginRouterHandler(authenticationModule);
      await loginRouteHandler(this.req, this.res);
      expect(this.res.status.calledWith(200)).to.be.equal(true);
      expect(this.res.json.calledWith({ user: { token: userToken, user: _.omit(this.userToAuthenticate, 'password') } })).to.be.equal(true);
      expect(this.res.status.callCount).to.be.equal(1);
      expect(this.res.json.callCount).to.be.equal(1);
    });

    it('loginRouteHandler: Should respond with error to client when incorrect credentials passed on body', async function () {
      const authenticationModule = this.getAuthenticationModule({});
      const loginRouteHandler = getLoginRouterHandler(authenticationModule);
      await loginRouteHandler(this.req, this.res);
      expect(this.res.status.calledWith(403)).to.be.equal(true);
      expect(this.res.json.calledWith({ message: 'Invalid credentials' })).to.be.equal(true);
      expect(this.res.status.callCount).to.be.equal(1);
      expect(this.res.json.callCount).to.be.equal(1);
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
      this.req = {
        body: {
          user: this.userToSignUp
        }
      };
      this.setStub = (stub) => {
        this.stub = stub;
      };
    });

    it('signUpRouteHandler: Should successfully respond to client with 200 status when successfully created user', async function () {
      const mockedUserModule = {
        signUp: () => Promise.resolve(this.userToSignUp)
      };

      const SignUpRouteHandler = loginRouter.__get__('signUpRouteHandler');
      const signUpRouteHandler = SignUpRouteHandler(mockedUserModule);
      await signUpRouteHandler(this.req, this.res);
      expect(this.res.status.calledWith(200)).to.be.equal(true);
      expect(this.res.json.calledWith(this.userToSignUp)).to.be.equal(true);
      expect(this.res.status.callCount).to.be.equal(1);
      expect(this.res.json.callCount).to.be.equal(1);
    });

    it('signUpRouteHandler: Should return validation error when bad data error is thrown from create function', async function () {
      const validationPathName = 'firstName';
      const validationError = {
        validation: [{ message: 'Validation failed: firstName: Path `firstName` is required.', path: validationPathName }],
        name: 'ValidationError',
      };
      const mockedUserModule = {
        signUp: () => Promise.reject(validationError)
      };

      const SignUpRouteHandler = loginRouter.__get__('signUpRouteHandler');
      const signUpRouteHandler = SignUpRouteHandler(mockedUserModule);
      const copiedReq = _.cloneDeep(this.req);
      const invalidUser = _.omit(copiedReq.body.user, validationPathName);
      copiedReq.body.user = invalidUser;
      
      try {
        await signUpRouteHandler(copiedReq, this.res);
        if (!this.res.status.calledWith(200)) {
          expect(this.res.status.calledWith(400)).to.be.equal(true);
          expect(this.res.json.calledWith(validationError)).to.be.equal(true);
          expect(this.res.status.callCount).to.be.equal(1);
          expect(this.res.json.callCount).to.be.equal(1);
        }
      } catch (error) {
        throw error;
      }
    });

    it('signUpRouteHandler: Should return duplication error when duplication error is returned from creation function', async function () {
      const duplicationError = {
        message: 'Duplicated user',
        name: 'duplicationError'
      };
      const mockedUserModule = {
        signUp: () => Promise.reject(duplicationError)
      };

      const SignUpRouteHandler = loginRouter.__get__('signUpRouteHandler');
      const signUpRouteHandler = SignUpRouteHandler(mockedUserModule);
      try {
        await signUpRouteHandler(this.req, this.res);
        if (!this.res.status.calledWith(200)) {
          expect(this.res.status.calledWith(409)).to.be.equal(true);
          expect(this.res.json.calledWith(duplicationError)).to.be.equal(true);
          expect(this.res.status.callCount).to.be.equal(1);
          expect(this.res.json.callCount).to.be.equal(1);
        }
      } catch (error) {
        throw error;
      }
    });

    it('signUpRouteHandler: Generic error with generic message should be thrown if not success, duplicate or malformed result on user creation', async function () {
      const genericError = {
        message: 'Internal server error'
      };
      const mockedUserModule = {
        signUp: () => Promise.reject(genericError)
      };

      const SignUpRouteHandler = loginRouter.__get__('signUpRouteHandler');
      const signUpRouteHandler = SignUpRouteHandler(mockedUserModule);
      try {
        await signUpRouteHandler(this.req, this.res);
        expect(this.res.status.calledWith(200)).to.be.equals(false);
      } catch (error) {
        expect(this.res.status.calledWith(500)).to.be.equal(true);
        expect(this.res.json.calledWith(genericError)).to.be.equal(true);
        expect(this.res.status.callCount).to.be.equal(1);
        expect(this.res.json.callCount).to.be.equal(1);
      }
    });
  });

  describe('logOutHandler test', function () {
    beforeEach('Prepare logOutHandlerTest', function () {
      this.token = 'testToken';
      this.bearer = `bearer ${this.token}`;
      this.jsonFake = sinon.fake(() => {});
      this.statusFake = sinon.fake.returns({ json: this.jsonFake });
      this.req = {
        headers: {
          authorization: this.bearer
        }
      };
      this.res = {
        status: this.statusFake
      };
    });

    it('Should call status with success code', async function () {
      const LogOutHandler = loginRouter.__get__('logOutHandler');
      const logOutHandler = LogOutHandler({
        invalidateToken: () => Promise.resolve()
      });
      await logOutHandler(this.req, this.res);
      expect(this.statusFake.callCount).to.be.equal(1);
      expect(this.statusFake.calledWith(200)).to.be.equal(true);
    });

    it('Should NOT call cache.addToSet and call response with 400 status when there is NO token', async function () {
      const LogOutHandler = loginRouter.__get__('logOutHandler');
      const logOutHandler = LogOutHandler({
        invalidateToken: () => Promise.reject(new Error({ message: 'Bearer is missing' }))
      });
      delete this.req.headers.authorization;
      await logOutHandler(this.req, this.res);
      expect(this.statusFake.callCount).to.be.equal(1);
      expect(this.statusFake.calledWith(400)).to.be.equal(true);
      expect(this.jsonFake.callCount).to.be.equal(1);
      expect(this.jsonFake.calledWith({ message: 'Bearer is missing' })).to.be.equal(true);
    });
  });

  afterEach('Restore spies', function () {
    sinon.restore();
  });
});
