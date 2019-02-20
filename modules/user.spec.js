const rewire = require('rewire');
const assert = require('assert');
const sinon = require('sinon');
const userModule = rewire('./user.js');
const signUp = userModule.__get__('signUp');
const  User = userModule.__get__('User');

describe('Sign user up', function () {

  it('Should create new user when it is formed with correct data', function () {
    const save = sinon.stub(User, 'create');
    console.log(save);
    /* const bla = await signUp({
      firstName: 'Victor',
      email: 'ahfushaa',
      lastName: 'Rivas',
      password: 'hola'
    });

    assert.equal(bla, 'Success');*/
  });

  it('Should throw error when alrady user email', function () {
  });

  it('Should throw error when missing data', function () {
  });
});
