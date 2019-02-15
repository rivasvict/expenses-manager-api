const { mongoose, userSchema } = require('../db/schemas/user.js');

const DbUser = mongoose.model('Users', userSchema);
class User extends DbUser {
  async create() {
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
  }

  async getIsEmailDuplicated() {
    try {
      const doesUserExist = await this.model('Users').find({ email: this.email });
      return doesUserExist.length;
    } catch (error) {
      throw error;
    }
  }

  _createPassword() {
    console.log('bad!');
  }
}

module.exports = User;
