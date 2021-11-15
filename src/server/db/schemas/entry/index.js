const mongoose = require('mongoose');

const entry = {
  ammount: { type: Number, required: true },
  description: { type: String, required: false },
  date: { type: String, required: true }
};

const { Schema } = mongoose;
const entrySchema = new Schema(entry);
module.exports = { mongoose, entrySchema };
