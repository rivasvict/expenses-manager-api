const { mongoose, accountSchema } = require('../db/schemas/account/');
const constants = require('../constants');
const { getDbModel } = require('../lib/db-helper');

const DbAccount = getDbModel({
  db: mongoose,
  modelName: constants.MODEL_NAMES.ACCOUNT,
  schema: accountSchema
});

class Account extends DbAccount {
  constructor(account) {
    super(account);
    const validationError = this.validateSync();
    if (validationError) {
      throw validationError;
    }
  }

  async create() {
    try {
      const newAccount = await this.save();
      return newAccount;
    } catch (error) {
      throw error;
    }
  }

  async addEntry({ entry }) {
    try {
      this[`${entry.type}s`].push(entry);
      return this.save();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Account;
