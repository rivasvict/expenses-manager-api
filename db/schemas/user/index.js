const mongoose = require('mongoose');

/*
 * TODO: Check the schema declaration for the whole schema.
 * also check that email ducplication function is needed after
 * index unique is used here
 */

const user = {
  firstName: String,
  email: { type: String, required: true, index: { unique: true } },
  lastName: String,
  password: String
};

const { Schema } = mongoose;
const userSchema = new Schema(user);
module.exports = { mongoose, userSchema };
