const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  email: String,
  lastName: String,
  password: String
});
