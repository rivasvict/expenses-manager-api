const { mongoose, userSchema } = require('../db/schemas/user/');
const { addPasswordEncryptionPreSaveHook } = require('../db/schemas/user/utils.js');

addPasswordEncryptionPreSaveHook({ schema: userSchema, fieldToHash: 'password' });
const DbUser = mongoose.model('Users', userSchema);
class User extends DbUser {
  constructor(user) {
    super(user);
    const validationError = this.validateSync();
    if (validationError) {
      throw validationError;
    }
  }

  async create() {
    try {
      const isEmailDuplicated = await this.getIsEmailDuplicated();
      if (isEmailDuplicated) {
        throw new Error('Duplicated user');
      } else {
        const newUser = await this.save();
        return newUser;
      }
    } catch (error) {
      throw error;
    }
  }

  async getIsEmailDuplicated() {
    try {
      const foundUsers = await this.model('Users').find({ email: this.email });
      return foundUsers.length;
    } catch (error) {
      throw error;
    }
  }

  static async authenticate() {
    try {
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
