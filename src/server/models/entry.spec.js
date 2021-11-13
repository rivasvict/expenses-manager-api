const { expect } = require('chai');
const sinon = require('sinon');

const Entry = require('./entry');

describe('Entry module', function () {
  describe('entry.create', function () {
    beforeEach('Define entry to be created', function () {
      const getEntryInstance = entryToInstance => new Entry(entryToInstance);
      this.entry = {
        ammount: 12.3,
        description: 'A simple test description',
        date: new Date().toUTCString()
      };
      this.entryInstance = getEntryInstance(this.entry);
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
      } catch (error) {
        throw error;
      }
    });
  });
});
