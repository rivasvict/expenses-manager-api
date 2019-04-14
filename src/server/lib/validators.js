const validateEmailFormat = (value) => {
  const emailPattern = /\w*.*@\w*.*\.\w*.*/g;
  return value.match(emailPattern) || false;
};

module.exports = { validateEmailFormat };
