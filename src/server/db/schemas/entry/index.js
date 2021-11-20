const mongoose = require('mongoose');
const constants = require('../../../constants');

const entry = {
  ammount: { type: Number, required: true },
  description: { type: String, required: false },
  date: { type: Date, required: false },
  categories_path: { type: String, required: true },
  type: { type: String, required: true, enum: constants.ENTRY_TYPES },
  account_id: { type: String, required: true }
};

const { Schema } = mongoose;
const entrySchema = new Schema(entry);
module.exports = { mongoose, entrySchema };
