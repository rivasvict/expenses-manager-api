require('dotenv').config();
const jwt = require('jsonwebtoken');

const user = require('./user.js');

const getToken = ({ payload, tokenGenerationOptions = {} }) => jwt
  .sign(payload, process.env.SECRET, tokenGenerationOptions);

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

const passportVerify = (jwtPayload, done) => {
  try {
    if (jwtPayload) {
      return done(null, jwtPayload);
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
