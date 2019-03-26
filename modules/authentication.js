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
      payload: loggedUser,
      tokenGenerationOptions: {
        expiresIn: '2h'
      }
    });
  } catch (error) {
    throw error;
  }
};

const verifyToken = payload => jwt.verify(payload, process.env.SECRET);

const authenticationModule = { verifyAuthenticUser, getToken, verifyToken };

module.exports = authenticationModule;
