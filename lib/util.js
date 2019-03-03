const bcrypt = require('bcrypt');
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

module.exports.getSaltHash = getSaltHash;
