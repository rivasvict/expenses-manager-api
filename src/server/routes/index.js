const express = require('express');

const router = express.Router();
const mountUserRoutes = require('./user/');
const RoutesHandler = require('./routesHandler.js');
const passport = require('../modules/passport.js');

const baseApiUrl = '/api';
const routesHandler = new RoutesHandler({
  router,
  baseApiUrl
});

const jwtStrategy = passport.authenticate('jwt', {
  session: false
});

router.use(`${baseApiUrl}/*`, RoutesHandler.mountMiddlewaresUnless(
  [
    jwtStrategy
  ],
  '/api/user/login',
  '/api/user/sign-up'
));

routesHandler.mountRoute({ mountRouteCallback: mountUserRoutes, mainRouteUrl: '/user' });

module.exports = router;
