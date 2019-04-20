const _ = require('lodash');

const User = require('../models/user.js');
const { comparePassword } = require('../db/schemas/user/utils.js');

const signUp = async (userToCreate) => {
  try {
    const user = new User(userToCreate);
    return await user.create();
  } catch (error) {
    throw error;
  }
};

const authenticateUser = async ({ email, password }) => {
  try {
    const user = await User.getByEmail({ email });
    if (user && user.get('email') === email) {
      const areCredentialsCorrect = await comparePassword({
        password, hashedPassword: user.get('password')
      });
      if (areCredentialsCorrect) {
        const userWithoutPassword = _.omit(user, ['password']);
        return userWithoutPassword;
      }
    }

    return null;
  } catch (error) {
    throw error;
  }
};

const setTokenForUser = async (user, token) => {
  try {
    await user.updateRecord({ email: user.email }, { userToken: token });
  } catch (error) {
    throw error;
  }
};

module.exports = { signUp, authenticateUser };
