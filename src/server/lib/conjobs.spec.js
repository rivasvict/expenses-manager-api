const rewire = require('rewire');
const sinon = require('sinon');
const { expect } = require('chai');
const mock = require('mock-require');

mock('../modules/cache.js', {});

const cronJobs = rewire('./cronjobs.js');

describe('Cron jobs test', function () {
  describe('Check cronJob initializeialization', function () {
    beforeEach('Fake start call', function () {
      this.cronTab = [
        { schedule: '* * * * *', task: () => {} },
        { schedule: '2 * * * *', task: () => {} },
        { schedule: '0 23 * * *', task: () => {} }
      ];
      this.restoreCronJobs = cronJobs.__set__('cronTab', this.cronTab);
      this.startFake = sinon.fake(() => {});
      this.restoreStart = cronJobs.__set__('start', this.startFake);
      cronJobs.initialize();
    });

    after('Stop all mocks on require', function () {
      mock.stopAll();
    });

    it('Should have called all cron instances constructor', function () {
      expect(this.startFake.callCount).to.be.equal(this.cronTab.length);
    });

    afterEach('Restore initialization fakes', function () {
      this.restoreStart();
    });
  });

  describe('Start function', function () {
    beforeEach('Prepare stubs and mocks for start function', function () {
      this.CronStub = sinon.fake(function () {});
      this.restoreCron = cronJobs.__set__('Cron', this.CronStub);
      this.start = cronJobs.__get__('start');
    });

    it('Should call new cron instance with correct data', function () {
      const task = () => {};
      const schedule = '0 23 * * *';
      this.start({ task, schedule });
      expect(this.CronStub.calledWith(schedule, task)).to.be.equal(true);
      expect(this.CronStub.callCount).to.be.equal(1);
    });
  });
});
