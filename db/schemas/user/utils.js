const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const addPasswordEncryptionToSaveMethod = (userSchema) => {
  userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
      bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
        if (!error) {
          return bcrypt.hash(user.password, salt, (err, hash) => {
            if (!err) {
              user.set('password', hash);
              user.password = hash;
              console.log(user);
            }

            return next();
          });
        }

        return next();
      });
    }
  });
};

module.exports = {
  addPasswordEncryptionToSaveMethod
};
