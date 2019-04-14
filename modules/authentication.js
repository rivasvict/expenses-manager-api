require('dotenv').config();
const jwt = require('jsonwebtoken');

const user = require('./user.js');
const userModule = require('../modules/user.js');

const getToken = ({ payload, tokenGenerationOptions = {} }) => {
  return jwt
    .sign(payload, process.env.SECRET, tokenGenerationOptions)
};

const verifyAuthenticUser = async (username, password) => {
  try {
    const loggedUser = await user.authenticateUser({
      password,
      email: username
    });

    if (!loggedUser) {
      return null;
    }

    return getToken({
      payload: loggedUser.toJSON(),
      tokenGenerationOptions: {
        expiresIn: '2h'
      }
    });
  } catch (error) {
    throw error;
  }
};

const verifyToken = payload => jwt.verify(payload, process.env.SECRET);

const passportVerify = async (jwtPayload, done) => {
  const { username, password } = jwtPayload;
  try {
    const authenticUser = await userModule.authenticateUser({
      password,
      email: username
    });

    if (authenticUser) {
      return done(null, authenticUser);
    }

    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const authenticationModule = {
  verifyAuthenticUser,
  getToken,
  verifyToken,
  passportVerify
};

module.exports = authenticationModule;
