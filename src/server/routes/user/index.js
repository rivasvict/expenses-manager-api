const wrap = require('express-async-wrapper');

const loginRouteHandler = authentication => async (req, res) => {
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

const signUpRouteHandler = userModule => async (req, res) => {
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

const logOutHandler = authentication => async (req, res) => {
  try {
    const bearer = req.headers.authorization;
    if (bearer) {
      await authentication.invalidateToken(bearer);
      res.status(200).json({ messaje: 'Successfully logged out' });
    } else {
      res.status(400).json({ message: 'Bearer is missing' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    throw error;
  }
};

const mountUserRoutes = ({ authentication, userModule }) => ({ router, baseUrl }) => {
  // /api/user/login
  router.post(`${baseUrl}/login`, wrap(loginRouteHandler(authentication)));
  // /api/user/sign-up
  router.post(`${baseUrl}/sign-up`, wrap(signUpRouteHandler(userModule)));
  // /api/user/log-out
  router.post(`${baseUrl}/log-out`, wrap(logOutHandler(authentication)));
};

module.exports = mountUserRoutes;
