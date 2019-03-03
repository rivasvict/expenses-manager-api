const mongoose = require('mongoose');
require('dotenv').config();

const isDebugEnabled = process.env.DEBUG;
const dbCredentials = `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`;
const dbTestCredentials = `${process.env.DB_TEST_USER}:${process.env.DB_TEST_PASSWORD}@`;
const authenticatedMongoUrl = isDebugEnabled ? dbTestCredentials : dbCredentials;
const dbServer = isDebugEnabled ? process.env.DB_TEST_SERVER : process.env.DB_SERVER;
const dbPort = isDebugEnabled ? process.env.DB_TEST_PORT : process.env.DB_PORT;
const dbName = isDebugEnabled ? process.env.DB_TEST_NAME : process.env.DB_NAME;
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
