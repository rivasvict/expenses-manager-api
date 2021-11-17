const { expect } = require('chai');
const sinon = require('sinon');

const Account = require('./account');
const Entry = require('./entry');

describe('Account model', function () {
  beforeEach('Prepare getAccountInstance', function () {
    this.getAccountInstance = accountToInstance => new Account(accountToInstance);
    this.getEntryInstance = entryToInstance => new Entry(entryToInstance);
  });

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
          this.getAccountInstance(this.accountWithInvalidNameType);
        } catch (error) {
          expect(error.message).to.be.equal('Validation failed: name: Cast to string failed for value "[]" at path "name"');
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
            this.getAccountInstance(this.accountWithInvalidCurrencyType);
          } catch (error) {
            expect(error.message).to.be.equal('Validation failed: currency: Cast to string failed for value "[]" at path "currency"');
          }
        });

        it('Should throw an error when invalid currency value used', function () {
          try {
            this.getAccountInstance(this.accountWithInvalidCurrencyValue);
          } catch (error) {
            expect(error.message).to.be
              .equal('Validation failed: currency: `test` is not a valid enum value for path `currency`.');
          }
        });
      });

      it('Should throw an error when invalid description data type', function () {
        try {
          this.getAccountInstance(this.accountWithInvalidDescriptionType);
        } catch (error) {
          expect(error.message).to.be.equal('Validation failed: description: Cast to string failed for value "[]" at path "description"');
        }
      });
    });

    it('Should throw an error when missing attributes', function () {
      try {
        this.getAccountInstance(this.accountWithMissingAtributes);
      } catch (error) {
        expect(error.message)
          .to.be.equal('Validation failed: currency: Path `currency` is required.');
      }
    });

    it('Should create a new account object when valid data is passed', function () {
      try {
        const account = this.getAccountInstance(this.accountWithValidData);
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
      this.account = this.getAccountInstance({
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

  describe('account.addEntry', function () {
    describe.only('Save entries to the account', function () {
      beforeEach('Prepare to add an entry to an account', async function () {
        const mockedAccount = {
          ammount: 12.3,
          description: 'A simple test description',
          date: new Date(),
          categories_path: ',House,',
          type: 'expense',
          currency: 'CAD'
        };

        const account = this.getAccountInstance(mockedAccount);
        const spiedAccount = sinon.spy(account.expenses);
        this.saveAccountStub = sinon.stub(account, 'save').returns(Promise.resolve());

        const mockedEntry = {
          ammount: 12.3,
          description: 'A simple test description',
          date: new Date(),
          categories_path: ',House,',
          type: 'expense'
        };

        this.entry = this.getEntryInstance(mockedEntry);
        await account.addEntry({ entry: this.entry });
        this.spiedAccountPush = spiedAccount.push;
      });

      it('Should call the push function of the subdocument entry as an expense', function () {
        expect(this.spiedAccountPush.calledOnce).to.be.equals(true);
      });

      it('Should call the push function of the expenses with the right entry data', function () {
        expect(this.spiedAccountPush.calledWith(this.entry)).to.be.equals(true);
      });

      it('Should add an entry to an account', function () {
        expect(this.saveAccountStub.calledOnce).to.be.equals(true);
      });
      // TODO: Add the alternate path and non happy paths
    });
  });
});
