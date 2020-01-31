const getToken = ({ config, jwt }) => ({ payload, tokenGenerationOptions = {} }) => jwt
  .sign(payload, config.SECRET, tokenGenerationOptions);

const verifyAuthenticUser = ({ userModule, config, _, getAuthenticationToken }) => async (username, password) => {
  try {
    const loggedUser = await userModule.authenticateUser({
      password,
      email: username
    });

    if (!loggedUser) {
      return null;
    }

    const authenticUser = {
      token: getAuthenticationToken({
        payload: _.omit(loggedUser.toJSON(), ['password']),
        tokenGenerationOptions: {
          expiresIn: config.EXPIRATION_TIME_FOR_WEB_TOKEN
        }
      }),
      user: loggedUser
    };

    return authenticUser;
  } catch (error) {
    throw error;
  }
};

const verifyToken = ({ jwt, config }) => payload => {
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

const passportVerify = () => (jwtPayload, done) => {
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

const isTokenInvalidated = ({ cacheModule, config }) => async (bearer) => {
  try {
    const token = getTokenOutOfBearer(bearer);
    const isTokenInBlacklist = await cacheModule.isMemberOfSet({
      setName: config.sets.INVALID_USER_TOKEN_SET, member: token
    });
    const tokenIsInBlacklist = isTokenInBlacklist === 1;
    return tokenIsInBlacklist || false;
  } catch (error) {
    throw error;
  }
};

const getInvalidTokensFromBlackList = async ({ cacheModule, config, verifyAuthenticationToken }) => {
  try {
    const allTokensInBlackList = await cacheModule.getAllMembersOfSet(config.sets.INVALID_USER_TOKEN_SET);
    return allTokensInBlackList.filter(tokenInBlackList => verifyAuthenticationToken(tokenInBlackList) === null);
  } catch (error) {
    throw error;
  }
};

const removeInvalidTokensFromBlackList = ({ cacheModule, config, verifyAuthenticationToken }) => async () => {
  try {
    const invalidTokensFromBlackList = await getInvalidTokensFromBlackList({
      cacheModule,
      config,
      verifyAuthenticationToken
    });

    await cacheModule.removeMembersFromSet(invalidTokensFromBlackList);
  } catch (error) {
    throw error;
  }
};

const invalidateToken = ({ cacheModule, config }) => async bearer => {
  try {
    const userToken = getTokenOutOfBearer(bearer);
    await cacheModule.addToSet({
      setName: config.sets.INVALID_USER_TOKEN_SET, members: [userToken]
    });
  } catch (error) {
    throw error;
  }
};

const authenticationModule = ({ config, cacheModule, userModule, _, jwt }) => {
  const getAuthenticationToken = getToken({ config, jwt });
  const verifyAuthenticationToken = verifyToken({ jwt, config });

  return {
    verifyAuthenticUser: verifyAuthenticUser({ getAuthenticationToken, userModule, config, _ }),
    getToken: getAuthenticationToken,
    verifyToken: verifyAuthenticationToken,
    passportVerify: passportVerify(),
    isTokenInvalidated: isTokenInvalidated({ cacheModule, config }),
    removeInvalidTokensFromBlackList: removeInvalidTokensFromBlackList({
      cacheModule, config, verifyAuthenticationToken
    }),
    invalidateToken: invalidateToken({ cacheModule, config })
  };
};

module.exports = authenticationModule;
