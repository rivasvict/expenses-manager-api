const bcrypt = require('bcrypt');
const _ = require('lodash');
require('dotenv').config();

const SALT_DEFAULT_WORK_FACTOR = parseInt(process.env.SALT_DEFAULT_WORK_FACTOR);
const getSaltHash = async ({ dataToHash, saltWorkFactor = SALT_DEFAULT_WORK_FACTOR }) => {
  try {
    const salt = await bcrypt.genSalt(saltWorkFactor);
    return bcrypt.hash(dataToHash, salt);
  } catch (error) {
    throw error;
  }
};

const compareHashed = ({ plainString, hashedString }) => bcrypt
  .compare(plainString, hashedString);

const getObjectCopyWithoutKey = ({ obj, keyToRemove }) => _
  .transform(obj, (copiedObject, currentValue, currentKey) => {
    const newObject = copiedObject;
    if (keyToRemove !== currentKey) {
      newObject[currentKey] = currentValue;
    }
    return newObject;
  }, {});

module.exports = { getSaltHash, compareHashed, getObjectCopyWithoutKey };
