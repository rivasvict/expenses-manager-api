const bcrypt = require('bcrypt');
const config = require('../../../config.js');

const SALT_DEFAULT_WORK_FACTOR = parseInt(config.SALT_DEFAULT_WORK_FACTOR, 10);
const getSaltHash = async ({ dataToHash, saltWorkFactor = SALT_DEFAULT_WORK_FACTOR }) => {
  try {
    const salt = await bcrypt.genSalt(saltWorkFactor);
    return bcrypt.hash(dataToHash, salt);
  } catch (error) {
    throw error;
  }
};

const compareHashed = ({ plainString, hashedString }) => {
  try {
    debugger;
    return bcrypt
      .compare(plainString, hashedString);
  } catch (error) {
    debugger;
    throw new Error(error);
  }
};

module.exports = { getSaltHash, compareHashed };
