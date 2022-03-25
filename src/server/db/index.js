const mongoose = require('mongoose');
const config = require('../../../config.js');

const dbCredentials = `${config.DB_USER}:${config.DB_PASSWORD}`;
const authenticatedMongoUrl = dbCredentials;
const dbServer = config.DB_SERVER;
const dbPort = config.DB_PORT;
const dbName = config.DB_NAME;
// TODO: Send this to the config file
const isRemoteDb = true;
const dbConnectionQueryStringParameters = `?retryWrites=true&w=majority`;
const connectionPrefix = isRemoteDb ? `mongodb+srv` : `mongodb`;
const dbPortForLocalDb = isRemoteDb ? ``: `:${dbPort}`;

const initialize = async () => {
  try {
    const dbUrl = `${connectionPrefix}://${authenticatedMongoUrl}@${dbServer}${dbPortForLocalDb}/${dbName}${dbConnectionQueryStringParameters}`;

    await mongoose.connect(dbUrl, {
      useNewUrlParser: true
    });

    console.log('Mongo Connected!');
  } catch (error) {
    throw error;
  }
};

module.exports = { initialize };
