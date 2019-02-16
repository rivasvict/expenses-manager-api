const { mongoose, userSchema } = require('../db/schemas/user/');
const { addPasswordEncryptionPreSaveHook } = require('../db/schemas/user/utils.js');

addPasswordEncryptionPreSaveHook(userSchema);
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

  /*
   * TODO: Check if this function is still needed because of the change on schema
   * about the index unique attributes set
   */

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
