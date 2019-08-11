const { mongoose, accountSchema } = require('../db/schemas/account/');
const constants = require('../constants');

const existingAccountModel = mongoose && mongoose.models && mongoose.models.Account;
const DbAccount = existingAccountModel || mongoose.model(constants.MODEL_NAMES.ACCOUNT, accountSchema);
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
}

module.exports = Account;
