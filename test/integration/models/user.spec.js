const { expect } = require('chai');

require('../../../app.js');
const { userModule } = require('../../../src/server/modules/');
const UserModel = require('../../../src/server/models/user');
const mongoose = require('mongoose');
const db = mongoose.connection;

describe('User module', function () {
  afterEach('Clean any storage layer', async function () {
    await db.dropCollection('users');
  });

  it('signUp: should create the new user', async function () {
    const user = {
      password: 'myPassword',
      lastName: 'myLastName',
      email: 'asd@gmail.com',
      firstName: 'myFirstName'
    };

    const insertedUser = await userModule.signUp(user);
    const userFromDb = await UserModel.findOne({ email: user.email });
    expect(insertedUser.id).be.deep.equal(userFromDb.id);
  });

  it('signUp: should retrieve user when authenticated', async function () {
    const user = {
      password: 'myPassword',
      lastName: 'myLastName',
      email: 'asd@gmail.com',
      firstName: 'myFirstName'
    };

    const insertedUser = await userModule.signUp(user);
    const authenticatedUser = await userModule.authenticateUser({
      email: user.email,
      password: user.password
    });
    expect(insertedUser.id).be.deep.equal(authenticatedUser.id);
  });
});
