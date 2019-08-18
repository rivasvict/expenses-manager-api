const mongoose = require('mongoose');

const constants = require('../../../constants');

const category = {
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: constants.CATEGOTY_TYPES
  },
  creation: {
    type: Date,
    required: true
  },
  description: { type: String, required: false },
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  }]
};

const { Schema } = mongoose;
const categorySchema = new Schema(category);
module.exports = { mongoose, categorySchema };
