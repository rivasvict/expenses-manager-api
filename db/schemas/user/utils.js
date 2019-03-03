const { getSaltHash } = require('../../../lib/util.js');

const addPasswordEncryptionPreSaveHook = ({ schema, fieldToHash }) => {
  schema.pre('save', async function (next) {
    const document = this;
    if (document.isModified(fieldToHash)) {
      try {
        const hash = await getSaltHash({ dataToHash: document[fieldToHash] });
        document.set(fieldToHash, hash);
        next();
      } catch (error) {
        throw error;
      }

      next();
    }
  });
};

module.exports = {
  addPasswordEncryptionPreSaveHook
};
