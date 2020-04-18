const _ = require('lodash');
const sinon = require('sinon');
const { expect } = require('chai');

const { getSaltHash } = require('../lib/util.js');

const UserModule = require('./user.js');

describe('User module', function () {
  describe('Implementation: Sign regular user up', function () {
    beforeEach('Prepare mocked user model', function () {
      this.getMockedUserModel = userToTest => function () {
        return {
          create: sinon.fake.returns(Promise.resolve({ ...userToTest, toJSON: () => userToTest })),
        };
      };

      this.getMockedUserModelWithError = errorToThrow => function () {
        return {
          create: sinon.fake.throws(errorToThrow)
        };
      }
    });

    describe('signUp: Test for user creation', function () {
      it('Should create new user when it is formed with correct data', async function () {
        const userToTest = {
          firstName: 'ahisuhd',
          email: 'ahfushaa@gmail.com',
          lastName: 'Rivas',
          password: 'hola'
        };
        const userModule = UserModule({ _, User: this.getMockedUserModel(userToTest) });
        const user = await userModule.signUp(userToTest);

        expect(user).to.deep.equal(_.omit(userToTest, 'password'));
      });

      it('Should throw error when missing data', async function () {
        const userToTest = {
          email: 'ahfushaa@gmail.com',
          lastName: 'Rivas',
          password: 'hola'
        };
        const validationPathName = 'firstName';
        const validationMessage = 'Validation failed: firstName: Path `firstName` is required.';
        const validationTypeName = 'ValidationError';
        const validationContent = [{ message: validationMessage, path: validationPathName }];
        const validationError = {
          validation: validationContent,
          name: validationTypeName,
          message: 'Invalid data'
        };

        const dbValidationError = {
          name: validationTypeName,
          message: validationMessage,
          errors: {
            [validationPathName]: validationContent[0]
          }
        }

        const userModule = UserModule({
          User: function () {
            return {
              create: sinon.fake.returns(Promise.reject(dbValidationError))
            }
          }, _
        });

        try {
          const createdUser = await userModule.signUp(userToTest);
          expect(createdUser).to.be.equal(undefined)
        } catch (error) {
          expect(error).to.be.deep.equal(validationError);
        }
      });

      it('Should throw an error when an uncorrectly formated email inserted', async function () {
        const user = {
          firstName: 'Victor',
          email: 'ahfushaa@gmailcom',
          lastName: 'Rivas',
          password: 'hola'
        };
        const userModule = UserModule({ User: this.getMockedUserModel(user), _ });
        try {
          const userToTest = await userModule.signUp(user);
        } catch (error) {
          expect(error.message).to.be.equal(`Validation failed: email: Provided email: ${user.email} has no valid format`);
          expect(error.name).to.be.equal('ValidationError');
        }
      });

      it('Should throw error when alrady used email', async function () {
        const duplicationUserError = new Error('Duplicated user');

        try {
          const userModule = UserModule({ User: this.getMockedUserModelWithError(duplicationUserError), _ });
          const user = await userModule.signUp({
            firstName: 'Victor',
            email: 'ahfushaa@gmail.com',
            lastName: 'Rivas',
            password: 'hola'
          });
        } catch (error) {
          expect(error).to.be.deep.equal(duplicationUserError);
        }
      });

    });

    describe('getUser: Test for getting an user from the db', function () {
      let getMockedUserModule = getUserResponse => {
        class UserModel {
          static getByEmail() {
            return sinon.fake.returns(getUserResponse)();
          }
        };

        return UserModule({ User: UserModel, _ })
      };

      it('Should get the user when it exists', async function() {
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
    })
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
      this.getMockedUserModel = userToTest => {
        return {
          getByEmail: sinon.fake.returns(Promise.resolve(userToTest))
        };
      };
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
