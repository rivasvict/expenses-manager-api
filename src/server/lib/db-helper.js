const getDbModel = ({ db, modelName, schema }) => {
  const existingUserModel = db && db.models && db.models[modelName];
  return existingUserModel || db.model(modelName, schema);
};

const getConnectionScring = ({ dbPrefix = '', dbUserName = '', dbPassword = '', dbServer = '', dbPort = '', dbName = '', connectionOptions = '' }) => {
  const port = dbPort.length ? `:${dbPort}` : '';
  return `${dbPrefix}://${dbUserName}:${dbPassword}@${dbServer}${port}/${dbName}${connectionOptions}`;
};

const dbHelper = {
  getDbModel,
  getConnectionScring
};

module.exports = dbHelper;
