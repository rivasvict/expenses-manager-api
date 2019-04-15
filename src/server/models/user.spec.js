const { expect } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');

const User = require('./user');
const { getSaltHash } = require('../lib/util.js');

describe('User class', function () {
  describe('User creation', function () {
    beforeEach('Instance User class', function () {
      this.user = new User({
        password: 'myPassword',
        lastName: 'myLastName',
        email: 'asd@gmail.com',
        firstName: 'myFirstName'
      });
    });

    describe('user.create', function () {
      beforeEach('Instance User class', function () {
        this.notDuplicationNumber = 0;
        this.duplicationNumber = 1;
        this.saveStub = sinon.stub(this.user, 'save').returns(Promise.resolve(this.user));
      });

      it('Should return created user from db', async function () {
        this.getIsEmailDuplicatedStub = sinon.stub(this.user, 'getIsEmailDuplicated')
          .returns(Promise.resolve(this.notDuplicationNumber));
        try {
          const user = await this.user.create();
          expect(user).to.deep.equal(this.user);
        } catch (error) {
          throw error;
        }
      });

      it('Should return duplication error when user email is duplicated on db', async function () {
        this.getIsEmailDuplicatedStub = sinon.stub(this.user, 'getIsEmailDuplicated')
          .returns(Promise.resolve(this.duplicationNumber));
        const errorMessage = 'Duplicated user';
        try {
          await this.user.create();
        } catch (error) {
          expect(error.message).to.be.equal(errorMessage);
        }
      });

      afterEach('Restore stubs', function () {
        this.saveStub.restore();
        this.getIsEmailDuplicatedStub.restore();
      });
    });

    describe('user.getIsEmailDuplicated', function () {
      it('Should return the right number of found users by email', async function () {
        const findMock = {
          exec: () => Promise.resolve([this.user])
        };
        this.findStub = sinon
          .stub(this.user.model('Users'), 'find').returns(findMock);
        try {
          const foundUsers = await this.user.getIsEmailDuplicated();
          expect(this.findStub.calledWith({ email: this.user.email })).to.be.equal(true);
          expect(this.findStub.calledOnce).to.be.equal(true);
          expect(foundUsers.email).to.be.equal(this.user.email);
          expect(foundUsers.password).to.be.equal(this.user.password);
        } catch (error) {
          throw error;
        }
      });

      afterEach('Restore stubs', function () {
        this.findStub.restore();
      });
    });
  });
});
