const user = require('./user.js');

const verifyLocal = async (username, password, done) => {
  try {
    const loggedUser = await user.authenticateUser({
      password,
      email: username
    });

    if (!loggedUser) {
      return done(null, false);
    }

    return done(null, loggedUser);
  } catch (error) {
    throw error;
  }
};

module.exports = { verifyLocal };
