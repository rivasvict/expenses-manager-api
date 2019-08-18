const { mongoose, categorySchema } = require('../db/schemas/category/');
const constants = require('../constants');
const { getDbModel } = require('../lib/db-helper');

const DbCategory = getDbModel({
  db: mongoose,
  modelName: constants.MODEL_NAMES.CATEGORY,
  schema: categorySchema
});

class Category extends DbCategory {
  constructor(category) {
    super(category);
    const validationError = this.validateSync();
    if (validationError) {
      throw validationError;
    }
  }

  async create() {
    try {
      const newCategory = await this.save();
      return newCategory;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Category;
