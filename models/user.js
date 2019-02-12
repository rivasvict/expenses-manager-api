const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  email: String,
  lastName: String,
  password: String
});

userSchema.methods.create = function () {
  return 'test';
};

class User {
  constructor() {
    this.model = mongoose.model('User', userSchema);
  }
}

module.exports = User;
