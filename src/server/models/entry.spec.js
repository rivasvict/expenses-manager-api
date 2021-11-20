const { expect } = require('chai');
const { entries } = require('lodash');
const sinon = require('sinon');

const Entry = require('./entry');

describe('Entry model', function () {
  before('Make the factory of an entry instance available to the whole test suite for entries', function () {
    this.getEntryInstance = entry => new Entry(entry);
  });

  describe('entry.create', function () {
    beforeEach('Define entry to be created', function () {
      this.entry = {
        ammount: 12.3,
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
        expect(savedEntry.ammount).to.be.equal(this.entryInstance.ammount);
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

  describe.only('Get entries', function () {
    describe('Get entries by account id', function () {
      beforeEach('Stub the find method of the entries model', function () {
        this.findEntriesStub = sinon.stub(Entry, 'find').returns(Promise.resolve());
        this.accountId = '322345';
      });

      afterEach('Clean the find method', function () {
        this.findEntriesStub.restore();
      });

      it('Should call the find method with the right arguments', async function () {
        await Entry.getEntriesByAccountId(this.accountId);
        // TODO: Review the Sinon documentation to improve the way
        // we get the account_id parameter from the funciton call
        const calledAccountId = this.findEntriesStub.args[0][0].account_id;
        expect(calledAccountId === this.accountId).to.be.equals(true);
      });

      it('Should call the find method only once', async function () {
        await Entry.getEntriesByAccountId(this.accountId);
        expect(this.findEntriesStub.calledOnce).to.be.equals(true);
      });

      it('Should throw an error when no account id is present in the call');
    });
  });
});
