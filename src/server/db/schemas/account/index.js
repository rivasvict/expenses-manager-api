const mongoose = require('mongoose');

const constants = require('../../../constants');

const account = {
  name: { type: String, required: true },
  currency: {
    type: String,
    required: true,
    enum: constants.CURRENCIES
  },
  description: { type: String, required: false },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }]
};

const { Schema } = mongoose;
const accountSchema = new Schema(account);
module.exports = { mongoose, accountSchema };
