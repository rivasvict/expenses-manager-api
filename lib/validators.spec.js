const { expect } = require('chai');
const sinon = require('sinon');

const { validateEmailFormat } = require('./validators');

describe('Test for validators', function () {
  beforeEach('Set validation email spy', function () {
    this.validationEmailSpy = sinon.spy(validateEmailFormat);
  });

  it('Should return false when worngly formated email', function () {
    const wornglyFormatedEmails = [
      'sfgsdf',
      'sfgsdf@',
      'sfgsdf@jhg',
      'sfgsdf@j hg',
      'sfgsdf@j hg',
      'sfgsdf@jhg asdd',
      '@jhg asdd',
      'ahfushaa@gmailcom'
    ];
    wornglyFormatedEmails.forEach((wornglyFormatedEmail, index) => {
      this.validationEmailSpy(wornglyFormatedEmail);
      expect((this.validationEmailSpy.getCall(index).returnValue)).to.be.equal(false);
    });
  });

  it('Should return email when correctly formated email', function () {
    const correctlyFormatedEmails = [
      'a@a.c',
      'a.a@a.c',
      'a7-6.a@a.c'
    ];
    correctlyFormatedEmails.forEach((correctlyFormatedEmail, index) => {
      this.validationEmailSpy(correctlyFormatedEmail);
      expect((this.validationEmailSpy.getCall(index).returnValue))
        .to.deep.equal([correctlyFormatedEmail]);
    });
  });
});
