const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  email: String,
  lastName: String,
  password: String
});

userSchema.methods.create = function () {
  if (this.isEmailDuplicated()) {
    // this.save();
    console.log('holiii');
  }
};

userSchema.methods.isEmailDuplicated = async function () {
  const doesUserExist = await this.model('Accounts').find({ email: this.email });
  console.log(doesUserExist);
  // return doesUserExist ? true : false;
};

const User = mongoose.model('Accounts', userSchema);

module.exports = User;
