const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const config = require('../../../config.js');
const authenticationModule = require('./authentication.js');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.SECRET
};

passport.use(new JwtStrategy(jwtOptions, authenticationModule.passportVerify));

const isAuthorized = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    const isTokenInBlackList = await authenticationModule.isTokenInvalidated(bearer);
    if (isTokenInBlackList) {
      res.status(403).json({ message: 'Session expired' });
    } else {
      passportHandlers.passport.authenticate('jwt', {
        session: false
      })(req, res, next);
    }
  } catch (error) {
    throw error;
  }
};

const passportHandlers = { passport, isAuthorized };

module.exports = passportHandlers;
