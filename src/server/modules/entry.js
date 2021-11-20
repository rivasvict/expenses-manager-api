const addEntry = ({ Entry }) => (entry) => {
  try {
    const entryInstance = new Entry(entry);
    return entryInstance.create();
  } catch (error) {
    throw error;
  }
};

module.exports = ({ Entry }) => ({
  addEntry: addEntry({ Entry })
});
