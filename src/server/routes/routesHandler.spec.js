const { expect } = require('chai');
const sinon = require('sinon');

const RoutesHandler = require('./routesHandler.js');

describe('Test for generic handlers on index.js definition', function () {
  beforeEach('Test preparation for whitelisted paths', function () {
    this.blackListedMiddlewareOne = sinon.stub().callsFake((req, res, next) => {
      next();
    });
    this.blackListedMiddlewareTwo = sinon.stub().callsFake((req, res, next) => {
      next();
    });
    this.blackListedMiddlewareThree = sinon.stub().callsFake((req, res, next) => {
      next();
    });
    this.unlessMiddleware = RoutesHandler.mountMiddlewaresUnless([
      this.blackListedMiddlewareOne,
      this.blackListedMiddlewareTwo,
      this.blackListedMiddlewareThree
    ], '/login', '/sign-up');
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
    expect(this.blackListedMiddlewareOne.callCount).to.be.equal(0);
    expect(this.blackListedMiddlewareTwo.callCount).to.be.equal(0);
    expect(this.blackListedMiddlewareThree.callCount).to.be.equal(0);
  });

  it('Should call original middleware on paths that are NOT whitelisted', function () {
    const reqs = [
      { originalUrl: '/dashboard' },
      { originalUrl: '/logout' },
      { originalUrl: '/login' }
    ];
    const next = sinon.fake();
    reqs.forEach((req) => {
      const res = {};
      this.unlessMiddleware(req, res, next);
    });
    expect(next.callCount).to.be.equal(3);
    expect(this.blackListedMiddlewareOne.callCount).to.be.equal(2);
    expect(this.blackListedMiddlewareTwo.callCount).to.be.equal(2);
    expect(this.blackListedMiddlewareThree.callCount).to.be.equal(2);
  });

  afterEach('Test preparation for whitelisted paths', function () {
    sinon.restore();
  });
});
