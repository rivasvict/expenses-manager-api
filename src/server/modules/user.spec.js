const assert = require('assert');
const sinon = require('sinon');
const { expect } = require('chai');

const { getSaltHash } = require('../lib/util.js');
const constants = require('../constants.js');

const UserModule = require('./user.js');

describe('User module', function () {
  describe('Implementation: Sign regular user up', function () {
    beforeEach('Prepare mocked user model', function () {
      this.getMockedUserModel = userToTest => function () {
        return {
          create: sinon.fake.returns(Promise.resolve(userToTest))
        };
      };
    });

    it('Should create new user when it is formed with correct data', async function () {
      const userToTest = {
        firstName: 'ahisuhd',
        email: 'ahfushaa@gmail.com',
        lastName: 'Rivas',
        password: 'hola'
      };
      const userModule = UserModule(this.getMockedUserModel(userToTest));
      const user = await userModule.signUp(userToTest);

      expect(user).to.deep.equal(userToTest);
    });

    it('Should throw error when missing data', async function () {
      const userToTest = {
        email: 'ahfushaa@gmail.com',
        lastName: 'Rivas',
        password: 'hola'
      };
      const userModule = UserModule(this.getMockedUserModel(userToTest));
      try {
        await userModule.signUp(userToTest);
      } catch (error) {
        expect(error.message).to.be.equal('Validation failed: firstName: Path `firstName` is required.');
        expect(error.name).to.be.equal('ValidationError');
      }
    });

    it('Should throw an error when an uncorrectly formated email inserted', async function () {
      const user = {
        firstName: 'Victor',
        email: 'ahfushaa@gmailcom',
        lastName: 'Rivas',
        password: 'hola'
      };
      const userModule = UserModule(this.getMockedUserModel(user));
      try {
        const userToTest = await userModule.signUp(user);
      } catch (error) {
        expect(error.message).to.be.equal(`Validation failed: email: Provided email: ${user.email} has no valid format`);
        expect(error.name).to.be.equal('ValidationError');
      }
    });

    it('Should throw error when alrady used email', async function () {
      const duplicationUserError = new Error('Duplicated user');
      const userModule = UserModule(this.getMockedUserModel(duplicationUserError));
      const user = await userModule.signUp({
        firstName: 'Victor',
        email: 'ahfushaa@gmail.com',
        lastName: 'Rivas',
        password: 'hola'
      });

      assert.equal(user, duplicationUserError);
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
      this.getMockedUserModel = userToTest => {
        return { getByEmail: sinon.fake.returns(Promise.resolve(userToTest))  };
      };
    });

    it('Should return user when authentication success', async function () {
      const user = {
        email: 'test@extracker.com',
        password: 'myPassword'
      };

      const userModule = UserModule(this.getMockedUserModel(this.mockedUser));
      const signedUser = await userModule.authenticateUser(user);
      expect(signedUser.email).to.be.equal(user.email);
    });

    it('Should return null when failed to authenticate user', async function () {
      const user = {
        email: 'test@extracker.com',
        password: 'myPass'
      };

      const userModule = UserModule(this.getMockedUserModel(this.mockedUser));
      const signedUser = await userModule.authenticateUser(user);
      expect(signedUser).to.deep.equal(null);
    });
  });
});
