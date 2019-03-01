const { expect } = require('chai');
const sinon = require('sinon');

const { validateEmailFormat } = require('./validators');

describe('Test for validators', function () {
  it('Should return false when worngly formated email', function () {
    const validationEmailSpy = sinon.spy(validateEmailFormat);
    validationEmailSpy('sfgsdf');
    validationEmailSpy('sfgsdf@');
    validationEmailSpy('sfgsdf@jhg');
    validationEmailSpy('sfgsdf@j hg');
    validationEmailSpy('sfgsdf@jhg asdd');
    validationEmailSpy('@jhg asdd');
    expect((validationEmailSpy.getCall(0).returnValue)).to.be.equal(false);
    expect((validationEmailSpy.getCall(1).returnValue)).to.be.equal(false);
    expect((validationEmailSpy.getCall(2).returnValue)).to.be.equal(false);
    expect((validationEmailSpy.getCall(3).returnValue)).to.be.equal(false);
    expect((validationEmailSpy.getCall(4).returnValue)).to.be.equal(false);
    expect((validationEmailSpy.getCall(5).returnValue)).to.be.equal(false);
  });
  it('Should return email when correctly formated email');
});
