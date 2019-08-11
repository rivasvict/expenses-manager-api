const getDbModel = ({ db, modelName, schema }) => {
  const existingUserModel = db && db.models && db.models[modelName];
  return existingUserModel || db.model(modelName, schema);
};

const dbHelper = {
  getDbModel
};

module.exports = dbHelper;
