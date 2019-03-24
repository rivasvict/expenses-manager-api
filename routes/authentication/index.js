const validateRouterObjectxsitance = (router) => {
  if (!router) {
    throw new Error({
      name: 'MissingParameter',
      message: 'Router parameter was not set, please make sure to send it'
    });
  }
};

const checkBaseUrl = (baseUrl = '/') => {
  if (baseUrl === '/') {
    console.warn(`Using ${baseUrl} (default), to set a custom one, please set baseUrl properly`);
  }
};

const validationForRoute = ({ router, baseUrl }) => {
  validateRouterObjectxsitance(router);
  checkBaseUrl(baseUrl);
};

const mountAuthenticationRoutes = ({ router, baseUrl }) => {
  validationForRoute({ router, baseUrl });

  router.post(`${baseUrl}/authenticate`, (req, res) => {
    res.sendStatus(200);
  });
};

module.exports = mountAuthenticationRoutes;
