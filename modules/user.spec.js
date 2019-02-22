const rewire = require('rewire');
const assert = require('assert');
const sinon = require('sinon');

const userModule = rewire('./user.js');
const signUp = userModule.__get__('signUp');
const User = userModule.__get__('User');

(async function() {
  const user = await signUp({
    firstName: 'Victor',
    email: 'ahfushaa',
    lastName: 'Rivas',
    password: 'hola'
  });

  console.log(user);
})();

/* 
 * describe('Sign user up', function () {
 * TODO: Finish parameters validation test
  it('Should create new user when it is formed with correct data');

  it('Should throw error when missing data');

  it('Should throw error when alrady used email', async function () {
    const duplicationUserError = new Error('Duplicated user');
    sinon.stub(User.prototype, 'create')
      .returns(Promise.resolve(duplicationUserError));
    const user = await signUp({
      firstName: 'Victor',
      email: 'ahfushaa',
      lastName: 'Rivas',
      password: 'hola'
    });

    assert.equal(user, duplicationUserError);
  });
});*/
