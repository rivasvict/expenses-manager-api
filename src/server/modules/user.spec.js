const _ = require('lodash');
const sinon = require('sinon');
const { expect } = require('chai');
const rewire = require('rewire');

const { getSaltHash } = require('../lib/util.js');

const UserModule = require('./user.js');
const Account = require('../models/account');
const User = require('../models/user');
const userModuleIndex = rewire('./user.js');

describe('User module', function () {
  describe('Implementation: Sign regular user up', function () {
    describe('signUp: Test for user creation', function () {
      it('Should create new user when it is formed with correct data', async function () {
        const userToTest = {
          firstName: 'ahisuhd',
          email: 'ahfushaa@gmail.com',
          lastName: 'Rivas',
          password: 'hola',
          accounts: []
        };
        this.createUserStub = sinon.stub(User.prototype, 'create').returns(Promise.resolve(new User(userToTest)));
        const spiedSetDefaultAccountForUser = sinon.fake();
        const removePassword = userModuleIndex.__get__('RemovePassword')(_);
        const signUp = userModuleIndex.__get__('signUp')({
          User,
          getError: sinon.fake(),
          Account,
          setDefaultAccountForUser: spiedSetDefaultAccountForUser,
          removePassword
        });
        const user = await signUp(userToTest);

        expect(_.omit(user, '_id')).to.deep.equal(_.omit(userToTest, 'password'));
        expect(spiedSetDefaultAccountForUser.calledOnce).to.be.equal(true);
        expect(userToTest).to.deep.equal(_.omit(spiedSetDefaultAccountForUser.firstCall.args[0].toJSON(), '_id'));
      });

      // TODO: Refactor the way this stub is handled
      afterEach('Restore stubs for the User module functions', function () {
        this.createUserStub.restore();
      });

      it('Should throw error when missing data', async function () {
        const userToTest = {
          email: 'ahfushaa@gmail.com',
          lastName: 'Rivas',
          password: 'hola',
          accounts: []
        };
        const validationPathName = 'firstName';
        const validationMessage = 'Path `firstName` is required.';
        const validationTypeName = 'ValidationError';
        const validationContent = [{ message: validationMessage, path: validationPathName }];
        const validationError = {
          validation: validationContent,
          _message: 'Validation failed',
          message: 'Invalid data'
        };

        const dbValidationError = {
          name: validationTypeName,
          message: validationMessage,
          errors: {
            [validationPathName]: validationContent[0]
          }
        };

        this.createUserStub = sinon.stub(User.prototype, 'create').returns(Promise.reject(dbValidationError));
        const userModule = UserModule({
          User,
          _
        });

        try {
          const createdUser = await userModule.signUp(userToTest);
          expect(createdUser).to.be.equal(undefined);
        } catch (error) {
          expect(error).to.be.deep.equal(validationError);
        }
      });

      it('Should throw an error when an uncorrectly formated email inserted', async function () {
        const user = {
          firstName: 'Victor',
          email: 'ahfushaa@gmailcom',
          lastName: 'Rivas',
          password: 'hola',
          accounts: []
        };
        this.createUserStub = sinon.stub(User.prototype, 'create').returns(Promise.resolve());
        const userModule = UserModule({ User, _ });
        try {
          await userModule.signUp(user);
        } catch (error) {
          expect(error.message).to.be.equal('Invalid data');
        }
      });

      it('Should throw error when alrady used email', async function () {
        const duplicationUserError = new Error('Duplicated user');

        this.createUserStub = sinon.stub(User.prototype, 'create').returns(Promise.reject(duplicationUserError));
        try {
          const userModule = UserModule({
            User,
            _,
            Account
          });

          await userModule.signUp({
            firstName: 'Victor',
            email: 'ahfushaa@gmail.com',
            lastName: 'Rivas',
            password: 'hola',
            accounts: []
          });
        } catch (error) {
          expect(error).to.be.deep.equal(duplicationUserError);
        }
      });
    });

    describe('getUser: Test for getting an user from the db', function () {
      const getMockedUserModule = (getUserResponse) => {
        class UserModel {
          static getByEmail() {
            return sinon.fake.returns(getUserResponse)();
          }
        }

        return UserModule({ User: UserModel, _ });
      };

      it('Should get the user when it exists', async function () {
        const existingEmailUser = 'test@test.test';
        const existingUser = {
          email: existingEmailUser
        };
        const userModule = getMockedUserModule({ ...existingUser, password: 'password' });
        try {
          const emailUserFromDb = await userModule.getUser(existingEmailUser);

          expect(emailUserFromDb).to.be.deep.equal(_.omit(existingUser, 'password'));
        } catch (error) {
          throw error;
        }
      });
    });
  });

  describe('Integration: Authenticate user', function () {
    beforeEach('Prepare user authentication stubs', async function () {
      const hashedPassword = await getSaltHash({ dataToHash: 'myPassword' });
      this.mockedUser = {
        email: 'test@extracker.com',
        firstName: 'firstName',
        lastName: 'lastName',
        password: hashedPassword,
        get: userProperty => this.mockedUser[userProperty]
      };
      this.getMockedUserModel = userToTest => ({
        getByEmailWithPassword: sinon.fake.returns(Promise.resolve(userToTest))
      });
    });

    it('Should return user when authentication success', async function () {
      const user = {
        email: 'test@extracker.com',
        password: 'myPassword'
      };

      const userModule = UserModule({ _, User: this.getMockedUserModel(this.mockedUser) });
      const signedUser = await userModule.authenticateUser(user);
      expect(signedUser).to.be.deep.equal(_.omit(this.mockedUser, 'password'));
    });

    it('Should return null when failed to authenticate user', async function () {
      const user = {
        email: 'test@extracker.com',
        password: 'myPass'
      };

      const userModule = UserModule({ User: this.getMockedUserModel(this.mockedUser) });
      const signedUser = await userModule.authenticateUser(user);
      expect(signedUser).to.deep.equal(null);
    });
  });
});
