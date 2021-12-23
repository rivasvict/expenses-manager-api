const sendLoginSuccessResponseToClient = () => (req, res) => {
  const { user, token } = req.body.authenticationDetails;
  if (token) {
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });
    res.status(200).json(user);
  }
};

const loginRouteHandler = authentication => async (req, res, next) => {
  try {
    const { username } = req.body.user;
    const { password } = req.body.user;
    const authenticationDetails = await authentication.verifyAuthenticUser(username, password);
    if (authenticationDetails) {
      req.body.authenticationDetails = authenticationDetails;
      next();
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500);
    throw error;
  }
};

// TODO: Move executeError into an error helper
const executeError = ({ res, error }) => {
  switch (error.name) {
    case 'ValidationError': return res.status(400).json(error);
    case 'duplicationError': return res.status(409).json(error);
    default: res.status(500).json({ message: 'Internal server error' }); return true;
  }
};

const signUpRouteHandler = userModule => async (req, res) => {
  try {
    const user = await userModule.signUp(req.body.user);
    res.status(200).json(user);
  } catch (error) {
    const serverError = executeError({ res, error });
    if (serverError === true) {
      throw error;
    }
  }
};

const logOutHandler = authentication => async (req, res) => {
  try {
    const bearer = req.cookies && req.cookies.token;
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

const getUserHandler = user => async (req, res) => {
  try {
    if (req.params.email) {
      const { email } = req.params;
      const userFromDb = await user.getUser(email);

      if (userFromDb) {
        res.status(200).json(userFromDb);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(400).json({ message: 'Missing user object' });
    }
  } catch (error) {
    throw error;
  }
};

const mountUserRoutes = ({ authenticationModule, userModule, wrap }) => ({ router, baseUrl }) => {
  // /api/user/login
  router.post(`${baseUrl}/login`, wrap(loginRouteHandler(authenticationModule)), sendLoginSuccessResponseToClient());
  // /api/user/sign-up
  router.post(`${baseUrl}/sign-up`, wrap(signUpRouteHandler(userModule)));
  // /api/user/log-out
  router.post(`${baseUrl}/log-out`, wrap(logOutHandler(authenticationModule)));
  // /api/user/get
  router.get(`${baseUrl}/get/:email`, wrap(getUserHandler(userModule)));
};

module.exports = mountUserRoutes;
