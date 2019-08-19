const { mongoose, expenseSchema } = require('../db/schemas/expense/');
const constants = require('../constants');
const { getDbModel } = require('../lib/db-helper');

const DbExpense = getDbModel({
  db: mongoose,
  modelName: constants.MODEL_NAMES.EXPENSE,
  schema: expenseSchema
});

class Expense extends DbExpense {
  constructor(expense) {
    super(expense);
    const validationError = this.validateSync();
    if (validationError) {
      throw validationError;
    }
  }

  async create() {
    try {
      const newExpense = await this.save();
      return newExpense;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Expense;
