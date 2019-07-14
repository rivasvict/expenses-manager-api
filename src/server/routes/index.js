const express = require('express');

const router = express.Router();
const mountUserRoutes = require('./user/');
const RoutesHandler = require('./routesHandler.js');
const passportHandlers = require('../modules/passportHandlers.js');

const baseApiUrl = '/api';
const routesHandler = new RoutesHandler({
  router,
  baseApiUrl
});

const jwtStrategy = passportHandlers.isAuthorized;

router.use(`${baseApiUrl}/*`, RoutesHandler.mountMiddlewaresUnless(
  [
    jwtStrategy
  ],
  '/api/user/login',
  '/api/user/sign-up'
));

routesHandler.mountRoute({ mountRouteCallback: mountUserRoutes, mainRouteUrl: '/user' });

module.exports = router;
