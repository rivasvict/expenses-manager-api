const expect = require('mocha');
const sinon = require('sinon');

const RoutesHandler = require('./routesHandler.js');

describe('Test for generic handlers on index.js definition', function () {
  before('Test preparation for whitelisted paths', function () {

  });

  it('Shoul call next on whitelisted paths', function () {
    const req = {};
    const res = {};
    const next = sinon.fake();
    const whitelistedPaths = [
      '/login',
      '/sign-up'
    ];
    const whitelistedMiddleware = sinon.fake();

    RoutesHandler.unless({ whitelistedPaths, whitelistedMiddleware });
  });
});
