const mongoose = require('mongoose');
const config = require('../../../config.js');
const dbHelper = require('../lib/db-helper.js');

const dbPrefix = config.DB_PREFIX;
const dbUser = config.DB_USER;
const dbPassword = config.DB_PASSWORD;
const dbServer = config.DB_SERVER;
const dbPort = config.DB_PORT;
const dbName = config.DB_NAME;
const dbConnectionOptions = config.DB_CONNECTION_OPTIONS;

const initialize = async () => {
  try {
    const dbUri = dbHelper.getConnectionScring({
      dbPrefix,
      dbUser,
      dbPassword,
      dbServer,
      dbPort,
      dbName,
      dbConnectionOptions
    });

    console.log(dbUri);
    await mongoose.connect(dbUri, {
      useNewUrlParser: true
    });

    console.log('Mongo Connected!');
  } catch (error) {
    throw error;
  }
};

module.exports = { initialize };
