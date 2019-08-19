const mongoose = require('mongoose');

const expense = {
  ammount: { type: Number, required: true },
  description: { type: String, required: false },
  date: { type: String, required: true }
};

const { Schema } = mongoose;
const expenseSchema = new Schema(expense);
module.exports = { mongoose, expenseSchema };
