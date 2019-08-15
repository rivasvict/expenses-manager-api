const { expect } = require('chai');
const sinon = require('sinon');

const Account = require('./account');

describe('Account module', function () {
  describe('Instance account with validation', function () {
    beforeEach('Prepare invalid account data', function () {
      this.accountWithInvalidNameType = {
        name: [],
        description: 'Test',
        currency: 'CAD'
      };

      this.accountWithInvalidDescriptionType = {
        name: 'adsfa',
        description: [],
        currency: 'CAD'
      };

      this.accountWithMissingAtributes = {
        test: 'test',
        description: 'test'
      };

      this.accountWithValidData = {
        name: 'adsfa',
        description: 'a test',
        currency: 'CAD'
      };
    });

    describe('Data type errors', function () {
      it('Should throw an error when invalid name data type', function () {
        try {
          const account = new Account(this.accountWithInvalidNameType);
        } catch (error) {
          expect(error.message).to.be.equal('Validation failed: name: Path `name` is required.');
        }
      });

      describe('Currency data validation errors', function () {
        beforeEach('Prepare currency invalid values', function () {
          this.accountWithInvalidCurrencyType = {
            name: 'test',
            description: 'Test',
            currency: []
          };

          this.accountWithInvalidCurrencyValue = {
            name: 'test',
            description: 'Test',
            currency: 'test'
          };
        });

        it('Should throw an error when invalid currency data type', function () {
          try {
            const account = new Account(this.accountWithInvalidCurrencyType);
          } catch (error) {
            expect(error.message).to.be.equal('Validation failed: currency: Path `currency` is required.');
          }
        });

        it('Should throw an error when invalid currency value used', function () {
          try {
            const account = new Account(this.accountWithInvalidCurrencyValue);
          } catch (error) {
            expect(error.message).to.be
              .equal('Validation failed: currency: `test` is not a valid enum value for path `currency`.');
          }
        });
      });

      it('Should throw an error when invalid description data type', function () {
        try {
          const account = new Account(this.accountWithInvalidDescriptionType);
        } catch (error) {
          expect(error.message).to.be.equal('Validation failed: description: Path `description` is required.');
        }
      });
    });

    it('Should throw an error when missing attributes', function () {
      try {
        const account = new Account(this.accountWithMissingAtributes);
      } catch (error) {
        expect(error.message)
          .to.be.equal('Validation failed: currency: Path `currency` is required., name: Path `name` is required.');
      }
    });

    it('Should create a new account object when valid data is passed', function() {
      try {
        const account = new Account(this.accountWithValidData);
        expect(account.errors).to.be.equal(undefined);
        expect(account.currency).to.be.equal(this.accountWithValidData.currency);
        expect(account.name).to.be.equal(this.accountWithValidData.name);
        expect(account.description).to.be.equal(this.accountWithValidData.description);
        expect(account.id).not.to.equal(undefined);
        expect(account.id).not.to.equal('');
      } catch (error) {
        throw error;
      }
    });
  });

  describe('account.create', function () {
    beforeEach('Define account to be created', function () {
      this.account = new Account({
        name: 'Test account',
        description: 'A simple description',
        currency: 'USD'
      });

      this.stubbedSave = sinon.stub(this.account, 'save').returns(Promise.resolve(this.account));
    });

    afterEach('Restore save stub', function () {
      this.stubbedSave.restore();
    });

    it('Should create a new account when data for the account is valid', async function () {
      try {
        const savedAccount = await this.account.create();
        expect(savedAccount.errors).to.be.equal(undefined);
        expect(savedAccount.currency).to.be.equal(this.account.currency);
        expect(savedAccount.name).to.be.equal(this.account.name);
        expect(savedAccount.description).to.be.equal(this.account.description);
        expect(savedAccount.id).not.to.equal(undefined);
        expect(savedAccount.id).not.to.equal('');
      } catch (error) {
        throw error;
      }
    });
  });
});
