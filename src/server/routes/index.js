const express = require('express');
const wrap = require('express-async-wrapper');

const router = express.Router();
const cors = require('cors');
const userRoutes = require('./user/');

const { userModule, authenticationModule, passportHandlerModule, entryModule } = require('../modules');

const mountUserRoutes = userRoutes({ authenticationModule, userModule, wrap });
const RoutesHandler = require('./routesHandler');

const baseApiUrl = '/api';
const routesHandler = new RoutesHandler({
  router,
  baseApiUrl
});

// MOCKED ROUTES
const balanceRoutes = require('./balance/index');
const { FRONTEND_SERVER_ADDRESS } = require('../../../config');

const mountBalanceRoutes = balanceRoutes({ wrap, entryModule });

const jwtStrategy = passportHandlerModule.isAuthorized;
// TODO: Configure development CORS policies

const globalMiddlewaresWithWhitelistedRoutes = RoutesHandler.mountMiddlewaresUnless(
  // Mount to whatever it is in this array to all existing routes
  [
    jwtStrategy
  ],
  // Except from these routes
  `${baseApiUrl}/user/login`,
  `${baseApiUrl}/user/sign-up`
);

router.use(`${baseApiUrl}*`, cors({
  origin: [
    FRONTEND_SERVER_ADDRESS
  ],
  credentials: true
}), wrap(globalMiddlewaresWithWhitelistedRoutes));

/*
 * TODO: Make an additional manual test (besides automated) on authenticated routes
 * when using an exired token.
 */

routesHandler.mountRoute({ mountRouteCallback: mountUserRoutes, mainRouteUrl: '/user' });
routesHandler.mountRoute({ mountRouteCallback: mountBalanceRoutes, mainRouteUrl: '/balance' });

module.exports = router;
