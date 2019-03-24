const express = require('express');

const router = express.Router();
const mountAuthenticationRoutes = require('./authentication/');

const baseApiUrl = '/api';
const getBaseUrl = ulrToRebase => `${baseApiUrl}${ulrToRebase}`;

mountAuthenticationRoutes({ router, baseUrl: getBaseUrl('/authentication') });
debugger;

module.exports = router;
