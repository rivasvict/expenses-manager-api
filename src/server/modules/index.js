const _ = require('lodash');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;

const config = require('../../../config');
const constants = require('../constants');

const AccountModule = require('./account');
const CacheModule = require('./cache.js');
const AuthenticationModule = require('./authentication');
const UserModule = require('./user');
const PassportHandlerModule = require('./passportHandlers');
const EntryModule = require('./entry');

const User = require('../models/user');
const Entry = require('../models/entry');
const Account = require('../models/account');

const cacheClient = new Redis({
  port: parseInt(config.REDIS_PORT, 10),
  host: config.REDIS_SERVER,
  password: config.REDIS_PASSWORD,
  user: config.REDIS_USER
});

const accountModule = AccountModule();
const cacheModule = CacheModule({ cacheClient });
const userModule = UserModule({ User, _, Account });
const authenticationModule = AuthenticationModule({ config, cacheModule, userModule, _, jwt });
const passportHandlerModule = PassportHandlerModule({
  passport,
  config,
  JwtStrategy,
  authenticationModule,
  constants
});
const entryModule = EntryModule({ Entry });

module.exports = {
  accountModule,
  authenticationModule,
  cacheModule,
  passportHandlerModule,
  userModule,
  entryModule
};
