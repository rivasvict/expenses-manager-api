const mongoose = require('mongoose');

const constants = require('../../../constants');

const [INCOME, EXPENSE] = constants.ENTRY_TYPES;

const account = {
  name: { type: String, required: false },
  currency: {
    type: String,
    required: true,
    enum: constants.CURRENCIES
  },
  description: { type: String, required: false },
  default: { type: Boolean, required: false },
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: constants.MODEL_NAMES.ENTRY,
    default: INCOME
  }],
  incomes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: constants.MODEL_NAMES.ENTRY,
    default: EXPENSE
  }]
};

const { Schema } = mongoose;
const accountSchema = new Schema(account);
module.exports = { mongoose, accountSchema };
