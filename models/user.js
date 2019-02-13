const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  email: String,
  lastName: String,
  password: String
});

userSchema.methods.create = async function () {
  try {
    const isEmailDuplicated = await this.getIsEmailDuplicated();
    if (isEmailDuplicated) {
      throw new Error('Dupplicated user');
    } else {
      await this.save();
      return 'Success';
    }
  } catch (error) {
    throw error;
  }
};

userSchema.methods.getIsEmailDuplicated = async function () {
  try {
    const doesUserExist = await this.model('Users').find({ email: this.email });
    return doesUserExist.length;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('Users', userSchema);

module.exports = User;
