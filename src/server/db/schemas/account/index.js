const mongoose = require('mongoose');

const account = {
  name: { type: String, required: true },
  currency: {
    type: String,
    required: true,
    enum: [
      'USD',
      'CAD'
    ]
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
