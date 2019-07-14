const express = require('express');
const wrap = require('express-async-wrapper');

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

router.use(`${baseApiUrl}/*`, wrap(RoutesHandler.mountMiddlewaresUnless(
  [
    jwtStrategy
  ],
  '/api/user/login',
  '/api/user/sign-up',
  '/api/user/log-out'
)));

routesHandler.mountRoute({ mountRouteCallback: mountUserRoutes, mainRouteUrl: '/user' });

module.exports = router;
