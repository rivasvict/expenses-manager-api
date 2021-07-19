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

  static async runAsMiddlewares({ req, res, middlewares, lastMiddleware }) {
    try {
      let nextMiddlewareIndex = -1;

      const next = async () => {
        nextMiddlewareIndex += 1;
        if (middlewares[nextMiddlewareIndex]) {
          await middlewares[nextMiddlewareIndex](req, res, next);
        } else {
          // No middleware parameters since the lastMiddleware
          // runs natively as the express next function
          await lastMiddleware();
        }
      };
      await next();
    } catch (error) {
      throw error;
    }
  }

  /*
   * Prevent whitelisted paths from running given middlewares.
   * Instead, skip and run next middleware
   */
  static mountMiddlewaresUnless(middlewares, ...whitelistedPaths) {
    return async (req, res, next) => {
      const requestedRoute = req.originalUrl;
      const isItWhitelistedPath = whitelistedPaths
        .find(whitelistedPath => whitelistedPath === requestedRoute);
      if (isItWhitelistedPath) {
        await next();
      } else {
        await RoutesHandler.runAsMiddlewares({
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
