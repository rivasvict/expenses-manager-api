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

module.exports = passport;
