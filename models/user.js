const { mongoose, userSchema } = require('../db/schemas/user/');
const { addPasswordEncryptionPreSaveHook } = require('../db/schemas/user/utils.js');
const { getParsedErrorFromDb } = require('../db/util/errorParser.js');

addPasswordEncryptionPreSaveHook({ schema: userSchema, fieldToHash: 'password' });
const DbUser = mongoose.model('Users', userSchema);
class User extends DbUser {
  async create() {
    try {
      await this.save();
      return 'Success';
    } catch (error) {
      const parsedError = getParsedErrorFromDb({ error, customFields: { duplicated: 'user' } });
      error.message = parsedError;
      throw error;
    }
  }
}

module.exports = User;
