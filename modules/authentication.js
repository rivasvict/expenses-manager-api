require('dotenv').config()
const jwt = require('jsonwebtoken');

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

const getToken = ({ payload, tokenGenerationOptions = {} }) => jwt
  .sign(payload, process.env.SECRET, tokenGenerationOptions);

const verifyToken = (payload) => jwt.verify(payload, process.env.SECRET);

module.exports = { verifyLocal, getToken, verifyToken };
