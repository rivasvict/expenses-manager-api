const mockedData = require('./balance.json');

const getMocked = () => async (req, res) => {
  try {
    await res.status(200).json(mockedData);
  } catch (error) {
    throw error;
  }
};

// TODO: COMPLETE THE LOGIC OF SETTING A RECORD
const addEntry = ({ entryModule }) => async (req, res) => {
  try {
    const entry = req.body;
    const addedEntry = await entryModule.addEntry(entry);
    await res.status(200).json(addedEntry);
  } catch (error) {
    res.status(500);
    throw error;
  }
};

const mountMockedRoutes = ({ wrap, entryModule }) => ({ router, baseUrl }) => {
  // TODO: For the handler of this function, add a way for
  // us to be able to send query params to define the
  // number of months we will get from this query
  router.get(`${baseUrl}/`, wrap(getMocked()));
  router.post(`${baseUrl}/`, wrap(addEntry({ entryModule })));
};

module.exports = mountMockedRoutes;
