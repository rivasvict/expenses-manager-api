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

const verifyToken = payload => {
  try {
    return jwt.verify(payload, config.SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return null;
    } else {
      throw error;
    }
  }
};

const passportVerify = (jwtPayload, done) => {
  debugger;
  try {
    if (jwtPayload) {
      return done(null, jwtPayload);
    }

    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const getTokenOutOfBearer = bearer => bearer.split(' ')[1];

const isTokenInvalidated = async (bearer) => {
  try {
    const token = getTokenOutOfBearer(bearer);
    const isTokenInBlacklist = await cache.isMemberOfSet({
      setName: config.sets.INVALID_USER_TOKEN_SET, member: token
    });
    const tokenIsInBlacklist = isTokenInBlacklist === 1;
    return tokenIsInBlacklist || false;
  } catch (error) {
    throw error;
  }
};

const getInvalidTokensFromBlackList = async () => {
  try {
    const allTokensInBlackList = await cache.getAllMembersOfSet(config.sets.INVALID_USER_TOKEN_SET);
    return allTokensInBlackList.filter(tokenInBlackList => verifyToken(tokenInBlackList) === null);
  } catch (error) {
    throw error;
  }
};

const removeInvalidTokensFromBlackList = async () => {
  try {
    const invalidTokensFromBlackList = await getInvalidTokensFromBlackList();
    await cache.removeMembersFromSet(invalidTokensFromBlackList);
  } catch (error) {
    throw error;
  }
};

const invalidateToken = userToken => cache.addToSet({
  setName: config.sets.INVALID_USER_TOKEN_SET, members: [userToken]
});

const authenticationModule = {
  verifyAuthenticUser,
  getToken,
  verifyToken,
  passportVerify,
  isTokenInvalidated,
  removeInvalidTokensFromBlackList,
  invalidateToken
};

module.exports = authenticationModule;
