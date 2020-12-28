const { expect } = require('chai');
const sinon = require('sinon');

const Account = require('../models/account');
const User = require('../models/user');
const AccountModule = require('./account');

const accountModule = AccountModule();

describe('account module', function () {
  beforeEach('Prepare account', async function () {
    this.validAccount = new Account({
      name: 'Account name',
      description: 'This is a nice description',
      currency: 'CAD'
    });
    this.accountSaveStub = sinon.stub(this.validAccount, 'save').returns(Promise.resolve(this.validAccount));

    this.account = await this.validAccount.create();
    this.user = new User({
      firstName: 'Nice firstName',
      email: 'test@mail.com',
      lastName: 'Nice lastName',
      password: 'thisisasecurepassword'
    });
    this.userUpdateOne = sinon.stub(this.user, 'updateOne').returns(Promise.resolve(this.user));
    this.createdAccount = await accountModule.create({ account: this.account, user: this.user });
  });

  afterEach('Restore stubs', function () {
    this.accountSaveStub.restore();
    this.userUpdateOne.restore();
  });

  it('Should create a new account related to an user', function () {
    expect(this.createdAccount).to.deep.equal(this.validAccount);
  });

  it('Should have called updateOne with correct parameters', function () {
    expect(this.userUpdateOne.callCount).to.be.equal(1);
    expect(this.userUpdateOne.calledWith({ accounts: [this.account._id] })).to.be.equal(true);
  });
});
