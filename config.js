require('dotenv').config();

const environment = process.env;

module.exports = {
  EXPIRATION_TIME_FOR_WEB_TOKEN: environment.EXPIRATION_TIME_FOR_WEB_TOKEN || '2h',
  NODE_ENV: environment.NODE_ENV || 'development',
  PORT: environment.PORT || '3000',
  SALT_DEFAULT_WORK_FACTOR: environment.SALT_DEFAULT_WORK_FACTOR || '10',
  SECRET: environment.SECRET || 'defaultsecret',
  DEBUG: environment.DEBUG,
  DB_USER: environment.DB_USER,
  DB_PASSWORD: environment.DB_PASSWORD,
  DB_TEST_USER: environment.DB_TEST_USER,
  DB_TEST_PASSWORD: environment.DB_TEST_PASSWORD,
  DB_TEST_SERVER: environment.DB_TEST_SERVER,
  DB_SERVER: environment.DB_SERVER,
  DB_TEST_PORT: environment.DB_TEST_PORT,
  DB_PORT: environment.DB_PORT,
  DB_TEST_NAME: environment.DB_TEST_NAME,
  DB_NAME: environment.DB_NAME
};
