const express = require('express');
const wrap = require('express-async-wrapper');

const router = express.Router();
const userRoutes = require('./user/');

const { userModule, authenticationModule, passportHandlerModule } = require('../modules');

const mountUserRoutes = userRoutes({ authenticationModule, userModule, wrap });
const RoutesHandler = require('./routesHandler');
const cors = require('cors');

const baseApiUrl = '/api';
const routesHandler = new RoutesHandler({
  router,
  baseApiUrl
});

const jwtStrategy = passportHandlerModule.isAuthorized;
// TODO: Configure development CORS policies

const whiteListedRoutesGenericHandler = RoutesHandler.mountMiddlewaresUnless(
  // Mount to whatever it is in this array to all existing routes
  [
    jwtStrategy
  ],
  // Except from these routes
  '/api/user/login',
  '/api/user/sign-up',
  '/api/user/log-out'
);

router.use(`${baseApiUrl}*`, cors(), wrap(whiteListedRoutesGenericHandler));

/*
 * TODO: Make an additional manual test (besides automated) on authenticated routes
 * when using an exired token.
 */

routesHandler.mountRoute({ mountRouteCallback: mountUserRoutes, mainRouteUrl: '/user' });

module.exports = router;
