module.exports = {
  MODEL_NAMES: {
    USER: 'User',
    ACCOUNT: 'Account',
    CATEGORY: 'Category',
    EXPENSE: 'Expense'
  },
  CURRENCIES: [
    'USD',
    'CAD'
  ],
  CATEGOTY_TYPES: [
    'income',
    'outcome'
  ],
  RESPONSE: {
    STATUSES: {
      UNAUTHORIZED: 403,
      OK: 200,
      ERROR: 500
    },
    MESSAGES: {
      SESSION_EXPIRED: 'Session expired'
    }
  }
};
