const { expect } = require('chai');
const mongoose = require('mongoose');

require('../../../app');

const { accountModule, userModule } = require('../../../src/server/modules/');
const Account = require('../../../src/server/models/account');
const User = require('../../../src/server/models/user');

const db = mongoose.connection;

describe('Account module', function () {
  beforeEach('Create pre conditions to test account module', async function () {
    this.user = await userModule.signUp({
      password: 'myPassword',
      lastName: 'myLastName',
      email: 'asd@gmail.com',
      firstName: 'myFirstName'
    });
    this.account = new Account({
      name: 'Account name',
      description: 'This is a nice description',
      currency: 'CAD'
    });
  });

  afterEach('Clean db collections', async function () {
    await db.dropCollection('accounts');
    await db.dropCollection('users');
  });

  it('Should create a new account to the db associated to the user given', async function () {
    await accountModule.create({ account: this.account, user: this.user });
    const savedUser = await User.findOne({ email: this.user.email }).populate('accounts');
    const savedAccount = savedUser.accounts.find(account => account.id === this.account.id);
    expect(savedAccount).not.to.equal(undefined);
  });
});
