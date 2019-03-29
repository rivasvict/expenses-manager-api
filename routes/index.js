const express = require('express');

const router = express.Router();
const mountAuthenticationRoutes = require('./authentication/');
const RoutesHandler = require('./routesHandler.js');
const passport = require('../modules/passport.js');

const baseApiUrl = '/api';
const routesHandler = new RoutesHandler({ router, baseApiUrl });
router.use(`${baseApiUrl}/*`, passport.authenticate('jwt', {
    sesion: false
  }));

routesHandler.mountRoute({ mountRouteCallback: mountAuthenticationRoutes, mainRouteUrl: '/authentication' });

module.exports = router;
