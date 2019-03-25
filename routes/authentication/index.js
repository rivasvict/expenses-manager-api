const wrap = require('express-async-wrapper');

const { verifyAuthenticUser } = require('../../modules/authentication.js');

const loginRouteHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const { password } = req.body;
    const userToken = await verifyAuthenticUser(email, password);
    if (userToken) {
      res.sendStatus(200).json({ userToken });
    } else {
      res.sendStatus(403).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.sendStatus(500);
    throw error;
  }
};

const mountAuthenticationRoutes = ({ router, baseUrl }) => {
  // /api/authentication/login
  router.post(`${baseUrl}/login`, wrap(loginRouteHandler));
};

module.exports = mountAuthenticationRoutes;
