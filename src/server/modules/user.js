const { comparePassword } = require('../db/schemas/user/utils');

const signUp = ({ User }) => async (userToCreate) => {
  try {
    const user = new User(userToCreate);
    return await user.create();
  } catch (error) {
    throw error;
  }
};

const authenticateUser = ({ User, _ }) => async ({ email, password }) => {
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

module.exports = ({ User, _ }) => {
  return {
    signUp: signUp({ User }),
    authenticateUser: authenticateUser({ User, _ })
  };
};
