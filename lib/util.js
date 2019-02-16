const bcrypt = require('bcrypt');
require('dotenv').config();

const getSaltHash = async ({ dataToHash, saltWorkFactor = process.env.SALT_DEFAULT_WORK_FACTOR }) => {
  try {
    const salt = await bcrypt.genSalt(saltWorkFactor);
    return bcrypt.hash(dataToHash, salt);
  } catch (error) {
    throw error;
  }
};

module.exports.getSaltHash = getSaltHash;
