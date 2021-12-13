module.exports = {
  MODEL_NAMES: {
    USER: 'User',
    ACCOUNT: 'Account',
    CATEGORY: 'Category',
    ENTRY: 'Entry'
  },
  CURRENCIES: [
    'USD',
    'CAD'
  ],
  ENTRY_TYPES: [
    'income',
    'expense'
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
