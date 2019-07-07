const { mongoose, userSchema } = require('../db/schemas/user/');
const {
  addPasswordEncryptionPreSaveHook
} = require('../db/schemas/user/utils.js');

addPasswordEncryptionPreSaveHook({ schema: userSchema, fieldToHash: 'password' });
const existingUserModel = mongoose && mongoose.models && mongoose.models.Users;
const DbUser = existingUserModel || mongoose.model('Users', userSchema);
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
      const foundUsers = await User.getByEmail({ email: this.email });
      return foundUsers;
    } catch (error) {
      throw error;
    }
  }

  static async getByEmail({ email }) {
    try {
      const foundUsers = await this.model('Users').find({ email }).exec();
      return foundUsers.find(foundUser => foundUser.email === email);
    } catch (error) {
      throw error;
    }
  }

  async updateRecord(selector, update) {
    try {
      return this.updateOne(selector, update).query();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;