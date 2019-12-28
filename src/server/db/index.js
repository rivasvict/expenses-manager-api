const mongoose = require('mongoose');
const config = require('../../../config.js');

const dbCredentials = `${config.DB_USER}:${config.DB_PASSWORD}@`;
const authenticatedMongoUrl = dbCredentials;
const dbServer = config.DB_SERVER;
const dbPort = config.DB_PORT;
const dbName = config.DB_NAME;

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
