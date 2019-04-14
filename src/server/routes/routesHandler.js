class RoutesHandler {
  constructor({ router, baseApiUrl = '/api' }) {
    this.baseApiUrl = baseApiUrl;
    this.router = router;
  }

  getBaseUrl(routeToRebase) {
    return `${this.baseApiUrl}${routeToRebase}`;
  }

  mountRoute({ mountRouteCallback, mainRouteUrl = '/' }) {
    RoutesHandler.checkBaseUrl({
      mainRouteUrl,
      mountRouteCallbackFunctionName: mountRouteCallback.name
    });
    mountRouteCallback({ router: this.router, baseUrl: this.getBaseUrl(mainRouteUrl) });
  }

  static checkBaseUrl({ mainRouteUrl, mountRouteCallbackFunctionName }) {
    if (mainRouteUrl === '/') {
      console.warn(`${mountRouteCallbackFunctionName} Router: Using ${mainRouteUrl} (default), to set a custom one, please set baseUrl properly`);
    }
  }

  /*
  * Prevent whitelisted paths from running given middleware.
  * Instead, skip and run next middleware
  */
  static unless(middleware, ...whitelistedPaths) {
    return (req, res, next) => {
      const requestedRoute = req.originalUrl;
      const isItWhitelistedPath = whitelistedPaths
        .find(whitelistedPath => whitelistedPath === requestedRoute);
      if (isItWhitelistedPath) {
        next();
      } else {
        middleware(req, res, next);
      }
    };
  }
}

module.exports = RoutesHandler;
