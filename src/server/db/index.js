const mongoose = require('mongoose');
const config = require('../../../config.js');

const isDebugEnabled = config.DEBUG;
const dbCredentials = `${config.DB_USER}:${config.DB_PASSWORD}@`;
const dbTestCredentials = `${config.DB_TEST_USER}:${config.DB_TEST_PASSWORD}@`;
const authenticatedMongoUrl = isDebugEnabled ? dbTestCredentials : dbCredentials;
const dbServer = isDebugEnabled ? config.DB_TEST_SERVER : config.DB_SERVER;
const dbPort = isDebugEnabled ? config.DB_TEST_PORT : config.DB_PORT;
const dbName = isDebugEnabled ? config.DB_TEST_NAME : config.DB_NAME;

const initialize = async () => {
  try {
    const dbUrl = `mongodb://${authenticatedMongoUrl}${dbServer}:${dbPort}/${dbName}`;

    await mongoose.connect(dbUrl, {
      useNewUrlParser: true
    });

    console.log('Mongo Connected!');
  } catch (error) {
    throw error;
  }
};

module.exports = { initialize };
