const { getSaltHash } = require('../../../lib/util.js');

const addPasswordEncryptionPreSaveHook = (schema) => {
  schema.pre('save', async function (next) {
    const document = this;
    if (document.isModified('password')) {
      try {
        const hash = await getSaltHash({ dataToHash: document.password });
        document.set('password', hash);
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
