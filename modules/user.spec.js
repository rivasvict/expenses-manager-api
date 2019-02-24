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
      email: 'ahfushaa',
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
      email: 'ahfushaa',
      lastName: 'Rivas',
      password: 'hola'
    };
    this.setStub(sinon.stub(this.User, 'create')
      .throws());
    try {
      await signUp(userToTest);
    } catch (error) {
      expect(error.name).to.be.equal('ValidationError');
    }
  });

  it('Should throw error when alrady used email', async function () {
    const duplicationUserError = new Error('Duplicated user');
    this.setStub(sinon.stub(this.User, 'create')
      .returns(Promise.resolve(duplicationUserError)));
    const user = await signUp({
      firstName: 'Victor',
      email: 'ahfushaa',
      lastName: 'Rivas',
      password: 'hola'
    });

    assert.equal(user, duplicationUserError);
  });

  afterEach('Restore stubs', function () {
    this.stub.restore();
  });
});
