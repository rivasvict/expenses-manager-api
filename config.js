require('dotenv').config();

const environment = process.env;

const isIntegration = environment.INTEGRATION_TEST;
module.exports = {
  EXPIRATION_TIME_FOR_WEB_TOKEN: environment.EXPIRATION_TIME_FOR_WEB_TOKEN || '2h',
  NODE_ENV: environment.NODE_ENV || 'development',
  PORT: environment.PORT || '3000',
  SALT_DEFAULT_WORK_FACTOR: environment.SALT_DEFAULT_WORK_FACTOR || '10',
  SECRET: environment.SECRET || 'defaultsecret',
  DEBUG: environment.DEBUG,
  DB_USER: isIntegration ? environment.DB_TEST_USER : environment.DB_USER,
  DB_PASSWORD: isIntegration ? environment.DB_TEST_PASSWORD : environment.DB_PASSWORD,
  DB_SERVER: isIntegration ? environment.DB_TEST_SERVER : environment.DB_SERVER,
  DB_PORT: isIntegration ? environment.DB_TEST_PORT : environment.DB_PORT,
  DB_NAME: isIntegration ? environment.DB_TEST_NAME : environment.DB_NAME,
  REDIS_SERVER: isIntegration ? environment.HOST : environment.REDIS_SERVER || '0.0.0.0',
  REDIS_PORT: isIntegration ? environment.REDIS_TEST_PORT : environment.REDIS_PORT || '6379',
  sets: {
    INVALID_USER_TOKEN_SET: 'invalidUserTokenSet'
  }
};
