const rewire = require('rewire');
const assert = require('assert');
const sinon = require('sinon');
const { expect } = require('chai');

const userModule = rewire('./user.js');
const signUp = userModule.__get__('signUp');
const User = userModule.__get__('User');

describe('Implementation: Sign user up', function () {
  beforeEach('Stub User model', function () {
    this.User = User.prototype;
    this.setStub = function (stub) {
      this.stub = stub;
    };
  });

  it('Should create new user when it is formed with correct data', async function () {
    const userToTest = {
      firstName: 'ahisuhd',
      email: 'ahfushaa@gmail.com',
      lastName: 'Rivas',
      password: 'hola'
    };
    this.setStub(sinon.stub(this.User, 'create')
      .returns(Promise.resolve(userToTest)));
    const user = await signUp(userToTest);

    expect(user).to.deep.equal(userToTest);
  });

  it('Should throw error when missing data', async function () {
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

  afterEach('Restore stubs', function () {
    this.stub.restore();
  });
});
