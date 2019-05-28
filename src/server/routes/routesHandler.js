const _ = require('lodash');

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

  static runAsMiddlewares(middlewareRunOptions) {
    const { req, res, middlewares, lastMiddleware } = middlewareRunOptions;
    let nextMiddlewareIndex = -1;

    const next = () => {
      nextMiddlewareIndex += 1;
      if (middlewares[nextMiddlewareIndex]) {
        middlewares[nextMiddlewareIndex](req, res, next);
      } else {
        lastMiddleware();
      }
    };

    next();
  }

  /*
  * Prevent whitelisted paths from running given middlewares.
  * Instead, skip and run next middleware
  */
  static mountMiddlewaresUnless(middlewares, ...whitelistedPaths) {
    return (req, res, next) => {
      const requestedRoute = req.originalUrl;
      const isItWhitelistedPath = whitelistedPaths
        .find(whitelistedPath => whitelistedPath === requestedRoute);
      if (isItWhitelistedPath) {
        next();
      } else {
        RoutesHandler.runAsMiddlewares({
          req,
          res,
          middlewares,
          lastMiddleware: next
        });
      }
    };
  }
}

module.exports = RoutesHandler;
