const { expect } = require('chai');
const sinon = require('sinon');

const Expense = require('./expense');

describe('Expense module', function () {
  describe('expense.create', function () {
    beforeEach('Define expense to be created', function () {
      const getExpenseInstance = expenseToInstance => new Expense(expenseToInstance);
      this.expense = {
        ammount: 12.3,
        description: 'A simple test description',
        date: new Date().toUTCString()
      };
      this.expenseInstance = getExpenseInstance(this.expense);
      this.expenseToResolve = Object
        .assign(Object.create(this.expense), { id: this.expenseInstance.id });

      this.stubbedSave = sinon.stub(this.expenseInstance, 'save').returns(Promise.resolve(this.expenseToResolve));
    });

    afterEach('Restore save stub', function () {
      this.stubbedSave.restore();
    });

    it('Should create a new expense when data for the expense is valid', async function () {
      try {
        const savedExpense = await this.expenseInstance.create();
        expect(savedExpense.errors).to.be.equal(undefined);
        expect(savedExpense.ammount).to.be.equal(this.expenseInstance.ammount);
        expect(savedExpense.description).to.be.equal(this.expenseInstance.description);
        expect(savedExpense.date).to.be.equal(this.expenseInstance.date);
        expect(savedExpense.id).to.be.equal(this.expenseInstance.id);
      } catch (error) {
        throw error;
      }
    });
  });
});
