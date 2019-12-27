const express = require('express');
const wrap = require('express-async-wrapper');

const router = express.Router();
const userRoutes = require('./user/');

const { userModule, authenticationModule } = require('../modules');

const mountUserRoutes = userRoutes({ authenticationModule, userModule });
const RoutesHandler = require('./routesHandler');
const passportHandlers = require('../modules/passportHandlers');
const cors = require('cors');

const baseApiUrl = '/api';
const routesHandler = new RoutesHandler({
  router,
  baseApiUrl
});

const jwtStrategy = passportHandlers.isAuthorized;
// TODO: Configure development CORS policies

router.use(`${baseApiUrl}/*`, cors(), wrap(RoutesHandler.mountMiddlewaresUnless(
  [
    jwtStrategy
  ],
  '/api/user/login',
  '/api/user/sign-up',
  '/api/user/log-out'
)));

/*
 * TODO: Make an additional manual test (besides automated) on authenticated routes
 * when using an exired token.
 */

routesHandler.mountRoute({ mountRouteCallback: mountUserRoutes, mainRouteUrl: '/user' });

module.exports = router;
