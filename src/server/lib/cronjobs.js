const Cron = require('cron');
const { removeInvalidTokensFromBlackList } = require('../modules/authentication.js');

const cronTab = [{
  schedule: '0 0 * * *', // Evryday at midnight
  task: removeInvalidTokensFromBlackList
}];

const start = ({ schedule, task }) => {
  new Cron(schedule, task);
};

const init = () => {
  cronTab.forEach(cronJob => start({ schedule: cronJob.schedule, task: cronJob.task }));
};

const cronJobs = {
  init
};

module.exports = cronJobs;
