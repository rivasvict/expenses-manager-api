const express = require('express');

const router = express.Router();
const mountAuthenticationRoutes = require('./authentication/');
const RoutesHandler = require('./routesHandler.js');

const baseApiUrl = '/api';
const routesHandler = new RoutesHandler({ router, baseApiUrl });

routesHandler.mountRoute({ mountRouteCallback: mountAuthenticationRoutes, mainRouteUrl: '/authentication' });

module.exports = router;
