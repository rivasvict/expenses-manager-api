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
}

module.exports = RoutesHandler;
