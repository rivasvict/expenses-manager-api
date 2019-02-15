const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const addPasswordEncryptionToSaveMethod = (userSchema) => {
  userSchema.pre('save', (next) => {
    if (userSchema.isModified('password')) {
      bcrypt.getSalt(SALT_WORK_FACTOR, (error, salt) => {
        if (error) {
          return next();
        }

        bcrypt.hash(userSchema.password, salt, (err, hash) => {
          if (err) {
            return next();
          }

          userSchema.password = hash;
          return next();
        });
      });
    }

    return next();
  });
};

module.exports = {
  addPasswordEncryptionToSaveMethod
};
