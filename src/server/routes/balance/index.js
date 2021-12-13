const get = ({ entryModule }) => async (req, res) => {
  try {
    const accountId = req.user.accounts[0];
    const result = await entryModule.getEntriesByAccountId(accountId);
    await res.status(200).json(result);
  } catch (error) {
    throw error;
  }
};

const addEntry = ({ entryModule }) => async (req, res) => {
  try {
    const entry = req.body;
    // TODO: Change the wrong behavior of
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
  router.get(`${baseUrl}/`, wrap(get({ entryModule })));
  router.post(`${baseUrl}/`, wrap(addEntry({ entryModule })));
};

module.exports = mountMockedRoutes;
