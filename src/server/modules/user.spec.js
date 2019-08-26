const assert = require('assert');
const sinon = require('sinon');
const { expect } = require('chai');

const { getSaltHash } = require('../lib/util.js');
const constants = require('../constants.js');

const UserModule = require('./user.js');

describe('User module', function () {
  describe('Implementation: Sign regular user up', function () {
    it('Should create new user when it is formed with correct data', async function () {
      const userToTest = {
        firstName: 'ahisuhd',
        email: 'ahfushaa@gmail.com',
        lastName: 'Rivas',
        password: 'hola'
      };
      const MockedUserModel = function () {
        return {
          create: sinon.fake.returns(Promise.resolve(userToTest))
        };
      };
      const userModule = UserModule(MockedUserModel);
      const user = await userModule.signUp(userToTest);

      expect(user).to.deep.equal(userToTest);
    });

    it.only('Should throw error when missing data', async function () {
      const userToTest = {
        email: 'ahfushaa@gmail.com',
        lastName: 'Rivas',
        password: 'hola'
      };
      this.setStub(sinon.stub(this.User, 'create')
        .throws());
      try {
        await signUp(userToTest);
      } catch (error) {
        expect(error.message).to.be.equal('Validation failed: firstName: Path `firstName` is required.');
        expect(error.name).to.be.equal('ValidationError');
      }
    });

    it('Should throw an error when an uncorrectly formated email inserted', async function () {
      this.setStub(sinon.stub(this.User, 'create')
        .throws());
      const user = {
        firstName: 'Victor',
        email: 'ahfushaa@gmailcom',
        lastName: 'Rivas',
        password: 'hola'
      };
      try {
        const userToTest = await signUp(user);
        await signUp(userToTest);
      } catch (error) {
        expect(error.message).to.be.equal(`Validation failed: email: Provided email: ${user.email} has no valid format`);
        expect(error.name).to.be.equal('ValidationError');
      }
    });

    it('Should throw error when alrady used email', async function () {
      const duplicationUserError = new Error('Duplicated user');
      this.setStub(sinon.stub(this.User, 'create')
        .returns(Promise.resolve(duplicationUserError)));
      const user = await signUp({
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
      this.setStub = (stub) => {
        this.stub = stub;
      };
    });

    it('Should return user when authentication success', async function () {
      const user = {
        email: 'test@extracker.com',
        password: 'myPassword'
      };

      this.setStub(sinon.stub(User, 'getByEmail')
        .returns(Promise.resolve(this.mockedUser)));
      const signedUser = await authenticateUser(user);
      expect(signedUser.email).to.be.equal(user.email);
    });

    it('Should return null when failed to authenticate user', async function () {
      this.setStub(sinon.stub(User, 'getByEmail')
        .returns(Promise.resolve(this.mockedUser)));
      const user = {
        email: 'test@extracker.com',
        password: 'myPass'
      };

      const signedUser = await authenticateUser(user);
      expect(signedUser).to.deep.equal(null);
    });

    afterEach('Restore user authentication stubs', function () {
      this.stub.restore();
    });
  });
});
