const getDbModel = ({ db, modelName, schema }) => {
  const existingUserModel = db && db.models && db.models[modelName];
  return existingUserModel || db.model(modelName, schema);
};

const getConnectionScring = ({ dbPrefix = '', dbUser = '', dbPassword = '', dbServer = '', dbPort = '', dbName = '', dbConnectionOptions = '' }) => {
  const port = dbPort.length ? `:${dbPort}` : '';
  return `${dbPrefix}://${dbUser}:${dbPassword}@${dbServer}${port}/${dbName}${dbConnectionOptions}`;
};

const dbHelper = {
  getDbModel,
  getConnectionScring
};

module.exports = dbHelper;
