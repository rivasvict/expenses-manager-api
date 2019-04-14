const expect = require('chai').expect;
const sinon = require('sinon');

const RoutesHandler = require('./routesHandler.js');

describe('Test for generic handlers on index.js definition', function () {
  beforeEach('Test preparation for whitelisted paths', function () {
    this.middleware = sinon.fake();
    this.unlessMiddleware = RoutesHandler.unless(this.middleware, '/login', '/sign-up');
  });

  it('Should call next on whitelisted paths', function () {
    const reqs = [
      { originalUrl: '/login' },
      { originalUrl: '/sign-up' }
    ];
    const next = sinon.fake();
    reqs.forEach((req) => {
      const res = {};
      this.unlessMiddleware(req, res, next);
    });
    expect(next.callCount).to.be.equal(2);
    expect(this.middleware.callCount).to.be.equal(0);
  });

  it('Should call original middleware on paths that are NOT whitelisted', function () {
    const reqs = [
      { originalUrl: '/dashboard' },
      { originalUrl: '/logout' }
    ];
    const next = sinon.fake();
    reqs.forEach((req) => {
      const res = {};
      this.unlessMiddleware(req, res, next);
    });
    expect(next.callCount).to.be.equal(0);
    expect(this.middleware.callCount).to.be.equal(2);
  });

  it('Should call exact number of times depending on whitelisted router or not', function () {
    const reqs = [
      { originalUrl: '/dashboard' },
      { originalUrl: '/logout' },
      { originalUrl: '/login' },
      { originalUrl: '/sign-up' }
    ];
    const next = sinon.fake();
    reqs.forEach((req) => {
      const res = {};
      this.unlessMiddleware(req, res, next);
    });
    expect(next.callCount).to.be.equal(2);
    expect(this.middleware.callCount).to.be.equal(2);
  });

  afterEach('Test preparation for whitelisted paths', function () {
    sinon.restore();
  });
});
