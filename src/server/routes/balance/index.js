const mockedData = require('./mocks/balance-response.json');

const getMocked = ({ entryModule }) => async (req, res) => {
  try {
    const accountId = req.user.accounts[0];
    const result = await entryModule.getEntriesByAccountId(accountId);
    await res.status(200).json(mockedData);
  } catch (error) {
    throw error;
  }
};

// TODO: COMPLETE THE LOGIC OF SETTING A RECORD
const addEntry = ({ entryModule }) => async (req, res) => {
  try {
    const entry = req.body;
    // TODO: The failing test is due to
    // The backend having a responsibility it should not
    // (extracting the account number in the route. This
    // Should be already processed and sent to the request
    // Of this endpoint
    const accountId = req.user.accounts[0];
    const addedEntry = await entryModule.addEntry({ account_id: accountId, ...entry });
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
  router.get(`${baseUrl}/`, wrap(getMocked({ entryModule })));
  router.post(`${baseUrl}/`, wrap(addEntry({ entryModule })));
};

module.exports = mountMockedRoutes;
