const customErrorMessages = require('./customErrorMessages.json');

const getParsedErrorFromDb = ({ error, customFields }) => {
  let message = customErrorMessages[error.code];

  if (message) {
    Object.keys(customFields)
      .forEach((customField) => {
        message = message.replace(`{${customField}}`, `${customFields[customField]}`);
      });
  }

  return message || error.message;
};

module.exports = { getParsedErrorFromDb };
