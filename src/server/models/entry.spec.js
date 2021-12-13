const { expect } = require('chai');
const sinon = require('sinon');
const constants = require('../constants');

const Entry = require('./entry');

describe('Entry model', function () {
  before('Make the factory of an entry instance available to the whole test suite for entries', function () {
    this.getEntryInstance = entry => new Entry(entry);
  });

  describe('entry.create', function () {
    beforeEach('Define entry to be created', function () {
      this.entry = {
        amount: 12.3,
        account_id: 'rwtretgwe2',
        description: 'A simple test description',
        date: new Date(),
        categories_path: ',House,',
        type: 'expense'
      };
      this.entryInstance = this.getEntryInstance(this.entry);
      this.entryToResolve = Object
        .assign(Object.create(this.entry), { id: this.entryInstance.id });

      this.stubbedSave = sinon.stub(this.entryInstance, 'save').returns(Promise.resolve(this.entryToResolve));
    });

    afterEach('Restore save stub', function () {
      this.stubbedSave.restore();
    });

    it('Should create a new entry when data for the entry is valid', async function () {
      try {
        const savedEntry = await this.entryInstance.create();
        expect(savedEntry.errors).to.be.equal(undefined);
        expect(savedEntry.amount).to.be.equal(this.entryInstance.amount);
        expect(savedEntry.description).to.be.equal(this.entryInstance.description);
        expect(savedEntry.date).to.be.equal(this.entryInstance.date);
        expect(savedEntry.id).to.be.equal(this.entryInstance.id);
        expect(savedEntry.categories_path).to.be.equal(this.entryInstance.categories_path);
        expect(savedEntry.type).to.be.equal(this.entryInstance.type);
      } catch (error) {
        throw error;
      }
    });
  });

  describe('Get entries', function () {
    describe('Get entries by account id', function () {
      beforeEach('Stub the find method of the entries model', function () {
        this.execFake = sinon.fake();
        this.sortFake = sinon.fake.returns({
          exec: this.execFake
        });
        this.findEntriesStub = sinon.stub(Entry.model(constants.MODEL_NAMES.ENTRY), 'find').returns({
          sort: this.sortFake
        });
        this.accountId = '322345';
      });

      afterEach('Clean the find method', function () {
        this.findEntriesStub.restore();
      });

      it('Should call the find method with the right account account id', async function () {
        await Entry.getEntriesByAccountId(this.accountId);
        const calledWith = this.findEntriesStub.args[0][0];
        expect(calledWith.account_id === this.accountId).to.be.equals(true);
      });

      it('Shold call the sort method after the find method to get the result sorted by date', async function () {
        await Entry.getEntriesByAccountId(this.accountId);
        const calledWith = this.sortFake.args[0][0];
        expect(calledWith.date === 'ascending').to.be.equals(true);
      });

      it('Should call the find method only once', async function () {
        await Entry.getEntriesByAccountId(this.accountId);
        expect(this.findEntriesStub.calledOnce).to.be.equals(true);
      });

      it('Should throw an error when no account id is present in the call', async function () {
        try {
          await Entry.getEntriesByAccountId();
        } catch (error) {
          expect(error.message).to.be.equals('Missing accountId argument');
        }
      });
    });
  });

  describe('Set ISODate from unix timestamp', function () {
    beforeEach('Get the entry object', function () {
      this.entry = {
        amount: 12.3,
        account_id: 'rwtretgwe2',
        description: 'A simple test description',
        date: 1596502849000,
        categories_path: ',House,',
        type: 'expense'
      };
      this.entryInstance = this.getEntryInstance(this.entry);
    });

    it('Should set an ISODate to the date attribute of the entry from an unix timestamp', function () {
      expect(this.entryInstance.date.getDate()).to.be.equals(3);
      expect(this.entryInstance.date.getMonth()).to.be.equals(7);
      expect(this.entryInstance.date.getUTCFullYear()).to.be.equals(2020);
    });
  });
});
