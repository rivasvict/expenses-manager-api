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
    console.log('yao');
    try {
      const isEmailDuplicated = await this.getIsEmailDuplicated();
      if (isEmailDuplicated) {
        throw new Error('Dupplicated user');
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
      const doesUserExist = await this.model('Users').find({ email: this.email });
      return doesUserExist.length;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
