const sinon = require('sinon');
const { expect } = require('chai');

const EntryModule = require('./entry');
const Entry = require('../models/entry');
const constants = require('../constants');

const [INCOME_NAME] = constants.ENTRY_TYPES;

describe('Entry Module', function () {
  describe('Add an entry', function () {
    beforeEach('Prepare an entry to be added', function () {
      const entryTestContainer = {
        Entry
      };

      this.spiedEntryConstructor = sinon.spy(entryTestContainer, 'Entry');
      this.entryModule = EntryModule({ Entry: entryTestContainer.Entry });
      this.entry = {
        ammount: 15,
        account_id: '214131',
        type: INCOME_NAME,
        description: 'Great income',
        categories_path: ',Work,',
        // TODO: Check better ESLINT rules for this non-constructor usage error
        date: new Date
      };
      this.createEntryStub = sinon.stub(Entry.prototype, 'create').returns(Promise.resolve());
    });

    afterEach('Reset the mocks and stubs', function () {
      this.createEntryStub.restore();
      this.spiedEntryConstructor.restore();
    });

    it('Should instance the Entry constructor with the right entry parameters', async function () {
      await this.entryModule.addEntry(this.entry);
      expect(this.spiedEntryConstructor.calledWith(this.entry)).to.be.equals(true);
    });

    it('Should call the add method only once', async function () {
      await this.entryModule.addEntry(this.entry);
      expect(this.createEntryStub.calledOnce).to.be.equals(true);
    });
  });

  describe('Get expenses based on an account', function () {
    beforeEach('Stub getEntriesByAccountId method FROM THE ENTRIES MODEL', function () {
      this.entryModule = EntryModule({ Entry });
      this.getEntriesByAccountStub = sinon.stub(Entry, 'getEntriesByAccountId').returns(Promise.resolve());
      this.accountId = '2223214';
    });

    afterEach('Restore the stubs of the Entry model', function () {
      this.getEntriesByAccountStub.restore();
    });

    it('Should call the getEntriesByAccountId of the MODEL at least once', async function () {
      await this.entryModule.getEntriesByAccountId(this.accountId);
      expect(this.getEntriesByAccountStub.calledOnce).to.be.equals(true);
    });

    it('Should call the getEntriesByAccountId with the right arguments', async function () {
      await this.entryModule.getEntriesByAccountId(this.accountId);
      expect(this.getEntriesByAccountStub.calledWith(this.accountId)).to.be.equals(true);
    });
  });
});
