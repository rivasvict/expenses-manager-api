const mongoose = require('mongoose');

const user = {
  firstName: String,
  email: String,
  lastName: String,
  password: String
};

const { Schema } = mongoose;
const userSchema = new Schema(user);
module.exports = { mongoose, userSchema };
