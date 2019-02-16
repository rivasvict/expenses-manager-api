const mongoose = require('mongoose');

const user = {
  firstName: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  lastName: { type: String, required: true },
  password: { type: String, required: true }
};

const { Schema } = mongoose;
const userSchema = new Schema(user);
module.exports = { mongoose, userSchema };
