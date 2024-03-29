const { mongoose, entrySchema } = require('../db/schemas/entry');
const constants = require('../constants');
const { getDbModel } = require('../lib/db-helper');

const DbEntry = getDbModel({
  db: mongoose,
  modelName: constants.MODEL_NAMES.ENTRY,
  schema: entrySchema
});

class Entry extends DbEntry {
  constructor(entry) {
    super(entry);
    const validationError = this.validateSync();
    if (validationError) {
      throw validationError;
    }
  }

  async create() {
    try {
      const newEntry = await this.save();
      return newEntry;
    } catch (error) {
      throw error;
    }
  }

  static async getEntriesByAccountId(accountId) {
    try {
      if (!accountId) {
        throw new Error('Missing accountId argument');
      }

      return this.model(constants.MODEL_NAMES.ENTRY)
        .find({ account_id: accountId })
        // TODO: Think of a better way to separate concerns
        // of finding and sorting
        .sort({ date: 'ascending' })
        .exec();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Entry;
