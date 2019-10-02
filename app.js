const express = require('express');
debugger;
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./src/server/db');
const config = require('./config.js');
const cronJobs = require('./src/server/lib/cronjobs.js');

db.initialize();
cronJobs.initialize();
const router = require('./src/server/routes/');

const app = express();

if (config.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(router);

module.exports = app;
