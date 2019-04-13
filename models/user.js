const { mongoose, userSchema } = require('../db/schemas/user/');
const {
  addPasswordEncryptionPreSaveHook,
  comparePassword
} = require('../db/schemas/user/utils.js');
const { getObjectCopyWithoutKey } = require('../lib/util.js');

addPasswordEncryptionPreSaveHook({ schema: userSchema, fieldToHash: 'password' });
const DbUser = (mongoose && mongoose.models && mongoose.models.Users) || mongoose.model('Users', userSchema);
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

  static async authenticate({ email, password }) {
    try {
      const user = await this.getByEmail({ email });
      if (user && user.get('email') === email) {
        const areCredentialsCorrect = await comparePassword({
          password, hashedPassword: user.get('password')
        });
        if (areCredentialsCorrect) {
          const userWithoutPassword = getObjectCopyWithoutKey({ obj: user, keyToRemove: 'password' });
          return userWithoutPassword;
        }
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
