const jwt = require('jsonwebtoken');
const _ = require('lodash');

const user = require('./user.js');
const config = require('../../../config.js');
const cache = require('./cache.js');

const getToken = ({ payload, tokenGenerationOptions = {} }) => jwt
  .sign(payload, config.SECRET, tokenGenerationOptions);

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
      payload: _.omit(loggedUser.toJSON(), ['password']),
      tokenGenerationOptions: {
        expiresIn: config.EXPIRATION_TIME_FOR_WEB_TOKEN
      }
    });
  } catch (error) {
    throw error;
  }
};

const verifyToken = payload => jwt.verify(payload, config.SECRET);

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

const isTokenInvalidated = async (bearer) => {
  try {
    const token = bearer.split(' ')[1];
    const isTokenInBlacklist = await cache.isMemberOfSet({
      setName: config.sets.INVALID_USER_TOKEN_SET, member: token
    });
    const tokenIsInBlacklist = isTokenInBlacklist === 1;
    return tokenIsInBlacklist || false;
  } catch (error) {
    throw error;
  }
};

const authenticationModule = {
  verifyAuthenticUser,
  getToken,
  verifyToken,
  passportVerify,
  isTokenInvalidated
};

module.exports = authenticationModule;
