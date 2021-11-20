const mongoose = require('mongoose');

const constants = require('../../../constants');

const account = {
  name: { type: String, required: false },
  currency: {
    type: String,
    required: true,
    enum: constants.CURRENCIES
  },
  description: { type: String, required: false },
  default: { type: Boolean, required: false }
};

const { Schema } = mongoose;
const accountSchema = new Schema(account);
module.exports = { mongoose, accountSchema };
