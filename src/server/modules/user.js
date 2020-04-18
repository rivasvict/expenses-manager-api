const { comparePassword } = require('../db/schemas/user/utils');

const RemovePassword = _ => removeFrom => _.omit(removeFrom, 'password');

// TODO: This needs to be moved into a helper
const GetError = _ => error => {
  if ((error.name === 'ValidationError') && (error.errors)) {
    const validationErrorContent = _.values(error.errors).map(singleError => _.pick(singleError, ['message', 'path']));
    const validationError = { ..._.omit(error, 'errors'), validation: validationErrorContent, message: 'Invalid data' };

    return validationError;
  }

  return error;
};

const signUp = ({ User, getError, removePassword }) => async (userToCreate) => {
  try {
    const user = new User(userToCreate);
    const userOnDb = await user.create();
    return removePassword(userOnDb.toJSON());
  } catch (error) {
    throw getError(error);
  }
};

const authenticateUser = ({ User, removePassword }) => async ({ email, password }) => {
  try {
    const user = await User.getByEmailWithPassword({ email });
    if (user && user.get('email') === email) {
      const areCredentialsCorrect = await comparePassword({
        password, hashedPassword: user.get('password')
      });
      if (areCredentialsCorrect) {
        const userWithoutPassword = removePassword(user);
        return userWithoutPassword;
      }
    }

    return null;
  } catch (error) {
    throw error;
  }
};

const getUser = ({ User, removePassword }) => async (email) => {
  try {
    const foundUser = await User.getByEmail({ email });
    return removePassword(foundUser);
  } catch (error) {
    throw error;
  }
};

module.exports = ({ User, _ }) => {
  // TODO: This should be loaded form a helper
  const getError = GetError(_);
  const removePassword = RemovePassword(_);

  return {
    signUp: signUp({ User, getError, removePassword }),
    authenticateUser: authenticateUser({ User, removePassword }),
    getUser: getUser({ User, removePassword })
  };
};
