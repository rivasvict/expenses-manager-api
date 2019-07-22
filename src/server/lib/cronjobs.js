const { CronJob } = require('cron');
const { removeInvalidTokensFromBlackList } = require('../modules/authentication.js');

const cronTab = [{
  schedule: '0 0 * * *', // Evryday at midnight
  task: removeInvalidTokensFromBlackList
}];

const start = ({ schedule, task }) => {
  new CronJob(schedule, task);
};

const initialize = () => {
  cronTab.forEach(cronJob => start({ schedule: cronJob.schedule, task: cronJob.task }));
};

const cronJobs = {
  initialize
};

module.exports = cronJobs;
