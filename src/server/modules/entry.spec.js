const sinon = require('sinon');
const { expect } = require('chai');

const EntryModule = require('./entry');
const Entry = require('../models/entry');
const constants = require('../constants');

const [INCOME_NAME] = constants.ENTRY_TYPES;

describe('Entry Module', function () {
  before('Spy on the entry model constructor using a test container object', function () {
    const entryTestContainer = {
      Entry
    };

    this.spiedEntryConstructor = sinon.spy(entryTestContainer, 'Entry');
    this.entryModule = EntryModule({ Entry: entryTestContainer.Entry });
  });

  describe('Add an entry', function () {
    beforeEach('Prepare an entry to be added', function () {
      this.entry = {
        ammount: 15,
        account: '214131',
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

  describe.skip('Get expenses based on an account', function () {
    beforeEach('Stub getEntriesByAccountId method FROM THE ENTRIES MODEL', function () {
      this.getEntriesByAccountStub = sinon.stub(Entry.prototype, 'getEntriesByAccountId').returns(Promise.resolve());
    });

    it('Should call the getEntriesByAccountId of the MODEL at least once', async function () {
      await this.entryModule.getEntriesByAccountId('452522');
      expect(this.getEntriesByAccountStub.calledOnce).to.be.equals(true);
    });

    it('Should call the getEntriesByAccountId with the right arguments');
  });
});
