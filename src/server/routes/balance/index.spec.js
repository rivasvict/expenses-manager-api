const { expect } = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');
const constants = require('../../constants');
const Entry = require('../../models/entry');
const EntryModule = require('../../modules/entry');
const balanceRouter = rewire('./');

const [INCOME_NAME] = constants.ENTRY_TYPES;

describe('Balance route', function () {
  describe('Create a new entry', function () {
    beforeEach('Set the Entry module up for creating a new entry', function () {
      this.Entry = Entry;
      this.entryModule = EntryModule({ Entry: this.Entry });
      this.entry = {
        amount: 15,
        account_id: '214131',
        type: INCOME_NAME,
        description: 'Great income',
        categories_path: ',Work,',
        date: 1596502849
      };
      this.stubbedAddEntry = sinon.stub(this.entryModule, 'addEntry').returns(Promise.resolve(this.entry));
      this.addEntry = balanceRouter.__get__('addEntry')({ entryModule: this.entryModule });
    });

    afterEach('Restore stubs', function () {
      this.stubbedAddEntry.restore();
    });

    it('Should call the addEntry method of the Entry module at least once', async function () {
      this.addEntry({ body: this.entry }, { status: () => ({ json: () => {} }) });
      expect(this.stubbedAddEntry.calledOnce).to.be.equals(true);
    });

    it('Should call the addEntry method of the Entry module with the right entry', function () {
      this.addEntry({ body: this.entry }, { status: () => ({ json: () => {} }) });
      expect(this.stubbedAddEntry.calledWith(this.entry)).to.be.equals(true);
    });

    // TODO: WONT FIX IN HERE, The failing test is due to
    // The backend having a responsibility it should not
    // (extracting the account number in the route. This
    // Should be already processed and sent to the request
    // Of this endpoint
    it('Should call the status with 200 code', async function () {
      const statusFake = sinon.fake.returns({ json: () => {} });
      await this.addEntry({ body: this.entry }, { status: statusFake });
      expect(statusFake.calledOnce).to.be.equals(true);
      expect(statusFake.calledWith(200)).to.be.equals(true);
    });

    // TODO: WONT FIX IN HERE, The failing test is due to
    // The backend having a responsibility it should not
    // (extracting the account number in the route. This
    // Should be already processed and sent to the request
    // Of this endpoint
    it('Should call the json method at least once', async function () {
      const jsonFake = sinon.fake();
      await this.addEntry({ body: this.entry }, { status: () => ({ json: jsonFake }) });
      expect(jsonFake.calledOnce).to.be.equals(true);
    });
  });
});
