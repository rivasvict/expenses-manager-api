const mongoose = require('mongoose');
require('dotenv').config();

const authenticatedMongoUrl = `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`;
const dbServer = process.env.DEBUG ? process.env.DB_TEST_SERVER : process.env.DB_SERVER;
const dbPort = process.env.DEBUG ? process.env.DB_TEST_PORT : process.env.DB_PORT;
const dbName = process.env.DEBUG ? process.env.DB_TEST_NAME : process.env.DB_NAME;
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
