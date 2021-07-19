const mockedData = require('./data.json');

const getMocked = () => async (req, res) => {
  try {
    await res.status(200).json(mockedData);
  } catch (error) {
    throw error;
  }
};

// TODO: COMPLETE THE LOGIC OF SETTING A RECORD
const setRecordMocked = () => async (req, res) => {
  try {
    await res.status(200).json();
  } catch (error) {
    throw error;
  }
};

const mountMockedRoutes = ({ wrap }) => ({ router, baseUrl }) => {
  // TODO: For the handler of this function, add a way for
  // us to be able to send query params to define the
  // number of months we will get from this query
  router.get(`${baseUrl}/`, wrap(getMocked()));
  router.post(`${baseUrl}/`, wrap(setRecordMocked()));
};

module.exports = mountMockedRoutes;
