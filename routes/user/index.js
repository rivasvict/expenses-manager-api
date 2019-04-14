const wrap = require('express-async-wrapper');

const authentication = require('../../modules/authentication.js');
const userModule = require('../../modules/user.js');

const loginRouteHandler = async (req, res) => {
  try {
    const { email } = req.body.user;
    const { password } = req.body.user;
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

const signUpRouteHandler = async (req, res) => {
  try {
    const user = await userModule.signUp(req.body.user);
    res.status(200).json(user);
  } catch (error) {
    if ((error.name === 'ValidationError') || (error.message === 'Duplicated user')) {
      res.status(error.name === 'ValidationError' ? 400 : 409)
        .json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
      throw error;
    }
  }
};

const mountUserRoutes = ({ router, baseUrl }) => {
  // /api/user/login
  router.post(`${baseUrl}/login`, wrap(loginRouteHandler));
  // /api/user/sign-up
  router.post(`${baseUrl}/sign-up`, wrap(signUpRouteHandler));
  /*
    * TODO: Remove this testing route
    */
  router.get(`${baseUrl}/bla`, (req, res) => {
    res.sendStatus(200);
  });
};

module.exports = mountUserRoutes;
