const getEntryInstanceWithISODate = ({ Entry, entry }) => {
  debugger;
  const entryInstance = new Entry(entry);
  entryInstance.setISODateFromUnixTimestamp();
  return entryInstance;
};

const addEntry = ({ Entry }) => (entry) => {
  try {
    const entryInstance = getEntryInstanceWithISODate({ Entry, entry });
    return entryInstance.create();
  } catch (error) {
    throw error;
  }
};

const getEntriesByAccountId = ({ Entry }) => (accountId) => {
  try {
    return Entry.getEntriesByAccountId(accountId);
  } catch (error) {
    throw error;
  }
};

module.exports = ({ Entry }) => ({
  addEntry: addEntry({ Entry }),
  getEntriesByAccountId: getEntriesByAccountId({ Entry })
});
