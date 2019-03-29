const wrap = require('express-async-wrapper');

const authentication = require('../../modules/authentication.js');

const loginRouteHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const { password } = req.body;
    const userToken = await authentication.verifyAuthenticUser(email, password);
    if (userToken) {
      res.status(200).json({ userToken });
    } else {
      res.status(403).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500);
    throw error;
  }
};

const mountAuthenticationRoutes = ({ router, baseUrl }) => {
  // /api/authentication/login
  router.post(`${baseUrl}/login`, wrap(loginRouteHandler));
  /*
    * TODO: Remove this testing route
    */
  router.get(`${baseUrl}/bla`, wrap((req, res) => {
    res.sendStatus(200);
  }));
};

module.exports = mountAuthenticationRoutes;
