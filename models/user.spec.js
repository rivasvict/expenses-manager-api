const { expect } = require('chai');
const { setupRecorder } = require('nock-record');

const record = setupRecorder();

const User = require('./user');
const db = require('../db/');

describe('Test for User model', function () {
  beforeEach('Connect to DB', async function () {
    await db.initialize();
  });

  describe('User class', function () {
    beforeEach('Instance User class', function () {
      this.user = new User({
        password: 'myPassword',
        lastName: 'myLastName',
        email: 'asd',
        firstName: 'myFirstName'
      });
    });

    it('Should create user on db', async function () {
      const { completeRecording, assertScopesFinished } = await record('create-regular-user');
      const user = await this.user.create();

      completeRecording();
      assertScopesFinished();
      expect(true).to.be.equal(true);
    });
  });
});
